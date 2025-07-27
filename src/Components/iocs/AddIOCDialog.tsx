import React, { useState, useEffect } from "react";
import { IOC } from "@/entities/all";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const iocTypes = ["ip", "domain", "url", "hash_md5", "hash_sha1", "hash_sha256", "email", "file_path", "registry_key", "other"];
const threatTypes = ["malware", "phishing", "c2", "botnet", "ransomware", "apt", "vulnerability", "data_breach", "other"];
const confidenceLevels = ["low", "medium", "high", "critical"];
const severityLevels = ["low", "medium", "high", "critical"];

export default function AddIOCDialog({ open, onOpenChange, onIOCAdded, ioc }) {
  const [formData, setFormData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (ioc) {
      setFormData({
        ...ioc,
        first_seen: ioc.first_seen ? ioc.first_seen.split('T')[0] : '',
        last_seen: ioc.last_seen ? ioc.last_seen.split('T')[0] : '',
      });
    } else {
      setFormData({
        type: 'ip',
        threat_type: 'malware',
        confidence: 'medium',
        severity: 'medium',
        is_active: true
      });
    }
  }, [ioc]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const dataToSave = { ...formData };
      if (!dataToSave.first_seen) delete dataToSave.first_seen;
      if (!dataToSave.last_seen) delete dataToSave.last_seen;

      if (ioc && ioc.id) {
        await IOC.update(ioc.id, dataToSave);
      } else {
        await IOC.create(dataToSave);
      }
      onIOCAdded();
    } catch (error) {
      console.error("Error saving IOC:", error);
    }
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] cyber-card text-white">
        <DialogHeader>
          <DialogTitle>{ioc ? 'Edit' : 'Add'} IOC</DialogTitle>
          <DialogDescription className="text-slate-400">
            {ioc ? 'Update the details for this indicator of compromise.' : 'Enter details for the new indicator of compromise.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="indicator" className="text-right text-slate-300">Indicator</Label>
              <Input id="indicator" value={formData.indicator || ''} onChange={handleInputChange} className="col-span-3 cyber-border bg-slate-800" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right text-slate-300">Type</Label>
              <Select value={formData.type || ''} onValueChange={(val) => handleSelectChange('type', val)}>
                <SelectTrigger className="col-span-3 cyber-border bg-slate-800"><SelectValue /></SelectTrigger>
                <SelectContent>{iocTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="threat_type" className="text-right text-slate-300">Threat Type</Label>
              <Select value={formData.threat_type || ''} onValueChange={(val) => handleSelectChange('threat_type', val)}>
                <SelectTrigger className="col-span-3 cyber-border bg-slate-800"><SelectValue /></SelectTrigger>
                <SelectContent>{threatTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="severity" className="text-right text-slate-300">Severity</Label>
                <Select value={formData.severity || ''} onValueChange={(val) => handleSelectChange('severity', val)}>
                  <SelectTrigger className="cyber-border bg-slate-800"><SelectValue /></SelectTrigger>
                  <SelectContent>{severityLevels.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="confidence" className="text-right text-slate-300">Confidence</Label>
                <Select value={formData.confidence || ''} onValueChange={(val) => handleSelectChange('confidence', val)}>
                  <SelectTrigger className="cyber-border bg-slate-800"><SelectValue /></SelectTrigger>
                  <SelectContent>{confidenceLevels.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source_name" className="text-right text-slate-300">Source Name</Label>
              <Input id="source_name" value={formData.source_name || ''} onChange={handleInputChange} className="col-span-3 cyber-border bg-slate-800" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source_url" className="text-right text-slate-300">Source URL</Label>
              <Input id="source_url" value={formData.source_url || ''} onChange={handleInputChange} className="col-span-3 cyber-border bg-slate-800" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-slate-300">Description</Label>
              <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} className="col-span-3 cyber-border bg-slate-800" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-white">Cancel</Button>
            <Button type="submit" disabled={isProcessing} className="bg-cyan-500 hover:bg-cyan-600">
              {isProcessing ? 'Saving...' : 'Save IOC'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}