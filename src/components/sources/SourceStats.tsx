import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Shield, Activity } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className={`cyber-card border-l-4 ${color}`}>
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <Icon aria-hidden="true" className="w-8 h-8 text-slate-500" />
    </CardContent>
  </Card>
);

export default function SourceStats({ sources, iocs }) {
  const verifiedSources = sources.filter(s => s.reliability === 'verified').length;
  const totalIOCs = iocs.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard title="Total Sources" value={sources.length} icon={Globe} color="border-cyan-500" />
      <StatCard title="Verified Sources" value={verifiedSources} icon={Shield} color="border-green-500" />
      <StatCard title="Total IOCs" value={totalIOCs} icon={Activity} color="border-blue-500" />
    </div>
  );
}