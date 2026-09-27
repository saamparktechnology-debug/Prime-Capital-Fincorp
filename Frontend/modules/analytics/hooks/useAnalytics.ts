// modules/analytics/hooks/useAnalytics.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analyticsService";
import type { DateRangePreset } from "../types";

export const analyticsKeys = {
  kpis: (range: string, start?: string, end?: string) =>
    ["analytics", "kpis", range, start, end] as const,
  funnel: ["analytics", "funnel"] as const,
  collectionsTrend: (months: number) =>
    ["analytics", "collections-trend", months] as const,
  customerTrend: (months: number) =>
    ["analytics", "customer-trend", months] as const,
  bankDistribution: ["analytics", "bank-distribution"] as const,
  overdueAging: ["analytics", "overdue-aging"] as const,
  recentActivity: ["analytics", "recent-activity"] as const,
  topCustomers: ["analytics", "top-customers"] as const,
  agentDashboard: (agentId?: number) =>
    ["analytics", "agent-dashboard", agentId ?? "me"] as const,
  adminOverview: ["analytics", "admin-overview"] as const,
  agentSummary: (agentId: number | string) =>
    ["analytics", "agent-summary", String(agentId)] as const,
};

export function useBusinessKpis(
  range: DateRangePreset,
  start?: string,
  end?: string,
) {
  return useQuery({
    queryKey: analyticsKeys.kpis(range, start, end),
    queryFn: () => analyticsService.getKpis({ range, start, end }),
  });
}

export function useLoanFunnel() {
  return useQuery({
    queryKey: analyticsKeys.funnel,
    queryFn: () => analyticsService.getLoanFunnel(),
  });
}

export function useCollectionsTrend(months = 6) {
  return useQuery({
    queryKey: analyticsKeys.collectionsTrend(months),
    queryFn: () => analyticsService.getCollectionsTrend({ months }),
  });
}

export function useCustomerTrend(months = 6) {
  return useQuery({
    queryKey: analyticsKeys.customerTrend(months),
    queryFn: () => analyticsService.getCustomerTrend({ months }),
  });
}

export function useBankDistribution() {
  return useQuery({
    queryKey: analyticsKeys.bankDistribution,
    queryFn: () => analyticsService.getBankDistribution(),
  });
}

export function useOverdueAging() {
  return useQuery({
    queryKey: analyticsKeys.overdueAging,
    queryFn: () => analyticsService.getOverdueAging(),
  });
}

export function useRecentActivity(limit = 10) {
  return useQuery({
    queryKey: analyticsKeys.recentActivity,
    queryFn: () => analyticsService.getRecentActivity({ limit }),
  });
}

export function useTopCustomers(limit = 10) {
  return useQuery({
    queryKey: analyticsKeys.topCustomers,
    queryFn: () => analyticsService.getTopCustomers({ limit }),
  });
}

export function useAgentAnalytics(agentId?: number) {
  return useQuery({
    queryKey: analyticsKeys.agentDashboard(agentId),
    queryFn: () => analyticsService.agentDashboard(agentId),
  });
}

export function useAdminOverview() {
  return useQuery({
    queryKey: analyticsKeys.adminOverview,
    queryFn: () => analyticsService.adminOverview(),
  });
}

export function useAgentSummary(agentId: number | string | undefined) {
  return useQuery({
    queryKey: analyticsKeys.agentSummary(agentId ?? ""),
    queryFn: () => analyticsService.agentSummary(agentId!),
    enabled: Boolean(agentId),
  });
}
