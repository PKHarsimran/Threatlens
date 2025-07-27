import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { format } from 'date-fns';
import { Clock, AlertTriangle, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const severityColors = {
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  critical: "bg-red-500/20 text-red-400 border-red-500/30"
};

const typeIcons = {
  ip: { icon: "🌐", label: "IP" },
  domain: { icon: "🏠", label: "Domain" },
  url: { icon: "🔗", label: "URL" },
  hash_md5: { icon: "🔒", label: "MD5 hash" },
  hash_sha1: { icon: "🔒", label: "SHA1 hash" },
  hash_sha256: { icon: "🔒", label: "SHA256 hash" },
  email: { icon: "📧", label: "Email" },
  file_path: { icon: "📁", label: "File path" },
  registry_key: { icon: "🗝️", label: "Registry key" },
  other: { icon: "❓", label: "Other" }
};

export default function RecentIOCs({ iocs, isLoading }) {
  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock aria-hidden="true" className="w-5 h-5 text-cyan-400" />
          Recent IOCs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-700">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4 bg-slate-700" />
                  <Skeleton className="h-3 w-1/2 bg-slate-700" />
                </div>
                <Skeleton className="h-6 w-16 bg-slate-700" />
              </div>
            ))}
          </div>
        ) : iocs.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Shield aria-hidden="true" className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No IOCs found</p>
            <p className="text-sm">Add some indicators to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {iocs.map((ioc, index) => (
              <div key={ioc.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      <span
                        aria-label={(typeIcons[ioc.type] || typeIcons.other).label}
                        role="img"
                      >
                        {(typeIcons[ioc.type] || typeIcons.other).icon}
                      </span>
                    </span>
                    <p className="font-medium text-white truncate">
                      {ioc.indicator.length > 30 ? `${ioc.indicator.substring(0, 30)}...` : ioc.indicator}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">{ioc.source_name}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">
                      {format(new Date(ioc.created_date), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <Badge className={`${severityColors[ioc.severity]} border text-xs`}>
                    {ioc.severity === 'critical' && (
                      <AlertTriangle aria-hidden="true" className="w-3 h-3 mr-1" />
                    )}
                    {ioc.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}