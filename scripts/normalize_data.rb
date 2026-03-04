#!/usr/bin/env ruby
# frozen_string_literal: true

require "csv"
require "json"
require "date"
require "fileutils"

ROOT = File.expand_path("..", __dir__)
RAW_GLOB = File.join(ROOT, "raw_csv", "*.csv")
OUTPUT_DIR = File.join(ROOT, "data")
LOCALITY_COORDINATES_PATH = File.join(OUTPUT_DIR, "locality_coordinates.json")

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
  "locality_key",
  "locality_name_canonical",
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

YEAR_SUMMARY_HEADERS = [
  "year",
  "victims",
  "female_victims",
  "age_30_or_younger",
  "firearm_cases",
  "solved_or_indicted"
].freeze

NON_PERSON_NAME_PATTERNS = [
  /ברשימה/,
  /פלסטינים/,
  /תושבי השטחים/,
  /נרצח בחו/,
  /נמצאה תלויה/
].freeze

SOLVED_STATUSES = ["Solved/Indicted", "Partially Solved"].freeze

def clean_text(value)
  value.to_s.encode("UTF-8", invalid: :replace, undef: :replace, replace: "").gsub("\uFEFF", "").strip
end

def normalize_locality_alias(value)
  clean_text(value)
    .tr("׳`", "'")
    .gsub(/[״"]/, "")
    .gsub(/[־–—]/, "-")
    .gsub(/\s+/, " ")
    .strip
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

  used_indices = mapping.values.flatten.uniq

  if mapping[:age].empty? && !mapping[:gender].empty?
    gender_idx = mapping[:gender].first
    [gender_idx - 1, gender_idx - 2].each do |candidate|
      next if candidate.negative? || used_indices.include?(candidate)

      mapping[:age] << candidate
      used_indices << candidate
      break
    end
  end

  if mapping[:event_date].empty? && !mapping[:district_police].empty? && !mapping[:incident_location].empty?
    district_idx = mapping[:district_police].first
    incident_idx = mapping[:incident_location].first
    event_idx = district_idx + 1
    month_idx = district_idx + 2
    death_idx = district_idx + 3

    mapping[:event_date] << event_idx if event_idx < incident_idx && mapping[:event_date].empty?
    mapping[:month] << month_idx if month_idx < incident_idx && mapping[:month].empty?
    mapping[:death_date] << death_idx if death_idx < incident_idx && mapping[:death_date].empty?
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

  normalized = text.tr("־", "-").gsub(/\s+/, " ").strip

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

def apply_record_overrides(dataset_year, victim_name_he, fields)
  if dataset_year == 2022 && clean_text(victim_name_he) == "עאדל אבו סמור"
    fields["gender_raw"] = "גבר" if clean_text(fields["gender_raw"]).empty?
    fields["gender"] = "Male"
  end

  fields
end

def load_locality_reference
  return [] unless File.exist?(LOCALITY_COORDINATES_PATH)

  JSON.parse(File.read(LOCALITY_COORDINATES_PATH))
rescue JSON::ParserError
  []
end

def locality_alias_lookup(reference_rows)
  reference_rows.each_with_object({}) do |entry, lookup|
    aliases = Array(entry["aliases"]) + [entry["locality_name_he"]]
    aliases.each do |alias_name|
      normalized_alias = normalize_locality_alias(alias_name)
      next if normalized_alias.empty?

      lookup[normalized_alias] = entry
    end
  end
end

def canonicalize_locality(raw_locality, alias_lookup)
  normalized_alias = normalize_locality_alias(raw_locality)
  return { "locality_key" => "", "locality_name_canonical" => "" } if normalized_alias.empty?

  entry = alias_lookup[normalized_alias]
  return { "locality_key" => "", "locality_name_canonical" => "" } unless entry

  {
    "locality_key" => clean_text(entry["locality_key"]),
    "locality_name_canonical" => clean_text(entry["locality_name_he"])
  }
end

def record_year(row)
  date_str = row["death_date_iso"] || row["event_date_iso"]
  (date_str ? date_str[0, 4] : row["dataset_year"].to_s).to_i
end

def summarize_years(rows)
  grouped = rows.group_by { |row| record_year(row) }

  grouped.keys.compact.sort.map do |year|
    year_rows = grouped[year]
    {
      "year" => year,
      "victims" => year_rows.length,
      "female_victims" => year_rows.count { |row| row["gender"] == "Female" },
      "age_30_or_younger" => year_rows.count { |row| row["age"].to_i.positive? && row["age"].to_i <= 30 },
      "firearm_cases" => year_rows.count { |row| row["firearm_involved"] == "Yes" },
      "solved_or_indicted" => year_rows.count { |row| SOLVED_STATUSES.include?(row["solved_status"]) }
    }
  end
end

def locality_summary(normalized_rows, locality_reference)
  main_rows = normalized_rows.select { |row| row["included_in_main_tally"] }
  years = main_rows.map { |row| record_year(row) }.uniq.sort
  totals_by_year = years.each_with_object({}) do |year, hash|
    hash[year] = main_rows.count { |row| record_year(row) == year }
  end

  reference_by_key = locality_reference.each_with_object({}) do |entry, hash|
    hash[clean_text(entry["locality_key"])] = entry
  end

  matched_rows = main_rows.select do |row|
    reference = reference_by_key[row["locality_key"]]
    reference && reference["active"] && reference["lat"] && reference["lon"]
  end

  localities = matched_rows
    .group_by { |row| row["locality_key"] }
    .map do |locality_key, rows|
      reference = reference_by_key[locality_key]
      grouped_by_year = rows.group_by { |row| record_year(row) }
      year_metrics = grouped_by_year.keys.sort.each_with_object({}) do |year, metrics|
        year_rows = grouped_by_year[year]
        total_for_year = year_rows.length
        metrics[year.to_s] = {
          "victims" => total_for_year,
          "share_of_year" => totals_by_year[year].to_i.positive? ? total_for_year.to_f / totals_by_year[year] : 0.0,
          "firearm_victims" => year_rows.count { |row| row["firearm_involved"] == "Yes" },
          "firearm_share" => total_for_year.positive? ? year_rows.count { |row| row["firearm_involved"] == "Yes" }.to_f / total_for_year : 0.0,
          "solved_victims" => year_rows.count { |row| SOLVED_STATUSES.include?(row["solved_status"]) },
          "solved_share" => total_for_year.positive? ? year_rows.count { |row| SOLVED_STATUSES.include?(row["solved_status"]) }.to_f / total_for_year : 0.0,
          "male_victims" => year_rows.count { |row| row["gender"] == "Male" },
          "female_victims" => year_rows.count { |row| row["gender"] == "Female" }
        }
      end

      {
        "locality_key" => locality_key,
        "locality_name_he" => clean_text(reference["locality_name_he"]),
        "locality_name_ar" => clean_text(reference["locality_name_ar"]),
        "district_state" => clean_text(reference["district_state"]),
        "geographic_area" => clean_text(reference["geographic_area"]),
        "lat" => reference["lat"].to_f.round(7),
        "lon" => reference["lon"].to_f.round(7),
        "all_years_total" => rows.length,
        "year_metrics" => year_metrics
      }
    end
    .sort_by { |entry| [-entry["all_years_total"], entry["locality_name_he"]] }

  unmatched_localities = main_rows
    .reject do |row|
      reference = reference_by_key[row["locality_key"]]
      reference && reference["active"] && reference["lat"] && reference["lon"]
    end
    .group_by { |row| clean_text(row["residence_locality"]) }
    .map do |locality_name, rows|
      {
        "residence_locality" => locality_name,
        "count" => rows.length,
        "years" => rows.map { |row| record_year(row) }.uniq.sort,
        "canonical_locality_key" => clean_text(rows.first["locality_key"]),
        "canonical_locality_name" => clean_text(rows.first["locality_name_canonical"])
      }
    end
    .sort_by { |entry| [-entry["count"], entry["residence_locality"]] }

  {
    "years" => years,
    "localities" => localities,
    "unmatched_localities" => unmatched_localities
  }
end

raw_files = Dir[RAW_GLOB].sort
abort "No CSV files found in #{ROOT}" if raw_files.empty?

locality_reference = load_locality_reference
locality_lookup = locality_alias_lookup(locality_reference)
normalized_rows = []

raw_files.each do |file_path|
  filename = File.basename(file_path)
  dataset_year_match = filename.match(/(\d{4})/)
  next unless dataset_year_match

  dataset_year = dataset_year_match[1].to_i
  raw_content = File.binread(file_path).force_encoding("UTF-8").sub(/\A\xEF\xBB\xBF/, "")
  rows = CSV.parse(raw_content, encoding: "UTF-8")
  header_idx = rows.find_index { |row| row.any? { |cell| clean_text(cell).include?("שם הקורבן") } }
  next unless header_idx

  header_map = build_header_map(rows[header_idx])

  rows[(header_idx + 1)..].to_a.each_with_index do |row, idx|
    source_row_number = header_idx + idx + 2

    victim_name_he = first_present_value(row, header_map, :victim_name_he)
    next if victim_name_he.empty? || non_person_record?(victim_name_he)

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
    month_raw = first_present_value(row, header_map, :month)
    month_num = infer_month(month_raw, event_date, death_date)

    solved_raw = first_present_value(row, header_map, :solved)
    police_status = first_present_value(row, header_map, :police_status)
    weapon_raw = first_present_value(row, header_map, :weapon_main)
    weapon_detail = first_present_value(row, header_map, :weapon_detail)
    residence_locality = first_present_value(row, header_map, :residence_locality)
    locality_match = canonicalize_locality(residence_locality, locality_lookup)

    record = {
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
      "residence_locality" => residence_locality,
      "locality_key" => locality_match["locality_key"],
      "locality_name_canonical" => locality_match["locality_name_canonical"],
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

    normalized_rows << apply_record_overrides(dataset_year, victim_name_he, record)
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

year_summary_rows = summarize_years(normalized_rows.select { |row| row["included_in_main_tally"] })
year_summary_csv_path = File.join(OUTPUT_DIR, "year_summary.csv")
CSV.open(year_summary_csv_path, "w", write_headers: true, headers: YEAR_SUMMARY_HEADERS) do |csv|
  year_summary_rows.each do |row|
    csv << YEAR_SUMMARY_HEADERS.map { |header| row[header] }
  end
end

locality_summary_path = File.join(OUTPUT_DIR, "locality_year_summary.json")
File.write(locality_summary_path, JSON.pretty_generate(locality_summary(normalized_rows, locality_reference)))

puts "Normalized #{normalized_rows.length} records from #{raw_files.length} files"
puts "- #{normalized_csv_path}"
puts "- #{normalized_json_path}"
puts "- #{year_summary_csv_path}"
puts "- #{locality_summary_path}"
