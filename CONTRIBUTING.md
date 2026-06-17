# Contributing

Thank you for your interest in contributing!

## 🌱 This Repo Is a Derived Scraper

This repo is **derived from** [job_seeker_ro_spider](https://github.com/sebiboga/epam-systems-international-srl-nodejs-scraper) (the EPAM template — the reference implementation for the peviitor.ro ecosystem).

**What that means for contributors:**

- **Bug fixes specific to MEJIX scraping** (the HTML selector, workmode detection, Cluj-Napoca defaults, robots.txt handling) belong here.
- **Structural improvements** (pipeline architecture, test patterns, caching strategy, config layout, CI workflows) should be proposed in the **EPAM template repo** instead — so every derived scraper benefits from the change.
- **Looking to create a scraper for a different company?** Don't fork this — fork [the template](https://github.com/sebiboga/epam-systems-international-srl-nodejs-scraper) and follow its [CONTRIBUTING.md](https://github.com/sebiboga/epam-systems-international-srl-nodejs-scraper/blob/main/CONTRIBUTING.md).

## Code Style

- Use ES6+ modules (`type: module` in `package.json`)
- Add tests for new features in the matching `tests/<level>/` folder
- Ensure all tests pass before submitting a PR (`npm test`)
- Update relevant `.md` files (especially `files.md` and `AGENTS.md`) when adding new files
- Reference a GitHub issue in every commit (see [ISSUES.md](ISSUES.md))

## Development Setup

```bash
git clone https://github.com/sebiboga/mejix-srl-nodejs-scraper.git
cd mejix-srl-nodejs-scraper
npm install
npm test
```

`SOLR_AUTH` is required for integration/e2e tests — set it in `.env.local`.

## Reporting Issues

Open a [GitHub Issue](https://github.com/sebiboga/mejix-srl-nodejs-scraper/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
