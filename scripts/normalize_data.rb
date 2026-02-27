#!/usr/bin/env ruby
# frozen_string_literal: true

require "csv"
require "json"
require "date"
require "fileutils"

ROOT = File.expand_path("..", __dir__)
RAW_GLOB = File.join(ROOT, "raw_csv", "*.csv")
OUTPUT_DIR = File.join(ROOT, "data")

OUTPUT_HEADERS = [
  "record_uid",
  "source_file",
  "source_row_number",
  "dataset_year",
  "serial_number",
  "record_group",
  "included_in_main_tally",
  "case_number",
  "victim_name_he",
  "victim_name_ar",
  "age",
  "age_group",
  "gender_raw",
  "gender",
  "citizen_raw",
  "citizen_status",
  "religion",
  "residence_locality",
  "residence_locality_type",
  "residence_population_type",
  "geographic_area",
  "geographic_area_alt",
  "district_state",
  "district_police",
  "event_date_raw",
  "event_date_iso",
  "death_date_raw",
  "death_date_iso",
  "month_raw",
  "month_num",
  "incident_location",
  "exact_location",
  "solved_raw",
  "solved_status",
  "police_status",
  "weapon_raw",
  "weapon_type",
  "weapon_detail",
  "firearm_involved",
  "intent_raw",
  "background",
  "description",
  "notes",
  "source_url_1",
  "source_url_2"
].freeze

NON_PERSON_NAME_PATTERNS = [
  /ברשימה/,
  /פלסטינים/,
  /תושבי השטחים/,
  /נרצח בחו/,
  /נמצאה תלויה/
].freeze

def clean_text(value)
  text = value.to_s.encode("UTF-8", invalid: :replace, undef: :replace, replace: "")
  text.gsub("\uFEFF", "").strip
end

def header_key(value)
  text = clean_text(value)
  return "" if text.empty?

  text = text.downcase
  text = text.gsub(/[\"׳״'`?]/, "")
  text = text.gsub(/[,:;()\-–—\/\\]/, " ")
  text.gsub(/\s+/, " ").strip
end

def map_header_to_field(key)
  return nil if key.empty?

  case key
  when "מס ד", "מסד"
    :serial_number
  when "מספר מקרה", "מקרה"
    :case_number
  when "שם הקורבן"
    :victim_name_he
  when "שם בערבית"
    :victim_name_ar
  when "גיל"
    :age
  when "מין", "מגדר"
    :gender
  when "אזרח", "אזרח?"
    :citizen
  when "דת"
    :religion
  when "ישוב המגורים", "ישוב מגורים", "יישוב מגורים", "יישוב", "ישוב"
    :residence_locality
  when "סוג ישוב המגורים של הנרצח ת", "סוג יישוב המגורים של הנרצח ת"
    :residence_locality_type
  when "ישוב לפי אוכלוסיית התושבים", "יישוב לפי אוכלוסיית התושבים"
    :residence_population_type
  when "איזור", "איזור גיאוגרפי", "אזור גיאוגרפי"
    :geographic_area
  when "איזור לפי החלוקה של 2019"
    :geographic_area_alt
  when "מחוז", "מחוז מדינה"
    :district_state
  when "מחוז משטרה"
    :district_police
  when "תאריך אירוע"
    :event_date
  when "תאריך פטירה"
    :death_date
  when "חודש", "חודש 2019", "חודש 2020", "חודש 2021"
    :month
  when "מקום האירוע"
    :incident_location
  when "מיקום מדויק"
    :exact_location
  when "פוענח", "פוענח?", "פענוח", "פענוח?"
    :solved
  when "סטאטוס", "כתב אישום עצורים או פעילות משטרתית"
    :police_status
  when "כלי רצח", "כלי רצח ירי", "כלי הרג ירי אחר"
    :weapon_main
  when "כלי רצח אחר"
    :weapon_detail
  when "מכוון לא מכוון"
    :intent
  when "פירוט"
    :description
  when "סיווג רקע לאירוע", "רקע"
    :background
  when "הערות"
    :notes
  when "קישור"
    :source_url_1
  when "קישור2", "קישור 2"
    :source_url_2
  else
    nil
  end
end

def build_header_map(header_row)
  mapping = Hash.new { |hash, key| hash[key] = [] }

  header_row.each_with_index do |header_value, idx|
    field = map_header_to_field(header_key(header_value))
    mapping[field] << idx if field
  end

  mapping
end

def first_present_value(row, header_map, field)
  return "" unless header_map[field]

  header_map[field].each do |idx|
    value = clean_text(row[idx])
    return value unless value.empty?
  end

  ""
end

def parse_int(value)
  number = clean_text(value).scan(/\d+/).first
  number ? number.to_i : nil
end

def parse_date_components(raw_value, fallback_year)
  text = clean_text(raw_value)
  return nil if text.empty?

  parts = text.scan(/\d{1,4}/).map(&:to_i)
  return nil if parts.length < 2

  day = parts[0]
  month = parts[1]
  explicit_year = parts[2]
  year = if explicit_year
           explicit_year < 100 ? 2000 + explicit_year : explicit_year
         else
           fallback_year
         end
  if explicit_year && (year < 1990 || year > fallback_year + 1)
    year = fallback_year
    explicit_year = nil
  end

  date = Date.new(year, month, day)
  {
    raw: text,
    date: date,
    day: day,
    month: month,
    year: year,
    has_year: !explicit_year.nil?
  }
rescue Date::Error
  nil
end

def normalize_date_pair(event_raw, death_raw, dataset_year)
  event = parse_date_components(event_raw, dataset_year)
  death = parse_date_components(death_raw, dataset_year)

  # Handle records where year is omitted and event occurred in previous year.
  if event && death && !event[:has_year] && !death[:has_year] && event[:month] > death[:month]
    event_year = dataset_year - 1
    death_year = dataset_year
    event = event.merge(year: event_year, date: Date.new(event_year, event[:month], event[:day]))
    death = death.merge(year: death_year, date: Date.new(death_year, death[:month], death[:day]))
  end

  [event, death]
rescue Date::Error
  [event, death]
end

def normalize_gender(value)
  text = clean_text(value)
  return "Unknown" if text.empty?

  return "Male" if text.include?("גבר") || text == "ז"
  return "Female" if text.include?("אישה") || text.include?("אשה") || text.include?("נקבה") || text == "נ"

  "Unknown"
end

def normalize_citizen_status(value)
  text = clean_text(value)
  return "Unknown" if text.empty?

  return "Citizen" if text.include?("כן")
  return "Non-citizen" if text.include?("לא")

  "Unknown"
end

def normalize_solved_status(solved_raw, police_status_raw)
  solved_text = clean_text(solved_raw)
  police_text = clean_text(police_status_raw)
  merged = [solved_text, police_text].reject(&:empty?).join(" ")
  return "Unknown" if merged.empty?

  return "Solved/Indicted" if merged.include?("כתב אישום")
  return "Partially Solved" if merged.include?("עצור") || merged.include?("מעצר")
  return "Unsolved" if merged.include?("לא פוענח") || solved_text == "לא"
  return "Solved/Indicted" if solved_text == "כן" || merged.include?("פוענח")

  "Unknown"
end

def normalize_weapon_type(value, detail)
  text = [clean_text(value), clean_text(detail)].reject(&:empty?).join(" ")
  return "Unknown" if text.empty?

  return "Firearm" if text.include?("ירי")
  return "Sharp Object" if text.include?("דקירה") || text.include?("סכין")
  return "Vehicle" if text.include?("דריסה")
  return "Strangulation" if text.include?("חניקה")
  return "Explosive" if text.include?("מטען") || text.include?("פיצוץ")

  "Other"
end

def normalize_firearm(value, detail)
  text = [clean_text(value), clean_text(detail)].reject(&:empty?).join(" ")
  return "Unknown" if text.empty?

  return "Yes" if text.include?("ירי") || text == "כן"
  return "No" if text == "לא" || text.include?("דקירה") || text.include?("סכין") || text.include?("חניקה") || text.include?("דריסה")

  "Unknown"
end

def age_group(age)
  return "Unknown" unless age

  case age
  when 0..17 then "0-17"
  when 18..24 then "18-24"
  when 25..29 then "25-29"
  when 30..39 then "30-39"
  when 40..49 then "40-49"
  when 50..64 then "50-64"
  else "65+"
  end
end

def normalize_district_state(value)
  text = clean_text(value)
  return "" if text.empty? || text == "#N/A"

  normalized = text.tr("־", "-")
  normalized = normalized.gsub(/\s+/, " ").strip

  case normalized
  when "תל-אביב", "תל אביב-יפו"
    "תל אביב"
  when "המרכז"
    "מרכז"
  when "הצפון"
    "צפון"
  when "הדרום", "דרם"
    "דרום"
  else
    normalized
  end
end

def infer_month(month_raw, event_date, death_date)
  month = parse_int(month_raw)
  month ||= event_date&.dig(:month)
  month ||= death_date&.dig(:month)
  month if month && month.between?(1, 12)
end

def safe_slug(value)
  text = clean_text(value)
  return "na" if text.empty?

  text.gsub(/\s+/, "-").gsub(/[^\p{Alnum}\-\p{Hebrew}]/, "").downcase
end

def build_record_uid(dataset_year, case_number, serial_number, source_row_number)
  id_base = case_number.empty? ? serial_number : case_number
  "#{dataset_year}-#{safe_slug(id_base)}-r#{source_row_number}"
end

def non_person_record?(victim_name)
  name = clean_text(victim_name)
  NON_PERSON_NAME_PATTERNS.any? { |pattern| name.match?(pattern) }
end

def classify_record(serial_number, case_number)
  serial = clean_text(serial_number)
  case_id = clean_text(case_number)
  return ["Main", true] if serial.match?(/^\d+$/)
  return ["Main", true] if serial.empty? && case_id.match?(/^\d+$/)
  return ["Main", true] if serial.empty?

  [serial, false]
end

raw_files = Dir[RAW_GLOB].sort
if raw_files.empty?
  abort "No CSV files found in #{ROOT}"
end

normalized_rows = []

raw_files.each do |file_path|
  filename = File.basename(file_path)
  dataset_year_match = filename.match(/(\d{4})/)
  next unless dataset_year_match

  dataset_year = dataset_year_match[1].to_i
  rows = CSV.read(file_path, encoding: "bom|utf-8")
  header_idx = rows.find_index { |row| row.any? { |cell| clean_text(cell).include?("שם הקורבן") } }
  next unless header_idx

  header_map = build_header_map(rows[header_idx])

  rows[(header_idx + 1)..].to_a.each_with_index do |row, idx|
    source_row_number = header_idx + idx + 2

    victim_name_he = first_present_value(row, header_map, :victim_name_he)
    next if victim_name_he.empty?
    next if non_person_record?(victim_name_he)

    serial_number = first_present_value(row, header_map, :serial_number)
    case_number = first_present_value(row, header_map, :case_number)
    record_group, included_in_main_tally = classify_record(serial_number, case_number)
    age = parse_int(first_present_value(row, header_map, :age))
    age = nil if age && age > 120

    gender_raw = first_present_value(row, header_map, :gender)
    citizen_raw = first_present_value(row, header_map, :citizen)
    religion = first_present_value(row, header_map, :religion)

    event_raw = first_present_value(row, header_map, :event_date)
    death_raw = first_present_value(row, header_map, :death_date)
    event_date, death_date = normalize_date_pair(event_raw, death_raw, dataset_year)
    next if serial_number.empty? && case_number.empty? && event_raw.empty? && death_raw.empty? && age.nil?

    month_raw = first_present_value(row, header_map, :month)
    month_num = infer_month(month_raw, event_date, death_date)

    solved_raw = first_present_value(row, header_map, :solved)
    police_status = first_present_value(row, header_map, :police_status)
    weapon_raw = first_present_value(row, header_map, :weapon_main)
    weapon_detail = first_present_value(row, header_map, :weapon_detail)

    normalized_rows << {
      "record_uid" => build_record_uid(dataset_year, case_number, serial_number, source_row_number),
      "source_file" => filename,
      "source_row_number" => source_row_number,
      "dataset_year" => dataset_year,
      "serial_number" => serial_number,
      "record_group" => record_group,
      "included_in_main_tally" => included_in_main_tally,
      "case_number" => case_number,
      "victim_name_he" => victim_name_he,
      "victim_name_ar" => first_present_value(row, header_map, :victim_name_ar),
      "age" => age,
      "age_group" => age_group(age),
      "gender_raw" => gender_raw,
      "gender" => normalize_gender(gender_raw),
      "citizen_raw" => citizen_raw,
      "citizen_status" => normalize_citizen_status(citizen_raw),
      "religion" => religion,
      "residence_locality" => first_present_value(row, header_map, :residence_locality),
      "residence_locality_type" => first_present_value(row, header_map, :residence_locality_type),
      "residence_population_type" => first_present_value(row, header_map, :residence_population_type),
      "geographic_area" => first_present_value(row, header_map, :geographic_area),
      "geographic_area_alt" => first_present_value(row, header_map, :geographic_area_alt),
      "district_state" => normalize_district_state(first_present_value(row, header_map, :district_state)),
      "district_police" => first_present_value(row, header_map, :district_police),
      "event_date_raw" => event_raw,
      "event_date_iso" => event_date&.dig(:date)&.iso8601,
      "death_date_raw" => death_raw,
      "death_date_iso" => death_date&.dig(:date)&.iso8601,
      "month_raw" => month_raw,
      "month_num" => month_num,
      "incident_location" => first_present_value(row, header_map, :incident_location),
      "exact_location" => first_present_value(row, header_map, :exact_location),
      "solved_raw" => solved_raw,
      "solved_status" => normalize_solved_status(solved_raw, police_status),
      "police_status" => police_status,
      "weapon_raw" => weapon_raw,
      "weapon_type" => normalize_weapon_type(weapon_raw, weapon_detail),
      "weapon_detail" => weapon_detail,
      "firearm_involved" => normalize_firearm(weapon_raw, weapon_detail),
      "intent_raw" => first_present_value(row, header_map, :intent),
      "background" => first_present_value(row, header_map, :background),
      "description" => first_present_value(row, header_map, :description),
      "notes" => first_present_value(row, header_map, :notes),
      "source_url_1" => first_present_value(row, header_map, :source_url_1),
      "source_url_2" => first_present_value(row, header_map, :source_url_2)
    }
  end
end

FileUtils.mkdir_p(OUTPUT_DIR)

normalized_csv_path = File.join(OUTPUT_DIR, "homicides_normalized.csv")
CSV.open(normalized_csv_path, "w", write_headers: true, headers: OUTPUT_HEADERS) do |csv|
  normalized_rows.each do |row|
    csv << OUTPUT_HEADERS.map { |header| row[header] }
  end
end

normalized_json_path = File.join(OUTPUT_DIR, "homicides_normalized.json")
File.write(normalized_json_path, JSON.pretty_generate(normalized_rows))

year_summary_headers = [
  "year",
  "victims",
  "female_victims",
  "age_30_or_younger",
  "firearm_cases",
  "solved_or_indicted"
].freeze

year_summary = normalized_rows.group_by do |row|
  next unless row["included_in_main_tally"]

  date_str = row["death_date_iso"] || row["event_date_iso"]
  (date_str ? date_str[0, 4] : row["dataset_year"].to_s).to_i
end

year_summary_rows = year_summary.keys.compact.sort.map do |year|
  rows = year_summary[year]
  {
    "year" => year,
    "victims" => rows.length,
    "female_victims" => rows.count { |row| row["gender"] == "Female" },
    "age_30_or_younger" => rows.count { |row| row["age"].to_i.positive? && row["age"].to_i <= 30 },
    "firearm_cases" => rows.count { |row| row["firearm_involved"] == "Yes" },
    "solved_or_indicted" => rows.count { |row| ["Solved/Indicted", "Partially Solved"].include?(row["solved_status"]) }
  }
end

year_summary_csv_path = File.join(OUTPUT_DIR, "year_summary.csv")
CSV.open(year_summary_csv_path, "w", write_headers: true, headers: year_summary_headers) do |csv|
  year_summary_rows.each do |row|
    csv << year_summary_headers.map { |header| row[header] }
  end
end

puts "Normalized #{normalized_rows.length} records from #{raw_files.length} files"
puts "- #{normalized_csv_path}"
puts "- #{normalized_json_path}"
puts "- #{year_summary_csv_path}"
