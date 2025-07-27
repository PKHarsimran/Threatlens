import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ThreatTimeline({ iocs, isLoading }) {
  const generateTimelineData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date: format(date, 'MMM dd'),
        fullDate: startOfDay(date),
        count: 0,
        critical: 0
      };
    });

    iocs.forEach(ioc => {
      const iocDate = startOfDay(new Date(ioc.created_date));
      const dayData = last7Days.find(day =>
        day.fullDate.getTime() === iocDate.getTime()
      );

      if (dayData) {
        dayData.count += 1;
        if (ioc.severity === 'critical') {
          dayData.critical += 1;
        }
      }
    });

    return last7Days;
  };

  const timelineData = generateTimelineData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-cyan-500/30 rounded-lg p-3 shadow-lg">
          <p className="text-cyan-300 font-medium">{label}</p>
          <p className="text-white">
            Total IOCs: <span className="text-cyan-400">{payload[0].value}</span>
          </p>
          <p className="text-white">
            Critical: <span className="text-red-400">{payload[1].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          7-Day Threat Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Skeleton className="h-48 w-full bg-slate-700" />
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill="#0891b2"
                  name="Total IOCs"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="critical"
                  fill="#ef4444"
                  name="Critical"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}