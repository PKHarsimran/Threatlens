import React, { useState, useEffect } from "react";
import { Source, IOC } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Globe,
  TrendingUp,
  Shield
} from "lucide-react";

import SourceTable from "../components/sources/SourceTable";
import AddSourceDialog from "../components/sources/AddSourceDialog";
import SourceStats from "../components/sources/SourceStats";

export default function Sources() {
  const [sources, setSources] = useState([]);
  const [iocs, setIocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sourcesData, iocsData] = await Promise.all([
        Source.list("-created_date"),
        IOC.list()
      ]);
      setSources(sourcesData);
      setIocs(iocsData);
    } catch (error) {
      console.error("Error loading sources:", error);
    }
    setIsLoading(false);
  };

  const filteredSources = sources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSourceAdded = () => {
    setShowAddDialog(false);
    loadData();
  };

  return (
    <div className="p-6 lg:p-8 min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Threat Sources
            </h1>
            <p className="text-slate-400">
              Monitor and manage intelligence sources
            </p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 cyber-glow"
          >
            <Plus aria-hidden="true" className="w-4 h-4 mr-2" />
            Add Source
          </Button>
        </div>

        {/* Stats */}
        <SourceStats sources={sources} iocs={iocs} />

        {/* Search */}
        <div className="relative max-w-md">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search sources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 cyber-border border-slate-600 bg-slate-800/50 text-white placeholder-slate-400"
          />
        </div>

        {/* Source Table */}
        <SourceTable
          sources={filteredSources}
          iocs={iocs}
          isLoading={isLoading}
          onSourceUpdate={loadData}
        />

        {/* Add Source Dialog */}
        <AddSourceDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSourceAdded={handleSourceAdded}
        />
      </div>
    </div>
  );
}