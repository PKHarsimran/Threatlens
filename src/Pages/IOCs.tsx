
import React, { useState, useEffect } from "react";
import { IOC } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Plus,
  Download,
  AlertTriangle,
  Shield,
  Globe
} from "lucide-react";

import IOCTable from "../components/iocs/IOCTable";
import IOCFilters from "../components/iocs/IOCFilters";
import AddIOCDialog from "../components/iocs/AddIOCDialog";
import IOCStats from "../components/iocs/IOCStats";

export default function IOCs() {
  const [iocs, setIocs] = useState([]);
  const [filteredIocs, setFilteredIocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    threat_type: "all",
    confidence: "all",
    severity: "all",
    is_active: "all"
  });

  useEffect(() => {
    loadIOCs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [iocs, searchTerm, filters]);

  const loadIOCs = async () => {
    setIsLoading(true);
    try {
      const data = await IOC.list("-created_date");
      setIocs(data);
    } catch (error) {
      console.error("Error loading IOCs:", error);
    }
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...iocs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ioc =>
        ioc.indicator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ioc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ioc.source_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "all") {
        if (key === "is_active") {
          filtered = filtered.filter(ioc => ioc[key] === (value === "true"));
        } else {
          filtered = filtered.filter(ioc => ioc[key] === value);
        }
      }
    });

    setFilteredIocs(filtered);
  };

  const handleIOCAdded = () => {
    setShowAddDialog(false);
    loadIOCs();
  };

  const exportToCSV = () => {
    const csvData = filteredIocs.map(ioc => ({
      Indicator: ioc.indicator,
      Type: ioc.type,
      'Threat Type': ioc.threat_type,
      Confidence: ioc.confidence,
      Severity: ioc.severity,
      'Source Name': ioc.source_name,
      'Source URL': ioc.source_url,
      Description: ioc.description || '',
      'First Seen': ioc.first_seen || '',
      'Last Seen': ioc.last_seen || '',
      'Is Active': ioc.is_active ? 'Yes' : 'No',
      'Created Date': new Date(ioc.created_date).toISOString().split('T')[0]
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `iocs-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 lg:p-8 min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              IOC Database
            </h1>
            <p className="text-gray-400">
              Manage and analyze indicators of compromise
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="cyber-border hover:bg-cyan-500/10 text-cyan-300 border-cyan-500/50"
              disabled={filteredIocs.length === 0}
            >
              <Download aria-hidden="true" className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white cyber-glow"
            >
              <Plus aria-hidden="true" className="w-4 h-4 mr-2" />
              Add IOC
            </Button>
          </div>
        </div>

        {/* Stats */}
        <IOCStats iocs={iocs} filteredIocs={filteredIocs} />

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search IOCs, descriptions, or sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 cyber-border border-gray-600 bg-gray-800/50 text-gray-100 placeholder-gray-400"
            />
          </div>
          <IOCFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* IOC Table */}
        <IOCTable
          iocs={filteredIocs}
          isLoading={isLoading}
          onIOCUpdate={loadIOCs}
        />

        {/* Add IOC Dialog */}
        <AddIOCDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onIOCAdded={handleIOCAdded}
        />
      </div>
    </div>
  );
}
