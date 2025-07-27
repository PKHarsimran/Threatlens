import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const reliabilityColors = {
  verified: "bg-green-500/20 text-green-400 border-green-500/30",
  reliable: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  questionable: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  unknown: "bg-gray-500/20 text-gray-400 border-gray-500/30"
};

export default function TopSources({ sources, isLoading }) {
  const topSources = sources
    .sort((a, b) => (b.ioc_count || 0) - (a.ioc_count || 0))
    .slice(0, 8);

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          Top Sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="w-8 h-8 rounded-full bg-slate-700" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-3/4 bg-slate-700" />
                    <Skeleton className="h-3 w-1/2 bg-slate-700" />
                  </div>
                </div>
                <Skeleton className="h-6 w-12 bg-slate-700" />
              </div>
            ))}
          </div>
        ) : topSources.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No sources found</p>
            <p className="text-sm">Add some sources to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topSources.map((source, index) => (
              <div key={source.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-yellow-500'][index]
                  }`}>
                    <span className="text-white text-sm font-medium">
                      {source.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{source.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={`${reliabilityColors[source.reliability]} text-xs`}>
                        {source.reliability}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {source.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <p className="font-semibold text-cyan-400">{source.ioc_count || 0}</p>
                  <p className="text-xs text-slate-400">IOCs</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}