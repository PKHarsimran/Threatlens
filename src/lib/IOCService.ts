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
const CSV_PATH = '/threat-intel/threat-feed.csv';

function parseCSV(text: string): IOCRecord[] {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift()?.split(',') || [];
  return lines.map((line, idx) => {
    const values = line.split(',');
    const record: any = { id: crypto.randomUUID() };
    headers.forEach((h, i) => {
      record[h] = values[i];
    });
    if (record.timestamp && !record.created_date) {
      record.created_date = record.timestamp;
    }
    return record as IOCRecord;
  });
}

async function loadFromCSV(): Promise<IOCRecord[]> {
  const resp = await fetch(CSV_PATH);
  const text = await resp.text();
  return parseCSV(text);
}

async function getData(): Promise<IOCRecord[]> {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }
  const data = await loadFromCSV();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export async function list(order?: string): Promise<IOCRecord[]> {
  const data = await getData();
  if (order === '-created_date' || order === '-timestamp') {
    return [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  return data;
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
