import React, { useState, useEffect } from "react";
import { Source } from "@/entities/all";
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
import { Switch } from "@/components/ui/switch";

const sourceTypes = ["news_site", "security_blog", "threat_intel", "research_org", "social_media", "forum", "government", "other"];
const reliabilityLevels = ["verified", "reliable", "questionable", "unknown"];

export default function AddSourceDialog({ open, onOpenChange, onSourceAdded, source }) {
  const [formData, setFormData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (source) {
      setFormData(source);
    } else {
      setFormData({
        type: 'security_blog',
        reliability: 'unknown',
        is_active: true
      });
    }
  }, [source]);

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
      if (source && source.id) {
        await Source.update(source.id, formData);
      } else {
        await Source.create(formData);
      }
      onSourceAdded();
    } catch (error) {
      console.error("Error saving source:", error);
    }
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] cyber-card text-white">
        <DialogHeader>
          <DialogTitle>{source ? 'Edit' : 'Add'} Source</DialogTitle>
          <DialogDescription className="text-slate-400">
            {source ? 'Update the details for this threat source.' : 'Enter details for the new threat source.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-slate-300">Name</Label>
              <Input id="name" value={formData.name || ''} onChange={handleInputChange} className="col-span-3 cyber-border bg-slate-800" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right text-slate-300">URL</Label>
              <Input id="url" value={formData.url || ''} onChange={handleInputChange} className="col-span-3 cyber-border bg-slate-800" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right text-slate-300">Type</Label>
              <Select value={formData.type || ''} onValueChange={(val) => handleSelectChange('type', val)}>
                <SelectTrigger className="col-span-3 cyber-border bg-slate-800"><SelectValue /></SelectTrigger>
                <SelectContent>{sourceTypes.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reliability" className="text-right text-slate-300">Reliability</Label>
              <Select value={formData.reliability || ''} onValueChange={(val) => handleSelectChange('reliability', val)}>
                <SelectTrigger className="col-span-3 cyber-border bg-slate-800"><SelectValue /></SelectTrigger>
                <SelectContent>{reliabilityLevels.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-slate-300">Description</Label>
              <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} className="col-span-3 cyber-border bg-slate-800" />
            </div>
            <div className="flex items-center space-x-2 justify-end">
              <Label htmlFor="is_active" className="text-slate-300">Active Monitoring</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-white">Cancel</Button>
            <Button type="submit" disabled={isProcessing} className="bg-cyan-500 hover:bg-cyan-600">
              {isProcessing ? 'Saving...' : 'Save Source'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}