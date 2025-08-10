import { describe, it, expect } from 'vitest';
import { parseCSV } from './IOCService';

describe('parseCSV', () => {
  it('handles quoted fields with commas', () => {
    const csv = `indicator,type,source_name,timestamp\n"1.2.3.4",ip,"Example, Inc.","2023-01-01"`;
    const records = parseCSV(csv);
    expect(records).toHaveLength(1);
    expect(records[0].indicator).toBe('1.2.3.4');
    expect(records[0].source_name).toBe('Example, Inc.');
    expect(records[0].timestamp).toBe('2023-01-01');
  });
});
