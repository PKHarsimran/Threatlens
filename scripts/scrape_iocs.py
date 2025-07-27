import os
import re
import argparse
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

IOC_PATTERN = re.compile(r"(?:[0-9]{1,3}\.){3}[0-9]{1,3}|(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})")

# List of threat feeds you can use (add more as needed)
THREAT_FEEDS = [
    "https://rules.emergingthreats.net/open/suricata/rules/emerging-drop.rules",
    "https://www.abuse.ch/feeds/malwarebazaar/tags/emotet/",
    "https://urlhaus.abuse.ch/downloads/text/",
    "https://feodotracker.abuse.ch/downloads/ipblocklist_recommended.txt",
    "https://cinsscore.com/list/ci-badguys.txt",
    "https://reputation.alienvault.com/reputation.data"
]

def determine_type(indicator: str) -> str:
    if re.fullmatch(r"(?:[0-9]{1,3}\.){3}[0-9]{1,3}", indicator):
        return "ip"
    if indicator.startswith(("http://", "https://")):
        return "url"
    if re.search(r"\.[a-zA-Z]{2,}$", indicator):
        return "domain"
    return "other"

def fetch_feed(url: str) -> str:
    try:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        print(f"❌ Failed to fetch {url}: {e}")
        return ""

def parse_indicators_from_html(html: str, source_url: str, limit: int):
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(separator="\n")
    return parse_indicators_from_text(text, source_url, limit)

def parse_indicators_from_text(text: str, source_url: str, limit: int):
    candidates = list(set([ioc.strip() for ioc in IOC_PATTERN.findall(text)]))
    indicators = []
    for ind in candidates:
        indicators.append({
            "indicator": ind,
            "type": determine_type(ind),
            "threat_type": "other",
            "confidence": "medium",
            "source_name": urlparse(source_url).hostname or "unknown",
            "source_url": source_url,
            "source_type": "threat_feed",
        })
        if len(indicators) >= limit:
            break
    return indicators

def post_iocs(iocs, api_base):
    endpoint = api_base.rstrip("/") + "/iocs"
    for ioc in iocs:
        try:
            resp = requests.post(endpoint, json=ioc, timeout=10)
            resp.raise_for_status()
            print(f"✅ Uploaded {ioc['indicator']} ({ioc['type']})")
        except Exception as exc:
            print(f"❌ Failed to upload {ioc['indicator']}: {exc}")

def main():
    parser = argparse.ArgumentParser(description="Scrape IOC feed and upload to API")
    parser.add_argument("--feed-url", help="URL of the threat feed")
    parser.add_argument("--limit", type=int, default=50, help="Maximum number of IOCs to process")
    args = parser.parse_args()

    api_base = os.environ.get("API_BASE_URL")
    if not api_base:
        raise SystemExit("❌ API_BASE_URL environment variable not set")

    feed_urls = [args.feed_url] if args.feed_url else THREAT_FEEDS

    for url in feed_urls:
        print(f"\n🌐 Fetching from: {url}")
        raw_data = fetch_feed(url)
        if not raw_data:
            continue

        if "<html" in raw_data.lower():
            iocs = parse_indicators_from_html(raw_data, url, args.limit)
        else:
            iocs = parse_indicators_from_text(raw_data, url, args.limit)

        if not iocs:
            print("⚠️  No indicators found.")
            continue

        post_iocs(iocs, api_base)

if __name__ == "__main__":
    main()
