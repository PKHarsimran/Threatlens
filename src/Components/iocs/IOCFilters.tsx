import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FilterSelect = ({ value, onValueChange, placeholder, items }) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className="w-full sm:w-[180px] cyber-border border-slate-600 bg-slate-800/50 text-white placeholder-slate-400">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All {placeholder}</SelectItem>
      {items.map(item => (
        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default function IOCFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const filterOptions = {
    type: [
      { value: 'ip', label: 'IP Address' },
      { value: 'domain', label: 'Domain' },
      { value: 'url', label: 'URL' },
      { value: 'hash_md5', label: 'MD5 Hash' },
      { value: 'hash_sha1', label: 'SHA1 Hash' },
      { value: 'hash_sha256', label: 'SHA256 Hash' },
      { value: 'email', label: 'Email' },
    ],
    threat_type: [
      { value: 'malware', label: 'Malware' },
      { value: 'phishing', label: 'Phishing' },
      { value: 'c2', label: 'C2' },
      { value: 'botnet', label: 'Botnet' },
      { value: 'ransomware', label: 'Ransomware' },
    ],
    severity: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' },
    ],
    is_active: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' },
    ]
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <FilterSelect
        value={filters.type}
        onValueChange={(val) => handleFilterChange('type', val)}
        placeholder="Types"
        items={filterOptions.type}
      />
      <FilterSelect
        value={filters.threat_type}
        onValueChange={(val) => handleFilterChange('threat_type', val)}
        placeholder="Threats"
        items={filterOptions.threat_type}
      />
      <FilterSelect
        value={filters.severity}
        onValueChange={(val) => handleFilterChange('severity', val)}
        placeholder="Severity"
        items={filterOptions.severity}
      />
      <FilterSelect
        value={filters.is_active}
        onValueChange={(val) => handleFilterChange('is_active', val)}
        placeholder="Status"
        items={filterOptions.is_active}
      />
    </div>
  );
}