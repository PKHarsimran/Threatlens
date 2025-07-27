# Threatlens

## Scrape IOCs

This repository includes a simple scraping utility located in `scripts/scrape_iocs.py`.
The script downloads indicators of compromise (IOCs) from a public feed and uploads
new entries to a configurable API.

### Requirements

- Python 3.8+
- `requests` and `beautifulsoup4` packages

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file or export `API_BASE_URL` environment variable pointing to your
API instance. The script posts IOCs to `<API_BASE_URL>/iocs`.

### Usage

Run the scraper with an optional limit and feed URL:

```bash
python scripts/scrape_iocs.py --limit 50 --feed-url https://example.com/feed
```

The script parses indicators from the feed and POSTs them to the API.

### GitHub Actions

A workflow in `.github/workflows/scrape-iocs.yml` can execute the scraper
automatically. It runs daily and may also be triggered manually from the
Actions tab. The workflow expects an `API_BASE_URL` repository secret. When
triggering manually you can override the feed URL and indicator limit.
