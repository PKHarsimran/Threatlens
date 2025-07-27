import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Database, Filter, Shield, AlertTriangle } from "lucide-react";

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

export default function IOCStats({ iocs, filteredIocs }) {
  const criticalCount = iocs.filter(ioc => ioc.severity === 'critical').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total IOCs" value={iocs.length} icon={Database} color="border-cyan-500" />
      <StatCard title="Filtered" value={filteredIocs.length} icon={Filter} color="border-blue-500" />
      <StatCard title="Active" value={iocs.filter(i => i.is_active).length} icon={Shield} color="border-green-500" />
      <StatCard title="Critical" value={criticalCount} icon={AlertTriangle} color="border-red-500" />
    </div>
  );
}