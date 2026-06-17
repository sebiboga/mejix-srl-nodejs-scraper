# Contributing

Thank you for your interest in contributing!

## 📐 This Repo Is a Template

This is the **reference implementation** for Node.js job scrapers in the peviitor.ro ecosystem. New scrapers for other Romanian companies should be derived from this pattern — same structure, same workflows, same testing layers.

## Deriving a New Scraper for Another Company

Use this checklist when starting a scraper for `<COMPANY>`:

### 1. Bootstrap the repository

1. Create a new GitHub repo named `<company-slug>-nodejs-scraper` (e.g. `cognizant-romania-nodejs-scraper`)
2. Mark it **public** (required — see [PUBLIC.md](PUBLIC.md))
3. Add the two required topics: `job-seeker-ro-spider`, `peviitor-ro` (see [TOPICS.md](TOPICS.md))
4. Copy this repo's contents as a starting point

### 2. Update company identity

**Primary edit (single source of truth):**

| File | What to change |
|------|---------------|
| `config/company.json` | Edit all fields: `cif`, `legalName`, `brand`, `website`, `careerUrl`, `apiBase`, `apiCountryId`, `defaultLocation`, `scraperFile` |

All scraper code, CI workflows, and the static HTML read from this file. You should not need to edit constants in `index.js`, `company.js`, `demoanaf.js`, `tests/validate-mejix-jobs.js`, `docs/index.html`, or `.github/workflows/automation-testing.yml`.

**Secondary edits (cosmetic / metadata):**

| File | What to change |
|------|---------------|
| `tests/company.json` | Replace with ANAF mock for the new company |
| `UPDATE-REPO-ABOUT.md` | New description with legal name and CIF |
| `package.json` | `name` field |
| `README.md` | Title, badges (URLs to the new repo), Overview |
| `tests/validate-mejix-jobs.js` | Rename to `validate-<brand>-jobs.js` (optional) |

### 3. Adjust the scraper to the new data source

- Each careers site uses a different API/HTML structure — rewrite `fetchJobsPage()` and `parseApiJobs()` in `index.js` to match the new source
- Keep the **output shape identical** — `mapToJobModel()` and `transformJobsForSOLR()` should not change, so the SOLR schema stays uniform across the ecosystem
- Respect the target site's `robots.txt` — update [ROBOTS.md](ROBOTS.md) with the new analysis

### 4. Wire up CI

- The two workflows (`job-seeker-ro-spider.yml`, `automation-testing.yml`) can stay as-is — just confirm the scheduled times don't all hammer SOLR at once
- Add `SOLR_AUTH` as a repo secret
- Enable GitHub Pages (root: `docs/`)

### 5. Validate

Follow [VERIFY.md](VERIFY.md) before merging. The same 4 levels of tests (unit / integration / e2e / consistency) must all pass.

## Code Style for Contributions to This Repo

- Use ES6+ modules (`type: module` in `package.json`)
- Add tests for new features in the matching `tests/<level>/` folder
- Ensure all tests pass before submitting PR
- Update relevant `.md` files (especially `files.md` and `AGENTS.md`) when adding new files
- Reference a GitHub issue in every commit (see [ISSUES.md](ISSUES.md))

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mejix-srl-nodejs-scraper.git

# Install dependencies
npm install

# Run tests
npm test
```

## Reporting Issues

Open a [GitHub Issue](https://github.com/sebiboga/mejix-srl-nodejs-scraper/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
