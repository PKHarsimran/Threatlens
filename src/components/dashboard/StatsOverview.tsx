
import React from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Activity,
  Database,
  Clock
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ title, value, icon: Icon, color, trend, isLoading }) => (
  <Card className="cyber-card overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-20 h-20 transform translate-x-8 -translate-y-8 ${color} rounded-full opacity-10`} />
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-2">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-16 bg-gray-700" />
          ) : (
            <p className="text-3xl font-bold text-gray-100">{value}</p>
          )}
          {trend && (
            <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp aria-hidden="true" className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-20 cyber-glow`}>
          <Icon aria-hidden="true" className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function StatsOverview({ stats, isLoading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total IOCs"
        value={stats.total}
        icon={Database}
        color="bg-cyan-500"
        trend="+12% this week"
        isLoading={isLoading}
      />
      <StatCard
        title="New Today"
        value={stats.today}
        icon={Clock}
        color="bg-green-500"
        trend="Real-time updates"
        isLoading={isLoading}
      />
      <StatCard
        title="Active Threats"
        value={stats.active}
        icon={Shield}
        color="bg-blue-500"
        trend="Monitoring active"
        isLoading={isLoading}
      />
      <StatCard
        title="Critical Alerts"
        value={stats.critical}
        icon={AlertTriangle}
        color="bg-red-500"
        trend="Requires attention"
        isLoading={isLoading}
      />
    </div>
  );
}
