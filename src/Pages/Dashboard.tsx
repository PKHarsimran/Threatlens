import React, { useState, useEffect } from "react";
import { IOC, Source } from "@/entities/all";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Globe2,
  Clock4,
  Database,
  Activity,
  Download
} from "lucide-react";

import StatsOverview from "../components/dashboard/StatsOverview";
import ThreatTimeline from "../components/dashboard/ThreatTimeline";
import RecentIOCs from "../components/dashboard/RecentIOCs";
import TopSources from "../components/dashboard/TopSources";
import ThreatTypeChart from "../components/dashboard/ThreatTypeChart";

export default function Dashboard() {
  const [iocs, setIocs] = useState([]);
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    active: 0,
    critical: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [iocsData, sourcesData] = await Promise.all([
        IOC.list("-created_date"),
        Source.list("-created_date")
      ]);

      setIocs(iocsData);
      setSources(sourcesData);

      // Calculate stats
      const today = new Date();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);

      const todayIOCs = iocsData.filter(ioc => {
        const createdDate = new Date(ioc.created_date);
        return createdDate >= todayStart && createdDate <= todayEnd;
      });

      setStats({
        total: iocsData.length,
        today: todayIOCs.length,
        active: iocsData.filter(ioc => ioc.is_active).length,
        critical: iocsData.filter(ioc => ioc.severity === 'critical').length
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 lg:p-8 min-h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-100 mb-2">
              Threat Intelligence Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Real-time cyber threat monitoring and analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">
              <Activity className="w-4 h-4" />
              <span className="font-medium">System Online</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} isLoading={isLoading} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            <ThreatTimeline iocs={iocs} isLoading={isLoading} />
            <ThreatTypeChart iocs={iocs} isLoading={isLoading} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            <RecentIOCs iocs={iocs.slice(0, 10)} isLoading={isLoading} />
            <TopSources sources={sources.slice(0, 8)} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
