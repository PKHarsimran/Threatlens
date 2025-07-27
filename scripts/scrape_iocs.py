import os
import re
import argparse
import requests
from bs4 import BeautifulSoup

IOC_PATTERN = re.compile(r"(?:[0-9]{1,3}\.){3}[0-9]{1,3}|(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})")


def determine_type(indicator: str) -> str:
    if re.fullmatch(r"(?:[0-9]{1,3}\.){3}[0-9]{1,3}", indicator):
        return "ip"
    if indicator.startswith(("http://", "https://")):
        return "url"
    if re.search(r"\.[a-zA-Z]{2,}$", indicator):
        return "domain"
    return "other"


def fetch_feed(url: str) -> str:
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    return resp.text


def parse_indicators(html: str, source_url: str, limit: int):
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(separator="\n")
    candidates = IOC_PATTERN.findall(text)
    indicators = []
    for ind in candidates:
        indicators.append({
            "indicator": ind,
            "type": determine_type(ind),
            "threat_type": "other",
            "confidence": "medium",
            "source_name": source_url.split("//")[-1].split("/")[0],
            "source_url": source_url,
            "source_type": "threat_report",
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
            print(f"Uploaded {ioc['indicator']} -> {resp.status_code}")
        except Exception as exc:
            print(f"Failed to upload {ioc['indicator']}: {exc}")


def main():
    parser = argparse.ArgumentParser(description="Scrape IOC feed and upload to API")
    parser.add_argument("--feed-url", default="https://example.com/feed", help="URL of the threat feed")
    parser.add_argument("--limit", type=int, default=50, help="Maximum number of IOCs to process")
    args = parser.parse_args()

    api_base = os.environ.get("API_BASE_URL")
    if not api_base:
        raise SystemExit("API_BASE_URL environment variable not set")

    html = fetch_feed(args.feed_url)
    iocs = parse_indicators(html, args.feed_url, args.limit)
    if not iocs:
        print("No indicators found")
        return
    post_iocs(iocs, api_base)


if __name__ == "__main__":
    main()
