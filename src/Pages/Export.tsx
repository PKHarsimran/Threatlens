import React, { useState, useEffect } from "react";
import { IOC, Source } from "@/Entities/all";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Download,
  FileText,
  Database,
  Filter,
  Calendar
} from "lucide-react";
import { format, subDays } from "date-fns";

export default function Export() {
  const [iocs, setIocs] = useState([]);
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [exportConfig, setExportConfig] = useState({
    dataType: "iocs",
    format: "csv",
    dateRange: "all",
    includeFields: {
      indicator: true,
      type: true,
      threat_type: true,
      confidence: true,
      severity: true,
      source_name: true,
      source_url: true,
      description: true,
      first_seen: true,
      last_seen: true,
      is_active: true,
      created_date: true
    },
    filters: {
      type: "all",
      threat_type: "all",
      confidence: "all",
      severity: "all",
      is_active: "all"
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [iocsData, sourcesData] = await Promise.all([
        IOC.list("-created_date"),
        Source.list("-created_date")
      ]);
      setIocs(iocsData);
      setSources(sourcesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const getFilteredData = () => {
    let data = exportConfig.dataType === "iocs" ? iocs : sources;

    // Apply date filter
    if (exportConfig.dateRange !== "all") {
      const days = parseInt(exportConfig.dateRange);
      const cutoffDate = subDays(new Date(), days);
      data = data.filter(item => new Date(item.created_date) >= cutoffDate);
    }

    // Apply filters for IOCs
    if (exportConfig.dataType === "iocs") {
      Object.entries(exportConfig.filters).forEach(([key, value]) => {
        if (value !== "all") {
          if (key === "is_active") {
            data = data.filter(item => item[key] === (value === "true"));
          } else {
            data = data.filter(item => item[key] === value);
          }
        }
      });
    }

    return data;
  };

  const exportData = () => {
    const data = getFilteredData();
    const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");

    if (exportConfig.format === "csv") {
      exportToCSV(data, timestamp);
    } else {
      exportToJSON(data, timestamp);
    }
  };

  const exportToCSV = (data, timestamp) => {
    if (data.length === 0) return;

    const fields = Object.entries(exportConfig.includeFields)
      .filter(([_, include]) => include)
      .map(([field, _]) => field);

    const headers = fields.map(field =>
      field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    );

    const csvData = data.map(item =>
      fields.map(field => {
        let value = item[field];
        if (typeof value === 'boolean') {
          value = value ? 'Yes' : 'No';
        } else if (field.includes('date') && value) {
          value = format(new Date(value), 'yyyy-MM-dd HH:mm:ss');
        }
        return `"${value || ''}"`;
      }).join(',')
    );

    const csvContent = [headers.join(','), ...csvData].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportConfig.dataType}-${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (data, timestamp) => {
    const filteredData = data.map(item => {
      const filtered = {};
      Object.entries(exportConfig.includeFields).forEach(([field, include]) => {
        if (include && item[field] !== undefined) {
          filtered[field] = item[field];
        }
      });
      return filtered;
    });

    const jsonContent = JSON.stringify(filteredData, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportConfig.dataType}-${timestamp}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = getFilteredData();

  return (
    <div className="p-6 lg:p-8 min-h-full">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Export Data
          </h1>
          <p className="text-slate-400">
            Export your threat intelligence data in various formats
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Export Configuration */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Export Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Type */}
              <div className="space-y-2">
                <Label className="text-slate-300">Data Type</Label>
                <Select
                  value={exportConfig.dataType}
                  onValueChange={(value) => setExportConfig(prev => ({ ...prev, dataType: value }))}
                >
                  <SelectTrigger className="cyber-border border-slate-600 bg-slate-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iocs">IOCs (Indicators of Compromise)</SelectItem>
                    <SelectItem value="sources">Sources</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Format */}
              <div className="space-y-2">
                <Label className="text-slate-300">Export Format</Label>
                <Select
                  value={exportConfig.format}
                  onValueChange={(value) => setExportConfig(prev => ({ ...prev, format: value }))}
                >
                  <SelectTrigger className="cyber-border border-slate-600 bg-slate-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Excel Compatible)</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label className="text-slate-300">Date Range</Label>
                <Select
                  value={exportConfig.dateRange}
                  onValueChange={(value) => setExportConfig(prev => ({ ...prev, dateRange: value }))}
                >
                  <SelectTrigger className="cyber-border border-slate-600 bg-slate-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filters for IOCs */}
              {exportConfig.dataType === "iocs" && (
                <div className="space-y-4">
                  <Label className="text-slate-300">Filters</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-400">Type</Label>
                      <Select
                        value={exportConfig.filters.type}
                        onValueChange={(value) => setExportConfig(prev => ({
                          ...prev,
                          filters: { ...prev.filters, type: value }
                        }))}
                      >
                        <SelectTrigger className="cyber-border border-slate-600 bg-slate-800 text-white text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="ip">IP Address</SelectItem>
                          <SelectItem value="domain">Domain</SelectItem>
                          <SelectItem value="url">URL</SelectItem>
                          <SelectItem value="hash_md5">MD5 Hash</SelectItem>
                          <SelectItem value="hash_sha1">SHA1 Hash</SelectItem>
                          <SelectItem value="hash_sha256">SHA256 Hash</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-slate-400">Severity</Label>
                      <Select
                        value={exportConfig.filters.severity}
                        onValueChange={(value) => setExportConfig(prev => ({
                          ...prev,
                          filters: { ...prev.filters, severity: value }
                        }))}
                      >
                        <SelectTrigger className="cyber-border border-slate-600 bg-slate-800 text-white text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severity</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fields Selection */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Include Fields
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(exportConfig.includeFields).map(([field, included]) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field}
                      checked={included}
                      onCheckedChange={(checked) =>
                        setExportConfig(prev => ({
                          ...prev,
                          includeFields: { ...prev.includeFields, [field]: checked }
                        }))
                      }
                      className="border-slate-600"
                    />
                    <Label
                      htmlFor={field}
                      className="text-sm text-slate-300 capitalize cursor-pointer"
                    >
                      {field.replace(/_/g, ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Summary and Action */}
        <Card className="cyber-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Export Summary</h3>
                <div className="text-slate-400 space-y-1">
                  <p>Data Type: <span className="text-cyan-300">{exportConfig.dataType.toUpperCase()}</span></p>
                  <p>Records: <span className="text-cyan-300">{filteredData.length}</span></p>
                  <p>Format: <span className="text-cyan-300">{exportConfig.format.toUpperCase()}</span></p>
                  <p>Fields: <span className="text-cyan-300">{Object.values(exportConfig.includeFields).filter(Boolean).length}</span></p>
                </div>
              </div>
              <Button
                onClick={exportData}
                disabled={filteredData.length === 0 || isLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 cyber-glow"
              >
                <Download className="w-4 h-4 mr-2" />
                Export {filteredData.length} Records
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}