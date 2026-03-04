#!/usr/bin/env ruby
# frozen_string_literal: true

require "csv"
require "json"
require "net/http"
require "uri"
require "time"

ROOT = File.expand_path("..", __dir__)
NORMALIZED_CSV_PATH = File.join(ROOT, "data", "homicides_normalized.csv")
OUTPUT_PATH = File.join(ROOT, "data", "locality_coordinates.json")
USER_AGENT = "arab-society-murder-tracker/1.0"
REQUEST_DELAY_SECONDS = 1.1

MANUAL_CANONICAL_NAMES = {
  "אבטין" => "איבטין",
  "באקה אלגרביה" => "באקה אל גרביה",
  "ביר הדאג׳" => "ביר הדאג'",
  "בית ג׳אן" => "בית ג'אן",
  "ג׳דידה מכר" => "ג'דידה מכר",
  "ג׳לג׳וליה" => "ג'לג'וליה",
  "ג׳סר אזרקא" => "ג'סר א-זרקא",
  "ג'סר אזרקא" => "ג'סר א-זרקא",
  "ג׳ת" => "ג'ת",
  "ח׳וואלד" => "ח'ואלד",
  "ח'וואלד" => "ח'ואלד",
  "אלח'ואלד" => "ח'ואלד",
  "טובא זנגריה" => "טובא-זנגרייה",
  "טובא זנגרייה" => "טובא-זנגרייה",
  "מג׳ד אל כרום" => "מג'ד אל-כרום",
  "עוספיא" => "עוספיה",
  "עספיא" => "עוספיה",
  "עין אל אסד" => "עין אל-אסד",
  "עין אלאסד" => "עין אל-אסד",
  "שיבלי - אום אלגנם" => "שבלי אום אל-גנם",
  "פורידיס" => "פוריידיס"
}.freeze

UNMAPPABLE_LOCALITIES = [
  "אזרח ירדני",
  "מהנגב, לא ידוע יישוב",
  "כנראה שכם"
].freeze

MANUAL_QUERY_CANDIDATES = {
  "אום אלפחם" => ["אום אל פחם", "אום אל-פחם", "אום אל פאחם"],
  "אום אל פחם" => ["אום אל פחם", "אום אל-פחם"],
  "ג'סר א-זרקא" => ["ג'סר א-זרקא", "ג׳סר א-זרקא"],
  "ג'דידה מכר" => ["ג'דידה מכר", "ג׳דידה-מכר", "ג'דיידה-מכר"],
  "טמרה (יזרעאל)" => ["טמרה יזרעאל", "טמרה", "Tamra Jezreel Valley"],
  "טובא-זנגרייה" => ["טובא זנגריה", "טובא-זנגרייה"],
  "ח'ואלד" => ["ח'ואלד", "אלחואלד", "אל-ח'ואלד"],
  "פוריידיס" => ["פוריידיס", "פורידיס", "Fureidis Israel"],
  "מג'ד אל-כרום" => ["מג'ד אל כרום", "מג׳ד אל כרום"],
  "שבלי אום אל-גנם" => ["שיבלי אום אלגנם", "שבלי אום אל-גנם"],
  "מזרח ירושלים" => ["מזרח ירושלים", "East Jerusalem"],
  "יאמון - ג'נין" => ["יאמון ג'נין", "Yamun Jenin", "Yamun"],
  "ביר הדאג'" => ["ביר הדאג'", "ביר הדאג׳"],
  "ערערה בנגב" => ["ערערה בנגב", "ערערה-בנגב", "ערערה בנגב ישראל"],
  "פזורת אלעזאזמה" => ["פזורת אלעזאזמה", "עזאזמה"],
  "מסעודין אל עזאזמה" => ["מסעודין אל עזאזמה", "מסעודין אלעזאזמה"],
  "אלעזאזמה בנגב" => ["אלעזאזמה בנגב", "עזאזמה בנגב", "Azazme"],
  "אלפורעה" => ["אלפורעה", "אל-פורעה"],
  "ואדי אלנעם" => ["ואדי אלנעם", "ואדי אל-נעם"],
  "סוואעד חמירה" => ["סוואעד חמירה", "סוואעד-חמירה"],
  "ביר אל משאש" => ["ביר אל משאש", "באר משאש"],
  "קסר אלסר" => ["קסר אלסר", "קסר א-סר"],
  "דריג'את" => ["דריג'את", "דריגאת"],
  "עיזרייה" => ["אל עיזריה", "Al-Eizariya"],
  "רומת אל היב" => ["Rumat al-Heib", "רומת אל היב"],
  "כפר ג'יוס" => ["Jayyous", "כפר ג'יוס"]
}.freeze

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

def safe_slug(value)
  normalized = normalize_locality_alias(value)
  return "na" if normalized.empty?

  normalized.gsub(/\s+/, "-").gsub(/[^\p{Alnum}\-\p{Hebrew}]/, "").downcase
end

def canonicalize_locality(raw_locality)
  normalized = normalize_locality_alias(raw_locality)
  MANUAL_CANONICAL_NAMES.fetch(normalized, normalized)
end

def load_existing_entries
  return [] unless File.exist?(OUTPUT_PATH)

  JSON.parse(File.read(OUTPUT_PATH))
rescue JSON::ParserError
  []
end

def locality_source_rows
  CSV.read(NORMALIZED_CSV_PATH, headers: true).map do |row|
    {
      locality: clean_text(row["residence_locality"]),
      district_state: clean_text(row["district_state"]),
      geographic_area: clean_text(row["geographic_area"]),
      locality_name_ar: clean_text(row["victim_name_ar"])
    }
  end
end

def existing_alias_lookup(entries)
  entries.each_with_object({}) do |entry, lookup|
    aliases = Array(entry["aliases"]) + [entry["locality_name_he"]]
    aliases.each do |alias_name|
      next if clean_text(alias_name).empty?

      lookup[normalize_locality_alias(alias_name)] = entry
    end
  end
end

def most_common_value(values)
  counts = Hash.new(0)
  values.each do |value|
    cleaned = clean_text(value)
    next if cleaned.empty?

    counts[cleaned] += 1
  end
  counts.max_by { |_, count| count }&.first.to_s
end

def query_candidates_for(locality_name)
  base = normalize_locality_alias(locality_name)
  candidates = []
  candidates.concat(Array(MANUAL_QUERY_CANDIDATES[base]))
  candidates << base
  candidates << "#{base} ישראל"
  candidates << base.tr("-", " ")
  candidates << "#{base.tr('-', ' ')} ישראל"
  candidates.uniq.reject(&:empty?)
end

def nominatim_search(query)
  uri = URI("https://nominatim.openstreetmap.org/search")
  uri.query = URI.encode_www_form(format: "jsonv2", limit: 5, q: query)
  request = Net::HTTP::Get.new(uri)
  request["User-Agent"] = USER_AGENT
  request["Accept-Language"] = "he,en,ar"

  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
    http.open_timeout = 10
    http.read_timeout = 10
    http.request(request)
  end

  JSON.parse(response.body)
end

def acceptable_result?(result, locality_name)
  return false unless result.is_a?(Hash)

  class_name = clean_text(result["class"])
  type_name = clean_text(result["type"])
  display_name = clean_text(result["display_name"])
  return false if display_name.empty?

  allowed_types = %w[administrative city town village hamlet suburb neighbourhood residential locality]
  return true if allowed_types.include?(type_name)
  return true if class_name == "boundary" && type_name == "administrative"

  display_name.include?(normalize_locality_alias(locality_name))
end

def geocode_locality(locality_name)
  query_candidates_for(locality_name).each do |query|
    begin
      results = nominatim_search(query)
      match = results.find { |result| acceptable_result?(result, locality_name) } || results.first
      if match
        return {
          "lat" => match["lat"].to_f.round(7),
          "lon" => match["lon"].to_f.round(7),
          "source" => "nominatim",
          "precision" => "locality_centroid",
          "display_name" => clean_text(match["display_name"])
        }
      end
    rescue StandardError => error
      warn "Geocoding failed for #{locality_name}: #{error.message}"
    ensure
      sleep REQUEST_DELAY_SECONDS
    end
  end

  nil
end

entries = load_existing_entries
alias_lookup = existing_alias_lookup(entries)
grouped = Hash.new { |hash, key| hash[key] = [] }

locality_source_rows.each do |row|
  next if row[:locality].empty?

  canonical = canonicalize_locality(row[:locality])
  grouped[canonical] << row
end

updated_entries = grouped.keys.sort.each_with_index.map do |canonical_name, index|
  warn "[#{index + 1}/#{grouped.keys.length}] resolving #{canonical_name}"
  rows = grouped[canonical_name]
  aliases = rows.map { |row| normalize_locality_alias(row[:locality]) }.uniq.sort
  existing_entry = alias_lookup[normalize_locality_alias(canonical_name)]

  if UNMAPPABLE_LOCALITIES.include?(canonical_name)
    next {
      "locality_key" => safe_slug(canonical_name),
      "locality_name_he" => canonical_name,
      "locality_name_ar" => "",
      "aliases" => aliases,
      "district_state" => most_common_value(rows.map { |row| row[:district_state] }),
      "geographic_area" => most_common_value(rows.map { |row| row[:geographic_area] }),
      "lat" => nil,
      "lon" => nil,
      "source" => "unmatched",
      "precision" => "unmatched",
      "active" => false
    }
  end

  geodata = if existing_entry && existing_entry["lat"] && existing_entry["lon"]
              {
                "lat" => existing_entry["lat"].to_f.round(7),
                "lon" => existing_entry["lon"].to_f.round(7),
                "source" => existing_entry["source"],
                "precision" => existing_entry["precision"],
                "display_name" => existing_entry["display_name"]
              }
            else
              geocode_locality(canonical_name)
            end

  {
    "locality_key" => safe_slug(canonical_name),
    "locality_name_he" => canonical_name,
    "locality_name_ar" => clean_text(existing_entry && existing_entry["locality_name_ar"]),
    "aliases" => aliases,
    "district_state" => most_common_value(rows.map { |row| row[:district_state] }),
    "geographic_area" => most_common_value(rows.map { |row| row[:geographic_area] }),
    "lat" => geodata && geodata["lat"],
    "lon" => geodata && geodata["lon"],
    "source" => geodata ? geodata["source"] : "unmatched",
    "precision" => geodata ? geodata["precision"] : "unmatched",
    "active" => !geodata.nil?
  }
end.compact

File.write(OUTPUT_PATH, JSON.pretty_generate(updated_entries))

matched = updated_entries.count { |entry| entry["active"] && entry["lat"] && entry["lon"] }
unmatched = updated_entries.reject { |entry| entry["active"] && entry["lat"] && entry["lon"] }

puts "Wrote #{updated_entries.length} locality entries to #{OUTPUT_PATH}"
puts "- matched: #{matched}"
puts "- unmatched: #{unmatched.length}"
unmatched.each do |entry|
  warn "Unmatched: #{entry['locality_name_he']}"
end
