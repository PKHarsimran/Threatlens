import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  '#0891b2', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#10b981', // emerald
  '#f97316', // orange
  '#ec4899', // pink
  '#6366f1'  // indigo
];

export default function ThreatTypeChart({ iocs, isLoading }) {
  const generateChartData = () => {
    const threatTypes = {};

    iocs.forEach(ioc => {
      const type = ioc.threat_type || 'other';
      threatTypes[type] = (threatTypes[type] || 0) + 1;
    });

    return Object.entries(threatTypes)
      .map(([type, count]) => ({
        name: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: count,
        percentage: ((count / iocs.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);
  };

  const chartData = generateChartData();
  const total = iocs.length;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-cyan-500/30 rounded-lg p-3 shadow-lg">
          <p className="text-cyan-300 font-medium">{data.name}</p>
          <p className="text-white">Count: <span className="text-cyan-400">{data.value}</span></p>
          <p className="text-white">Percentage: <span className="text-cyan-400">{data.percentage}%</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 aria-hidden="true" className="w-5 h-5 text-cyan-400" />
          Threat Types Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full bg-slate-700" />
          </div>
        ) : total === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <BarChart3 aria-hidden="true" className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No threat data available</p>
              <p className="text-sm">Add some IOCs to see the distribution</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="h-64 w-full lg:w-2/3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full lg:w-1/3 space-y-2">
              {chartData.slice(0, 6).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-white">{item.value}</span>
                    <span className="text-xs text-slate-400 ml-1">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
              {chartData.length > 6 && (
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-700">
                  +{chartData.length - 6} more types
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}