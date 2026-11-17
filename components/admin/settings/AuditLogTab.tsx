"use client";

import React, { useState } from "react";
import {
  FileText,
  Clock,
  Shield,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Archive,
  ArrowUpRight,
  UserCheck,
  Sliders,
  Loader2,
} from "lucide-react";
import { useGetAuditLogsQuery } from "@/redux/features/profile/profileApi";
import type { AuditLogEntry } from "@/types/settings";

export function AuditLogTab() {
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const { data: auditResponse, isLoading, isFetching, refetch } =
    useGetAuditLogsQuery({ limit: 50 });

  const logs: AuditLogEntry[] = auditResponse?.data || [];

  const filteredLogs = logs.filter((log) => {
    if (entityFilter !== "ALL" && log.entityType !== entityFilter) {
      return false;
    }
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      log.actorName?.toLowerCase().includes(query) ||
      log.description?.toLowerCase().includes(query) ||
      log.action?.toLowerCase().includes(query) ||
      log.entityType?.toLowerCase().includes(query)
    );
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            Published
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Archive className="w-3 h-3 mr-1" />
            Archived
          </span>
        );
      case "CREATE":
      case "CREATE_USER":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Created
          </span>
        );
      case "ROLE_ASSIGNMENT":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <UserCheck className="w-3 h-3 mr-1" />
            Role Assigned
          </span>
        );
      case "CHANGE_PASSWORD":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <Shield className="w-3 h-3 mr-1" />
            Password
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">
            <Sliders className="w-3 h-3 mr-1" />
            {action}
          </span>
        );
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header & Quick Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-main">Administrative Activity Audit Log</h3>
          <p className="text-xs sm:text-sm text-sub mt-0.5">
            Immutable log of package publishing, role changes, settings updates, and order reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-canvas hover:bg-canvas-subtle border border-hairline rounded-xl text-xs font-semibold text-main cursor-pointer transition-colors shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          <span>{isFetching ? "Refreshing..." : "Refresh Logs"}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by admin name, action, or description..."
            className="w-full pl-9 pr-3 py-2 bg-canvas border border-hairline rounded-xl text-xs text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          aria-label="Filter by activity category"
          className="w-full sm:w-auto px-3 py-2 bg-canvas border border-hairline rounded-xl text-xs font-medium text-main focus:outline-none focus:border-brand-border cursor-pointer"
        >
          <option value="ALL">All Event Categories</option>
          <option value="CatalogItem">Packages & Services</option>
          <option value="PortalSettings">Portal Settings</option>
          <option value="Profile">Admin Roles & Profiles</option>
          <option value="Order">Inspection Orders</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-canvas border border-hairline rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-hairline flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-sub">
            Event Stream ({filteredLogs.length} events)
          </span>
          <span className="text-[11px] text-muted">
            Retention: Immutable audit record
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 flex items-center justify-center space-x-2 text-sub">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm">Loading activity stream...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-layout-bg text-sub uppercase text-[10px] tracking-wider border-b border-hairline">
                <tr>
                  <th className="py-3 px-4 font-bold">Timestamp</th>
                  <th className="py-3 px-4 font-bold">Admin Actor</th>
                  <th className="py-3 px-4 font-bold">Action Type</th>
                  <th className="py-3 px-4 font-bold">Activity Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sub">
                      No matching audit log records found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-canvas-subtle transition-colors">
                      <td className="py-3 px-4 text-muted font-mono text-[11px] whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-muted" />
                          <span>{formatTimestamp(log.timestamp)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-main text-xs">
                          {log.actorName}
                        </div>
                        {log.actorRole && (
                          <span className="text-[10px] text-muted font-mono uppercase">
                            {log.actorRole}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getActionBadge(log.action)}
                      </td>
                      <td className="py-3 px-4 text-main font-medium">
                        {log.description}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

