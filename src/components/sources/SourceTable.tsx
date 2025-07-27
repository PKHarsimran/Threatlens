import React, { useState } from "react";
import { Source } from "@/entities/all";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  Globe,
  Trash2,
  Pencil,
  CheckCircle,
  XCircle
} from "lucide-react";
import AddSourceDialog from "./AddSourceDialog";

const reliabilityColors = {
  verified: "bg-green-500/20 text-green-400 border-green-500/30",
  reliable: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  questionable: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  unknown: "bg-gray-500/20 text-gray-400 border-gray-500/30"
};

const SourceTableRow = ({ source, onSourceUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingSource, setEditingSource] = useState(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await Source.delete(source.id);
      onSourceUpdate();
    } catch (error) {
      console.error("Error deleting source:", error);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <TableRow className="cyber-border border-b hover:bg-slate-800/50">
        <TableCell className="font-medium text-white">{source.name}</TableCell>
        <TableCell><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{source.url}</a></TableCell>
        <TableCell><Badge variant="outline" className="text-slate-300 border-slate-600">{source.type?.replace(/_/g, ' ')}</Badge></TableCell>
        <TableCell><Badge className={reliabilityColors[source.reliability]}>{source.reliability}</Badge></TableCell>
        <TableCell className="text-white font-semibold">{source.ioc_count || 0}</TableCell>
        <TableCell>
          {source.is_active ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-slate-500" />
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setEditingSource(source)} className="hover:text-cyan-400">
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting} className="hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {editingSource && (
        <AddSourceDialog
          open={!!editingSource}
          onOpenChange={() => setEditingSource(null)}
          onSourceAdded={onSourceUpdate}
          source={editingSource}
        />
      )}
    </>
  );
};


export default function SourceTable({ sources, isLoading, onSourceUpdate }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(5).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-slate-700/50" />
        ))}
      </div>
    );
  }

  if (sources.length === 0) {
    return (
      <div className="text-center py-16 cyber-card rounded-lg">
        <Globe className="w-12 h-12 mx-auto mb-4 text-cyan-500" />
        <h3 className="text-xl font-semibold text-white">No Sources Found</h3>
        <p className="text-slate-400 mt-2">Try adding new sources to begin.</p>
      </div>
    );
  }

  return (
    <div className="cyber-card rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="cyber-border border-b hover:bg-slate-800/80">
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">URL</TableHead>
            <TableHead className="text-white">Type</TableHead>
            <TableHead className="text-white">Reliability</TableHead>
            <TableHead className="text-white">IOC Count</TableHead>
            <TableHead className="text-white">Active</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map(source => (
            <SourceTableRow key={source.id} source={source} onSourceUpdate={onSourceUpdate} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}