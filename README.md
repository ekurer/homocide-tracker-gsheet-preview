# Homicide Tracker

Public-facing homicide dashboard for researchers, journalists, and the public.

## What this repo now includes

- `raw_csv/`: Yearly source CSV files (raw input, kept out of repo root).
- `scripts/normalize_data.rb`: Normalizes all yearly raw CSVs into one canonical dataset.
- `data/homicides_normalized.csv`: Unified table across years.
- `data/homicides_normalized.json`: Same data in JSON for dashboard performance.
- `data/year_summary.csv`: Yearly summary metrics (main tally only).
- `dashboard/`: Interactive dashboard (filters, KPIs, charts, records table).
  - Includes a geographic bubble map based on normalized area/district buckets.
  - Includes a Raw Data view with per-year tabs.

## Languages

- Supported UI languages: Hebrew, Arabic, English.
- Default language: Hebrew (`he`).
- Switch language from chips in the dashboard header.
- Language selection is stored in browser `localStorage` and restored on next visit.
- Text direction switches automatically (`rtl` for Hebrew/Arabic, `ltr` for English).

## Raw Data tab

- Top-level views:
  - `Dashboard` (default analytics view)
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

## Quick start

1. Normalize data once (or whenever raw yearly CSVs change):

```bash
./scripts/refresh_normalized_data.sh
```

2. Start the dashboard server (no re-normalization):

```bash
./scripts/start_dashboard.sh
```

3. Open:

- `http://localhost:8000/dashboard/`

## Operating model (normalize once)

- Daily use: run `./scripts/start_dashboard.sh` only.
- Re-run normalization only when source CSVs are updated or corrected.
- Keep `data/homicides_normalized.csv`, `data/homicides_normalized.json`, and `data/year_summary.csv` as the dashboard source of truth between source updates.

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
- Supplementary category handling:
  - `record_group`
  - `included_in_main_tally`

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
