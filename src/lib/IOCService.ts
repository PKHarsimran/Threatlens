export interface IOCRecord {
  id: string;
  indicator: string;
  type: string;
  threat_type: string;
  confidence: string;
  source_name: string;
  source_url: string;
  source_type: string;
  created_date: string;
  timestamp: string;
}

const STORAGE_KEY = 'iocs';
const META_KEY = 'iocs:lastModified';

// Resolve CSV path dynamically so it works in development and production
const CSV_PATH = (() => {
  if (typeof window !== 'undefined') {
    return new URL(
      'threat-intel/threat-feed.csv',
      `${window.location.origin}${import.meta.env.BASE_URL}`
    ).toString();
  }
  return `${import.meta.env.BASE_URL}threat-intel/threat-feed.csv`;
})();

import Papa from 'papaparse';

export function parseCSV(text: string): IOCRecord[] {
  const { data } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return data.map(row => {
    const record: any = { id: crypto.randomUUID(), ...row };
    if (record.timestamp && !record.created_date) {
      record.created_date = record.timestamp;
    }
    return record as IOCRecord;
  });
}

async function loadFromCSV(): Promise<{ data: IOCRecord[]; lastModified?: string }> {
  const resp = await fetch(CSV_PATH);
  const text = await resp.text();
  return { data: parseCSV(text), lastModified: resp.headers.get('Last-Modified') || undefined };
}

async function getData(forceRefresh = false): Promise<IOCRecord[]> {
  const cached = !forceRefresh ? localStorage.getItem(STORAGE_KEY) : null;
  const cachedLast = localStorage.getItem(META_KEY);

  if (cached && !forceRefresh) {
    try {
      const headResp = await fetch(CSV_PATH, { method: 'HEAD' });
      const lastModified = headResp.headers.get('Last-Modified');
      if (!lastModified || lastModified === cachedLast) {
        return JSON.parse(cached);
      }
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(META_KEY);
    } catch {
      return JSON.parse(cached);
    }
  }

  const { data, lastModified } = await loadFromCSV();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  if (lastModified) {
    localStorage.setItem(META_KEY, lastModified);
  }
  return data;
}

function sortData(data: IOCRecord[], order?: string): IOCRecord[] {
  if (order === '-created_date' || order === '-timestamp') {
    return [...data].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
  return data;
}

export async function list(order?: string): Promise<IOCRecord[]> {
  const data = await getData();
  return sortData(data, order);
}

export async function refresh(order?: string): Promise<IOCRecord[]> {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(META_KEY);
  const data = await getData(true);
  return sortData(data, order);
}

export async function create(ioc: Omit<IOCRecord, 'id' | 'timestamp' | 'created_date'>): Promise<IOCRecord> {
  const data = await getData();
  const newItem: IOCRecord = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    created_date: new Date().toISOString(),
    ...ioc,
  };
  data.push(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return newItem;
}

export async function update(id: string, updates: Partial<IOCRecord>): Promise<IOCRecord> {
  const data = await getData();
  const idx = data.findIndex(i => i.id === id);
  if (idx === -1) throw new Error('IOC not found');
  data[idx] = { ...data[idx], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data[idx];
}

export async function remove(id: string): Promise<void> {
  const data = await getData();
  const filtered = data.filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
