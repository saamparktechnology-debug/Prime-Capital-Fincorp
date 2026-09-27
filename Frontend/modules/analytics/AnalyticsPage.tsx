// modules/analytics/AnalyticsPage.tsx
"use client";

import { useState } from "react";
import {
  Users,
  Banknote,
  Wallet,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { usePermission } from "@/lib/hooks/usePermission";
import { formatCurrency, formatNumber } from "@/lib/format";

import { DateRangePicker } from "./components/DateRangePicker";
import { KpiCard } from "./components/KpiCard";
import { LoanFunnelChart } from "./components/LoanFunnelChart";
import { CollectionsTrendChart } from "./components/CollectionsTrendChart";
import { BankDistributionChart } from "./components/BankDistributionChart";
import { OverdueAgingChart } from "./components/OverdueAgingChart";
import { AgentOverviewTable } from "./components/AgentOverviewTable";

import {
  useBusinessKpis,
  useLoanFunnel,
  useCollectionsTrend,
  useBankDistribution,
  useOverdueAging,
  useAdminOverview,
} from "./hooks/useAnalytics";

import type { DateRangePreset } from "./types";

export default function AnalyticsPage() {
  const { isAdmin } = usePermission();

  const [range, setRange] = useState<DateRangePreset>("this_month");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const kpisQ = useBusinessKpis(range, start, end);
  const funnelQ = useLoanFunnel();
  const trendQ = useCollectionsTrend(6);
  const bankQ = useBankDistribution();
  const agingQ = useOverdueAging();
  const adminOverviewQ = useAdminOverview();

  const kpis = kpisQ.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description={
          isAdmin ? "Business performance overview" : "Your portfolio insights"
        }
        action={
          <DateRangePicker
            value={range}
            onChange={setRange}
            start={start}
            end={end}
            onStartChange={setStart}
            onEndChange={setEnd}
          />
        }
      />

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Customers"
          value={formatNumber(kpis?.customers.total ?? 0)}
          hint={`+${kpis?.customers.new_in_period ?? 0} this period`}
          icon={Users}
          accent="blue"
          loading={kpisQ.isLoading}
        />
        <KpiCard
          label="Active Loans"
          value={formatNumber(kpis?.loans.total ?? 0)}
          hint={`${formatCurrency(kpis?.loans.active_portfolio ?? 0)} portfolio`}
          icon={Banknote}
          accent="emerald"
          loading={kpisQ.isLoading}
        />
        <KpiCard
          label="Collected (All-time)"
          value={formatCurrency(kpis?.emis.total_collected ?? 0)}
          hint={`${formatCurrency(kpis?.emis.collected_in_period ?? 0)} this period`}
          icon={Wallet}
          accent="violet"
          loading={kpisQ.isLoading}
        />
        <KpiCard
          label="Outstanding"
          value={formatCurrency(kpis?.emis.total_outstanding ?? 0)}
          hint={
            kpis?.emis.total_overdue
              ? `${formatCurrency(kpis.emis.total_overdue)} overdue`
              : "No overdue"
          }
          icon={TrendingUp}
          accent={kpis?.emis.total_overdue ? "red" : "slate"}
          loading={kpisQ.isLoading}
        />
      </div>

      {/* Secondary KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Pending KYC"
          value={formatNumber(kpis?.customers.kyc_pending ?? 0)}
          hint={`${formatNumber(kpis?.customers.kyc_approved ?? 0)} approved`}
          icon={Clock}
          accent="amber"
          loading={kpisQ.isLoading}
        />
        <KpiCard
          label="Pending Applications"
          value={formatNumber(kpis?.loans.pending_applications ?? 0)}
          hint={`${formatNumber(kpis?.loans.approved_awaiting_disb ?? 0)} awaiting disbursement`}
          icon={FileSpreadsheet}
          accent="violet"
          loading={kpisQ.isLoading}
        />
        <KpiCard
          label="Total Disbursed"
          value={formatCurrency(kpis?.loans.total_disbursed ?? 0)}
          hint={`${formatNumber(kpis?.loans.total ?? 0)} loans`}
          icon={CheckCircle2}
          accent="emerald"
          loading={kpisQ.isLoading}
        />
        <KpiCard
          label="Overdue EMIs"
          value={formatNumber(kpis?.emis.overdue_count_in_period ?? 0)}
          hint={formatCurrency(kpis?.emis.total_overdue ?? 0)}
          icon={AlertCircle}
          accent={kpis?.emis.total_overdue ? "red" : "slate"}
          loading={kpisQ.isLoading}
        />
      </div>

      {/* Tabs: Charts / Agents (admin only) */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isAdmin && <TabsTrigger value="agents">Agents</TabsTrigger>}
          {isAdmin && <TabsTrigger value="banks">Banks</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <LoanFunnelChart data={funnelQ.data} loading={funnelQ.isLoading} />
            <CollectionsTrendChart
              data={trendQ.data}
              loading={trendQ.isLoading}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <OverdueAgingChart data={agingQ.data} loading={agingQ.isLoading} />
            {!isAdmin && (
              <BankDistributionChart
                data={bankQ.data}
                loading={bankQ.isLoading}
              />
            )}
          </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="agents" className="mt-6">
            <AgentOverviewTable
              data={adminOverviewQ.data}
              loading={adminOverviewQ.isLoading}
            />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="banks" className="mt-6">
            <BankDistributionChart
              data={bankQ.data}
              loading={bankQ.isLoading}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
