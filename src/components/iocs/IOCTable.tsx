
import React, { useState } from "react";
import { IOC } from "@/entities/all";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  AlertTriangle,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Pencil,
  ClipboardCopy,
  Check
} from "lucide-react";
import AddIOCDialog from "./AddIOCDialog";

const severityColors = {
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  critical: "bg-red-500/10 text-red-400 border-red-500/20"
};

const confidenceColors = {
  low: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  medium: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  high: "bg-green-500/10 text-green-400 border-green-500/20",
  critical: "bg-purple-500/10 text-purple-400 border-purple-500/20"
};

const IOCTableRow = ({ ioc, onIOCUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingIOC, setEditingIOC] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await IOC.delete(ioc.id);
      onIOCUpdate();
    } catch (error) {
      console.error("Error deleting IOC:", error);
    }
    setIsDeleting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ioc.indicator);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <TableRow className="cyber-border border-b hover:bg-gray-800/50">
        <TableCell className="font-medium text-gray-100 truncate max-w-xs">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={handleCopy}
            >
              {copied ? (
                <Check aria-hidden="true" className="w-4 h-4 text-green-400" />
              ) : (
                <ClipboardCopy aria-hidden="true" className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
              )}
              <span className="sr-only">{copied ? 'Copied' : 'Copy indicator'}</span>
            </Button>
            <span>{ioc.indicator}</span>
          </div>
        </TableCell>
        <TableCell><Badge variant="outline" className="text-gray-300 border-gray-600">{ioc.type}</Badge></TableCell>
        <TableCell><Badge variant="outline" className="text-gray-300 border-gray-600">{ioc.threat_type?.replace(/_/g, ' ')}</Badge></TableCell>
        <TableCell><Badge className={severityColors[ioc.severity]}>{ioc.severity}</Badge></TableCell>
        <TableCell><Badge className={confidenceColors[ioc.confidence]}>{ioc.confidence}</Badge></TableCell>
        <TableCell className="text-gray-300">{format(new Date(ioc.created_date), 'MMM dd, yyyy')}</TableCell>
        <TableCell>
          {ioc.is_active ? (
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20"><ShieldCheck aria-hidden="true" className="w-3 h-3 mr-1" /> Active</Badge>
          ) : (
          <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20"><ShieldOff aria-hidden="true" className="w-3 h-3 mr-1" /> Inactive</Badge>
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setEditingIOC(ioc)} className="hover:text-cyan-400">
              <Pencil aria-hidden="true" className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting} className="hover:text-red-500">
              <Trash2 aria-hidden="true" className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {editingIOC && (
        <AddIOCDialog
          open={!!editingIOC}
          onOpenChange={() => setEditingIOC(null)}
          onIOCAdded={onIOCUpdate}
          ioc={editingIOC}
        />
      )}
    </>
  );
};

export default function IOCTable({ iocs, isLoading, onIOCUpdate }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(10).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-gray-700/50" />
        ))}
      </div>
    );
  }

  if (iocs.length === 0) {
    return (
      <div className="text-center py-16 cyber-card rounded-lg">
        <AlertTriangle aria-hidden="true" className="w-12 h-12 mx-auto mb-4 text-amber-500" />
        <h3 className="text-xl font-semibold text-gray-100">No IOCs Found</h3>
        <p className="text-gray-400 mt-2">Try adjusting your filters or adding new IOCs.</p>
      </div>
    );
  }

  return (
    <div className="cyber-card rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="cyber-border border-b hover:bg-gray-800/80">
            <TableHead className="text-gray-200">Indicator</TableHead>
            <TableHead className="text-gray-200">Type</TableHead>
            <TableHead className="text-gray-200">Threat</TableHead>
            <TableHead className="text-gray-200">Severity</TableHead>
            <TableHead className="text-gray-200">Confidence</TableHead>
            <TableHead className="text-gray-200">Date Added</TableHead>
            <TableHead className="text-gray-200">Status</TableHead>
            <TableHead className="text-gray-200">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {iocs.map(ioc => (
            <IOCTableRow key={ioc.id} ioc={ioc} onIOCUpdate={onIOCUpdate} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
