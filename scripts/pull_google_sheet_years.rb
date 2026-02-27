#!/usr/bin/env ruby
# frozen_string_literal: true

require "csv"
require "date"
require "fileutils"
require "digest"
require "net/http"
require "set"
require "uri"

ROOT_DIR = File.expand_path("..", __dir__)
RAW_DIR = File.join(ROOT_DIR, "raw_csv")
SHEET_ID = ENV.fetch("GOOGLE_SHEET_ID", "1AV2XmeezCqSK5IxSHFY3GqRRPEwUix0hv-LoOiPH5DE")
YEAR_NAME_PATTERN = /\A\d{4}\z/.freeze

def detect_start_year(raw_dir)
  years = Dir.glob(File.join(raw_dir, "*.csv"))
             .map { |path| File.basename(path, ".csv") }
             .select { |name| YEAR_NAME_PATTERN.match?(name) }
             .map(&:to_i)
  years.min || 2018
end

def fetch_sheet_csv(sheet_id, year)
  uri = URI("https://docs.google.com/spreadsheets/d/#{sheet_id}/gviz/tq?tqx=out:csv&sheet=#{year}")
  request = Net::HTTP::Get.new(uri)
  request["User-Agent"] = "homicide-tracker-gsheet-sync/1.0"

  response = Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 15, read_timeout: 30) do |http|
    http.request(request)
  end

  [response.code.to_i, response["content-type"].to_s, response.body.to_s]
rescue StandardError => e
  warn "Year #{year}: request failed (#{e.class}: #{e.message})"
  [0, "", ""]
end

def parse_csv_rows(body)
  return nil if body.strip.empty?
  return nil if body.lstrip.start_with?("<!DOCTYPE html", "<html")

  normalized_body = body.dup.force_encoding("UTF-8").sub(/\A\xEF\xBB\xBF/, "")
  rows = CSV.parse(normalized_body, encoding: "UTF-8")
  return nil if rows.empty?
  return nil unless rows.any? { |row| row.any? { |cell| !cell.to_s.strip.empty? } }

  rows
rescue CSV::MalformedCSVError
  nil
end

FileUtils.mkdir_p(RAW_DIR)

start_year = Integer(ENV.fetch("SHEET_START_YEAR", detect_start_year(RAW_DIR).to_s), 10)
end_year = Integer(ENV.fetch("SHEET_END_YEAR", (Date.today.year + 1).to_s), 10)

if start_year > end_year
  abort("Invalid year range: start=#{start_year}, end=#{end_year}")
end

fetched = []
seen_payloads = {}
(start_year..end_year).each do |year|
  status, content_type, body = fetch_sheet_csv(SHEET_ID, year)
  unless status == 200
    puts "Year #{year}: skipped (HTTP #{status})"
    next
  end

  rows = parse_csv_rows(body)
  if rows.nil?
    puts "Year #{year}: skipped (not valid CSV payload, content-type=#{content_type})"
    next
  end

  payload_hash = Digest::SHA256.hexdigest(body)
  if seen_payloads.key?(payload_hash)
    puts "Year #{year}: skipped (duplicate payload of year #{seen_payloads[payload_hash]})"
    next
  end

  target_path = File.join(RAW_DIR, "#{year}.csv")
  temp_path = "#{target_path}.tmp"
  File.binwrite(temp_path, body)
  FileUtils.mv(temp_path, target_path)
  seen_payloads[payload_hash] = year
  fetched << [year, rows.length]
  puts "Year #{year}: saved raw_csv/#{year}.csv (#{rows.length} rows)"
end

if fetched.empty?
  abort("No valid yearly CSV tabs were fetched from Google Sheet #{SHEET_ID}.")
end

# Enforce year-tab-only storage for raw CSVs.
removed_files = []
Dir.glob(File.join(RAW_DIR, "*.csv")).each do |path|
  basename = File.basename(path, ".csv")
  next if YEAR_NAME_PATTERN.match?(basename)

  FileUtils.rm_f(path)
  removed_files << File.basename(path)
end

unless removed_files.empty?
  puts "Removed non-year raw CSV files: #{removed_files.sort.join(', ')}"
end

fetched_years = fetched.map { |entry| entry[0].to_s }.to_set
removed_stale_years = []
Dir.glob(File.join(RAW_DIR, "*.csv")).each do |path|
  basename = File.basename(path, ".csv")
  next unless YEAR_NAME_PATTERN.match?(basename)
  next if fetched_years.include?(basename)

  FileUtils.rm_f(path)
  removed_stale_years << File.basename(path)
end

unless removed_stale_years.empty?
  puts "Removed stale year CSV files: #{removed_stale_years.sort.join(', ')}"
end

year_list = fetched.map { |entry| entry[0] }.sort
puts "Completed Google Sheet pull for years: #{year_list.join(', ')}"
