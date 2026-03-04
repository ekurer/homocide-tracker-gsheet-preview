# Homicide Tracker

Public-facing homicide dashboard for researchers, journalists, and the public.

## What this repo now includes

- `raw_csv/`: Yearly source CSVs pulled from an open Google Sheet (tabs named by year).
- `scripts/normalize_data.rb`: Normalizes all yearly raw CSVs into one canonical dataset.
- `scripts/refresh_locality_coordinates.rb`: Manual helper for locality centroid refresh and alias upkeep.
- `scripts/pull_google_sheet_years.rb`: Pulls year tabs (`2018`, `2019`, ... ) from Google Sheets into `raw_csv/`.
- `scripts/sync_from_google_sheet.sh`: Pull + normalize entrypoint for local use and CI.
- `data/homicides_normalized.csv`: Unified table across years.
- `data/homicides_normalized.json`: Same data in JSON for dashboard performance.
- `data/year_summary.csv`: Yearly summary metrics (main tally only).
- `data/locality_coordinates.json`: Canonical locality reference with aliases and town centroids.
- `data/locality_year_summary.json`: Locality-by-year aggregate metrics for the map and year comparison views.
- `dashboard/`: Interactive dashboard (filters, KPIs, charts, records table).
  - Includes a locality-level Leaflet map over OpenStreetMap.
  - Includes a dedicated `Compare Years` workspace with synchronized maps and locality deltas.
  - Includes a locality detail panel with multi-year trend and recent victims.
  - Includes a Raw Data view with per-year tabs.

## Languages

- Supported UI languages: Hebrew, Arabic, English.
- Default language: Hebrew (`he`).
- Switch language from chips in the dashboard header.
- Language selection is stored in browser `localStorage` and restored on next visit.
- Text direction switches automatically (`rtl` for Hebrew/Arabic, `ltr` for English).

## Raw Data tab

- Top-level views:
  - `Dashboard` (default map-first analytics view)
  - `Compare Years` (two-year locality comparison workspace)
  - `Analyses` (Ramadan-focused analysis)
  - `Raw Data` (record-level browse view)
- `Raw Data` contains year sub-tabs generated from `dataset_year`, sorted newest-to-oldest.
- Default raw year is the latest available year in the normalized dataset.
- Raw table includes all records for that year, including supplementary rows (`included_in_main_tally = false`).
- Sidebar filters do not affect the Raw Data tab.
- Default columns show key fields (date, victim, demographics, geography, weapon, status, grouping, sources).
- `Show all columns` reveals the full normalized schema columns for full transparency.

## 2026 pace projection

- The yearly trend chart includes a 2026 projection based on current pace through the latest available 2026 record date in the active filtered scope.
- It is shown as a dashed trajectory and clearly labeled as a projection.

## Google Sheet source and sync

- Source sheet: `1AV2XmeezCqSK5IxSHFY3GqRRPEwUix0hv-LoOiPH5DE`
- Import rule: only tabs with 4-digit year names are treated as data sources.
- Sync command:

```bash
./scripts/sync_from_google_sheet.sh
```

- Scheduled sync: GitHub Actions runs every 3 hours and on manual dispatch.
- Safety behavior:
  - Missing year tab is skipped and logged.
  - If no valid year tabs are fetched, the job fails and nothing is committed/deployed.
  - Changes are committed only when `raw_csv/` or `data/` actually changed.

## Quick start

1. Pull from Google Sheets and normalize:

```bash
./scripts/sync_from_google_sheet.sh
```

2. Start the dashboard server:

```bash
./scripts/start_dashboard.sh
```

3. Open:

- `http://localhost:8000/dashboard/`

## Operating model

- Day-to-day use: run `./scripts/start_dashboard.sh`.
- Refresh data on demand: run `./scripts/sync_from_google_sheet.sh`.
- CI auto-refreshes every 3 hours and deploys updated data to Pages through the existing `main` push workflow.
- `data/homicides_normalized.csv`, `data/homicides_normalized.json`, `data/year_summary.csv`, and `data/locality_year_summary.json` are the dashboard runtime sources.

## Normalization notes

The source CSVs change schema almost every year. The script handles:

- Dynamic header-row detection (some files have pre-header metadata rows).
- Header mapping from inconsistent Hebrew column names into one canonical schema.
- Date normalization to ISO (`YYYY-MM-DD`) with cross-year handling for rows like `28.12` -> `1.1`.
- Standardized dimensions:
  - `gender`
  - `citizen_status`
  - `weapon_type`
  - `solved_status`
- Locality-level enrichment:
  - canonical `locality_key`
  - `locality_name_canonical`
  - locality/year aggregate output for fast mapping and comparison
- Supplementary category handling:
  - `record_group`
  - `included_in_main_tally`

## Geographic model

- The dashboard does **not** plot exact homicide coordinates.
- The source dataset does not contain reliable record-level latitude/longitude pairs.
- The map therefore aggregates by `residence_locality` and places each marker on a locality centroid.
- `data/locality_coordinates.json` is the canonical reference for those centroids and known locality aliases.
- Unmatched or ambiguous locality strings are kept out of the map and surfaced in `data/locality_year_summary.json` under `unmatched_localities`.

## Dashboard design principles used

The dashboard implementation follows guidance from official/primary sources:

- Keep dashboards dynamic/filterable and centered around user questions ([CDC dashboard guidance](https://www.cdc.gov/stop-overdose/php/dashboard-builder/index.html)).
- Maintain clear indicator definitions for homicide measures ([World Bank indicator metadata](https://databank.worldbank.org/metadataglossary/world-development-indicators/series/VC.IHR.PSRC.P5)).
- Apply tidy-data structure for reproducible analysis workflows ([Wickham, *Tidy Data*](https://www.jstatsoft.org/article/view/v059i10)).
- Preserve visual accessibility and contrast standards ([W3C WCAG 2.1 contrast guidance](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)).
- Treat data products as living systems with ongoing quality monitoring ([WHO data-design principles](https://www.who.int/data/data-design-language/principles)).

## Caveats

- Classification rules in source files vary by year.
- Not all rows have complete dates/fields.
- Some years include supplementary categories (for example, police/security-related rows) outside main headline tallies.
