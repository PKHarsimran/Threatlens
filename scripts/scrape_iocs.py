import os
import re
import argparse
import requests
import pandas as pd
from bs4 import BeautifulSoup
from datetime import datetime

IOC_PATTERN = re.compile(r"(?:[0-9]{1,3}\.){3}[0-9]{1,3}|(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})")

DEFAULT_FEEDS = [
    "https://rules.emergingthreats.net/open/suricata/rules/emerging-ciarmy.rules",
    "https://www.abuseipdb.com/statistics",
    "https://feodotracker.abuse.ch/blocklist/",
    "https://threatfox.abuse.ch/export/host/",
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
    resp = requests.get(url, timeout=15)
    resp.raise_for_status()
    return resp.text

def parse_indicators(html: str, source_url: str, limit: int):
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(separator="\n")
    candidates = IOC_PATTERN.findall(text)
    indicators = []
    seen = set()
    for ind in candidates:
        if ind in seen:
            continue
        seen.add(ind)
        indicators.append({
            "indicator": ind,
            "type": determine_type(ind),
            "confidence": "medium",
            "source_url": source_url,
            "timestamp": datetime.utcnow().isoformat(),
        })
        if len(indicators) >= limit:
            break
    return indicators

def save_iocs(iocs, output_file):
    df = pd.DataFrame(iocs)
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    df.to_csv(output_file, index=False)
    print(f"✅ Saved {len(iocs)} IOCs to {output_file}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--feed-url", help="Single feed URL")
    parser.add_argument("--limit", type=int, default=50)
    parser.add_argument("--out", default="assets/threat-intel/threat-feed.csv", help="Output file path")
    args = parser.parse_args()

    iocs = []
    if args.feed_url:
        html = fetch_feed(args.feed_url)
        iocs = parse_indicators(html, args.feed_url, args.limit)
    else:
        for feed in DEFAULT_FEEDS:
            print(f"🌐 Fetching from {feed}")
            try:
                html = fetch_feed(feed)
                iocs += parse_indicators(html, feed, args.limit)
            except Exception as e:
                print(f"❌ Failed to fetch from {feed}: {e}")
    
    if not iocs:
        print("⚠️ No IOCs found")
        return

    save_iocs(iocs, args.out)

if __name__ == "__main__":
    main()
