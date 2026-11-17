"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowRight, Clock, Shield, CheckCircle2, Archive, ArrowUpRight } from "lucide-react";
import { useGetAuditLogsQuery } from "@/redux/features/profile/profileApi";

export function RecentActivityWidget() {
  const { data: auditResponse, isLoading } = useGetAuditLogsQuery({ limit: 4 });
  const logs = auditResponse?.data || [];

  const getActionIcon = (action: string) => {
    switch (action) {
      case "PUBLISHED":
        return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />;
      case "ARCHIVED":
        return <Archive className="w-3.5 h-3.5 text-amber-600" />;
      case "CREATE":
      case "CREATE_USER":
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  const formatShortTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="bg-canvas border border-hairline rounded-2xl p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-main">Recent Admin Activity</h4>
            <p className="text-[11px] text-sub">Real-time audit events</p>
          </div>
        </div>

        <Link
          href="/admin/settings"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>View Audit Log</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="py-4 text-center text-xs text-sub">Loading activity...</div>
      ) : logs.length === 0 ? (
        <div className="py-4 text-center text-xs text-sub">No recent activity recorded.</div>
      ) : (
        <div className="divide-y divide-hairline">
          {logs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
              <div className="flex items-start space-x-2.5">
                <div className="mt-0.5 p-1 rounded-md bg-canvas-subtle border border-hairline flex-shrink-0">
                  {getActionIcon(log.action)}
                </div>
                <div>
                  <p className="text-xs text-main font-medium leading-snug">
                    {log.description}
                  </p>
                  <span className="text-[10px] text-muted font-mono">
                    by {log.actorName} {log.actorRole ? `(${log.actorRole})` : ""}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-muted whitespace-nowrap font-mono">
                {formatShortTime(log.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

