import os
import re
import csv
import requests
from datetime import datetime, timezone
from bs4 import BeautifulSoup

IOC_PATTERN = re.compile(r"(?:[0-9]{1,3}\.){3}[0-9]{1,3}|(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})")

FEEDS = [
    "https://www.abuseipdb.com/statistics",
    "https://feodotracker.abuse.ch/blocklist/",
    "https://threatfox.abuse.ch/export/host/",
]

CSV_PATH = "assets/threat-intel/threat-feed.csv"


def determine_type(indicator: str) -> str:
    if re.fullmatch(r"(?:[0-9]{1,3}\.){3}[0-9]{1,3}", indicator):
        return "ip"
    if indicator.startswith(("http://", "https://")):
        return "url"
    if re.search(r"\.[a-zA-Z]{2,}$", indicator):
        return "domain"
    return "other"


def fetch_feed(url: str) -> str:
    print(f"🌐 Fetching from {url}")
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    return resp.text


def parse_indicators(html: str, source_url: str, limit: int):
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(separator="\n")
    candidates = IOC_PATTERN.findall(text)
    indicators = []
    seen = set()

    for ind in candidates:
        ind = ind.strip().lower()
        if ind in seen:
            continue
        seen.add(ind)
        indicators.append({
            "indicator": ind,
            "type": determine_type(ind),
            "threat_type": "unknown",
            "confidence": "medium",
            "source_name": source_url.split("//")[-1].split("/")[0],
            "source_url": source_url,
            "source_type": "threat_feed",
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        if len(indicators) >= limit:
            break
    return indicators


def load_existing_indicators(path):
    existing = set()
    if os.path.exists(path):
        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                existing.add(row["indicator"].strip().lower())
    return existing


def append_to_csv(new_iocs, path=CSV_PATH):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    file_exists = os.path.exists(path)
    existing = load_existing_indicators(path)

    deduped_iocs = [ioc for ioc in new_iocs if ioc["indicator"].strip().lower() not in existing]
    if not deduped_iocs:
        print("🟡 No new IOCs to add.")
        return

    with open(path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=deduped_iocs[0].keys())
        if not file_exists:
            writer.writeheader()
        writer.writerows(deduped_iocs)
    print(f"✅ Appended {len(deduped_iocs)} new IOCs to {path}")


def main(limit=50):
    all_iocs = []
    for feed_url in FEEDS:
        try:
            html = fetch_feed(feed_url)
            indicators = parse_indicators(html, feed_url, limit)
            all_iocs.extend(indicators)
        except Exception as e:
            print(f"❌ Failed to fetch from {feed_url}: {e}")

    if all_iocs:
        append_to_csv(all_iocs)
    else:
        print("⚠️ No indicators found.")


if __name__ == "__main__":
    main(limit=int(os.getenv("LIMIT", 50)))
