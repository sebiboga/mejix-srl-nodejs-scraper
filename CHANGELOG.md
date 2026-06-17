# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-17

### Added
- Initial release — derived from [EPAM template](https://github.com/sebiboga/epam-systems-international-srl-nodejs-scraper) (v1.4.2)
- HTML scraping for MEJIX SRL via `https://www.mejix.com/jobs/` using cheerio (no API, single-page)
- Selector `#open-positions a[href^='/jobs/']` with title extraction from `<h3>`
- Default location `Cluj-Napoca` (MEJIX HQ), default workmode `hybrid`
- Workmode detection from page text (`remote` / `on-site` / `hybrid`)
- ANAF validation for CIF 17372688 (MEJIX SRL)
- All template features inherited:
  - `config/company.json` single source of truth
  - 7-day ANAF cache with stale fallback
  - `docs/jobs.md` generation
  - 4-layer test suite (unit, integration, e2e, consistency)
  - Daily scheduled scraping via GitHub Actions
  - GitHub Pages dashboard at https://sebiboga.github.io/mejix-srl-nodejs-scraper/

## License

Copyright (c) 2026 BOGA SEBASTIAN-NICOLAE
Licensed under MIT License
