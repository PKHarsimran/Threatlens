export interface SourceRecord {
  id: string;
  name: string;
  url: string;
  type: string;
  reliability: string;
  last_checked?: string;
  ioc_count?: number;
  description?: string;
  is_active: boolean;
}

const STORAGE_KEY = 'sources';

async function getData(): Promise<SourceRecord[]> {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) return JSON.parse(cached);
  const initial: SourceRecord[] = [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export async function list(order?: string): Promise<SourceRecord[]> {
  const data = await getData();
  if (order === '-created_date' || order === '-timestamp') {
    return [...data].sort((a, b) => {
      const t1 = b.last_checked ? new Date(b.last_checked).getTime() : 0;
      const t2 = a.last_checked ? new Date(a.last_checked).getTime() : 0;
      return t1 - t2;
    });
  }
  return data;
}

export async function create(source: Omit<SourceRecord, 'id'>): Promise<SourceRecord> {
  const data = await getData();
  const item: SourceRecord = { id: crypto.randomUUID(), ...source };
  data.push(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return item;
}

export async function update(id: string, updates: Partial<SourceRecord>): Promise<SourceRecord> {
  const data = await getData();
  const idx = data.findIndex(s => s.id === id);
  if (idx === -1) throw new Error('Source not found');
  data[idx] = { ...data[idx], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data[idx];
}

export async function remove(id: string): Promise<void> {
  const data = await getData();
  const filtered = data.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
