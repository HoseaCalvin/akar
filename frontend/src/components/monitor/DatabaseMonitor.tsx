"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Database,
  Lightbulb,
  PlugZap,
  Cpu,
  HardDrive,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import EChart from "@/components/EChart";
import type { EChartsOption } from "echarts";
import { endpoint } from "@/lib/endpoint";
import { DatabaseMetrics, DatabaseQueries, DatabaseStat } from "@/lib/types";
import { getMilitaryTime } from "@/utils/helpers";

const INCIDENTS = [
  {
    severity: "High",
    color: "bg-red-500",
    badge: "bg-red-100/80 text-red-600",
    label: "DB2 – High CPU Usage",
    time: "10:28",
    info: "85% CPU | SVR-DB2-DBS-P01",
  },
  {
    severity: "High",
    color: "bg-red-500",
    badge: "bg-red-100/80 text-red-600",
    label: "PostgreSQL – Connection Spike",
    time: "10:24",
    info: "112 connections | SVR-POS-DBS-U03",
  },
  {
    severity: "Medium",
    color: "bg-amber-500",
    badge: "bg-amber-100/80 text-amber-600",
    label: "Oracle – Slow Queries",
    time: "10:19",
    info: "32.8s avg | SVR-CRM-DBS-P01",
  },
];

const SLOW_QUERIES = [
  {
    query: "SELECT * FROM orders WHERE customer_id = ?",
    db: "PostgreSQL",
    user: "order-service",
    duration: "2.84 m",
    status: "Critical",
    seen: "08:18:42",
  },
  {
    query: "UPDATE payment SET status = ? WHERE id = ?",
    db: "Oracle",
    user: "payment-api",
    duration: "1.92 m",
    status: "Critical",
    seen: "08:18:31",
  },
  {
    query: "SELECT * FROM loan_application...",
    db: "SQL Server",
    user: "crm-service",
    duration: "1.24 m",
    status: "Critical",
    seen: "08:17:59",
  },
  {
    query: "aggregate(match, group, sort)",
    db: "MongoDB",
    user: "analytics",
    duration: "0.98 s",
    status: "Elevated",
    seen: "08:17:41",
  },
  {
    query: "SELECT account_id, SUM(amount)...",
    db: "MariaDB",
    user: "reporting",
    duration: "0.76 s",
    status: "Elevated",
    seen: "08:17:20",
  },
];

const NOTIFICATIONS = [
  {
    dot: "bg-red-500",
    tag: "CRITICAL",
    tagColor: "text-red-600",
    title: "Slow query spike",
    sub: "PostgreSQL / order-service",
    ago: "2 min ago",
  },
  {
    dot: "bg-amber-500",
    tag: "WARNING",
    tagColor: "text-amber-600",
    title: "Connection pool 82%",
    sub: "MongoDB / analytics",
    ago: "5 min ago",
  },
  {
    dot: "bg-emerald-500",
    tag: "INFO",
    tagColor: "text-emerald-600",
    title: "Index rebuild complete",
    sub: "SQL Server / crm",
    ago: "11 min ago",
  },
];

const ROOT_CAUSES = [
  "Missing Index",
  "Large Table Scan",
  "Lock Contention",
];

const GLASS_CARD =
  "rounded-[18px] border border-white/75 bg-white/40 backdrop-blur-2xl shadow-[0_10px_35px_rgba(76,91,132,0.14)]";

function StatCard({
  label,
  value,
  icon,
  bg,
  trend,
  trendUp,
}: any) {
  return (
    <div
      className={`${GLASS_CARD} flex min-h-[90px] min-w-0 items-center gap-3 px-4 py-3.5`}
    >
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium text-slate-500">
          {label}
        </p>

        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-[22px] font-bold leading-none text-slate-900">
            {value}
          </span>

          {trend && (
            <span
              className={`text-[9px] font-semibold ${
                trendUp ? "text-red-500" : "text-emerald-500"
              }`}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function BackupDonut({ data }: any) {
  const option: EChartsOption = {
    animation: false,
    series: [
      {
        type: "pie",
        radius: ["58%", "82%"],
        data: [
          {
            value: data.success,
            itemStyle: { color: "#10b981" },
          },
          {
            value: data.warning,
            itemStyle: { color: "#f59e0b" },
          },
          {
            value: data.failed,
            itemStyle: { color: "#ef4444" },
          },
        ],
        label: {
          show: false,
        },
        emphasis: {
          scale: false,
        },
      },
    ],
  };

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-[92px] w-[92px] flex-shrink-0">
        <EChart
          option={option}
          style={{
            width: "100%",
            height: "100%",
          }}
        />

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold leading-none text-slate-900">
            {data.total}
          </span>

          <span className="mt-1 text-[9px] uppercase text-slate-400">
            Total
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2 text-[13px]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />

          <span className="text-slate-600">Success</span>

          <span className="ml-auto font-semibold text-slate-800">
            {data.success}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" />

          <span className="text-slate-600">Warning</span>

          <span className="ml-auto font-semibold text-slate-800">
            {data.warning}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />

          <span className="text-slate-600">Failed</span>

          <span className="ml-auto font-semibold text-slate-800">
            {data.failed}
          </span>
        </div>
      </div>
    </div>
  );
}

function NotificationsCard() {
  return (
    <div className={`${GLASS_CARD} flex min-h-[539px] flex-col p-4`}>
      <div className="mb-1 flex items-center gap-2">
        <Bell className="h-4 w-4 text-slate-600" />

        <p className="text-sm font-semibold text-slate-700">
          Notifications
        </p>
      </div>

      <p className="mb-4 text-[11px] text-slate-400">
        Actionable database events
      </p>

      <div className="flex-1">
        {NOTIFICATIONS.map((n, i) => (
          <div key={i}>
            <div className="mb-3 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${n.dot}`} />

              <span
                className={`text-[9px] font-bold uppercase ${n.tagColor}`}
              >
                {n.tag}
              </span>
            </div>

            <p className="text-[13px] font-semibold text-slate-700">
              {n.title}
            </p>

            <p className="mt-1 text-[10px] text-slate-400">{n.sub}</p>

            <p className="mt-3 text-[10px] text-slate-300">{n.ago}</p>

            {i < NOTIFICATIONS.length - 1 && (
              <div className="my-4 border-t border-white/70" />
            )}
          </div>
        ))}
      </div>

      <button className="mt-5 text-center text-[11px] font-semibold text-blue-500 transition hover:text-blue-600">
        View All Notifications →
      </button>
    </div>
  );
}

export default function DatabaseMonitor() {
  const [databaseStats, setDatabaseStats] = useState<DatabaseStat | null>(null);
  const [databaseMetrics, setDatabaseMetrics] = useState<DatabaseMetrics[] | null>(null);
  const [databaseQueries, setDatabaseQueries] = useState<DatabaseQueries[] | null>(null);
  const [activeRootCause, setActiveRootCause] = useState(0);

  useEffect(() => {
    const fetchDatabaseStats = async () => {
      const databaseStats = await endpoint.get<DatabaseStat>('/api/database/stats/get/6477801f-7386-4758-aad2-cc3c53c69605');

      setDatabaseStats(databaseStats.data);
    }

    fetchDatabaseStats();
  }, []);

  useEffect(() => {
    const fetchDatabaseMetrics = async () => {
      const databaseMetrics = await endpoint.get<DatabaseMetrics[]>('/api/database/metrics/get/c7eae74a-a8ee-4fe5-ba15-95f17d0c2de0');

      setDatabaseMetrics(databaseMetrics.data);
    }

    const fetchDatabaseQueries = async () => {
      const databaseQueries = await endpoint.get<DatabaseQueries[]>('/api/database/query/get/c7eae74a-a8ee-4fe5-ba15-95f17d0c2de0');

      setDatabaseQueries(databaseQueries.data);      
    }

    fetchDatabaseMetrics();
    fetchDatabaseQueries();
  }, [databaseStats]);
  
  const STAT_CARDS = [
    {
      label: "Total Database",
      value: databaseStats?.total_database,
      icon: <Database className="h-5 w-5 text-blue-500" />,
      bg: "bg-blue-100/80",
      trend: null,
    },
    {
      label: "Slow Queries",
      value: databaseStats?.slow_queries,
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      bg: "bg-red-100/80",
      trend: "+20%",
      trendUp: true,
    },
    {
      label: "Active Connections",
      value: databaseStats?.active_connections,
      icon: <PlugZap className="h-5 w-5 text-purple-500" />,
      bg: "bg-purple-100/80",
      trend: "+11%",
      trendUp: false,
    },
    {
      label: "High CPU Usage",
      value: databaseStats?.high_cpu_usage,
      icon: <Cpu className="h-5 w-5 text-orange-500" />,
      bg: "bg-orange-100/80",
      trend: "+80%",
      trendUp: false,
    },
    {
      label: "High Disk Usage",
      value: databaseStats?.high_cpu_usage,
      icon: <HardDrive className="h-5 w-5 text-teal-500" />,
      bg: "bg-teal-100/80",
      trend: "+15%",
      trendUp: true,
    },
  ];

  const BACKUP_DATA = {
    success: databaseStats?.db_backup_monitoring[0].success_count,
    warning: databaseStats?.db_backup_monitoring[0].warning_count,
    failed: databaseStats?.db_backup_monitoring[0].failed_count,
    total:
      (databaseStats?.db_backup_monitoring[0].success_count ?? 0) +
      (databaseStats?.db_backup_monitoring[0].warning_count ?? 0) +
      (databaseStats?.db_backup_monitoring[0].failed_count ?? 0),
  };

  const option: EChartsOption = {
    animation: false,
    grid: {
      top: 16,
      right: 12,
      bottom: 42,
      left: 42,
    },
    xAxis: {
      type: "category",
      data: databaseMetrics?.map((data) => getMilitaryTime(data.time)),
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#94a3b8",
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      max: 100,
      interval: 25,
      axisLabel: {
        color: "#94a3b8",
        fontSize: 10,
        formatter: "{value}%",
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "rgba(148,163,184,0.14)",
        },
      },
    },
    series: [
      {
        name: "CPU",
        type: "line",
        data: databaseMetrics?.map((data) => data.cpu),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: "#4f6df5",
          width: 2.2,
        },
      },
      {
        name: "Memory",
        type: "line",
        data: databaseMetrics?.map((data) => data.memory),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: "#f59e0b",
          width: 2.2,
        },
      },
      {
        name: "Disk",
        type: "line",
        data: databaseMetrics?.map((data) => data.disk),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: "#16a34a",
          width: 2.2,
        },
      },
      {
        name: "I/O",
        type: "line",
        data: databaseMetrics?.map((data) => data.io),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: "#ef4444",
          width: 2.2,
        },
      },
    ],
    legend: {
      bottom: 3,
      left: "center",
      textStyle: {
        color: "#64748b",
        fontSize: 10,
      },
      icon: "circle",
      itemWidth: 7,
      itemHeight: 7,
      itemGap: 22,
    },
    tooltip: {
      trigger: "axis",
    },
  };

  return (
    <main className="relative flex min-h-full flex-col overflow-x-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#E8EDF9_45%,#CAD6F4_100%)] px-5 pb-5 pt-6 sm:px-6 lg:px-7">
      <TopBar />

      <section className="pt-0">
        <h1 className="text-xl font-semibold text-slate-900">
          Database Monitoring
        </h1>

        <p className="mt-1 text-sm text-slate-700">
          Interactive view of your Kubernetes environment and dependencies
        </p>
      </section>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_258px]">
        <div className="min-w-0 space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {STAT_CARDS.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div
              className={`${GLASS_CARD} flex h-[425px] min-w-0 flex-col p-4 sm:p-5`}
            >
              <div className="mb-1">
                <p className="text-[16px] font-semibold text-slate-800">
                  Resource Utilization
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  CPU, Memory, and Disk Usage
                </p>
              </div>

              <div className="mt-2 min-h-0 flex-1">
                <EChart
                  option={option}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            </div>

            <div className="grid min-w-0 grid-rows-[185px_228px] gap-3">
              <div className={`${GLASS_CARD} p-4`}>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[16px] font-semibold text-slate-800">
                    Backup Monitoring
                  </p>

                  <button className="flex items-center gap-0.5 text-[11px] font-semibold text-blue-500 transition hover:text-blue-600">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <BackupDonut data={BACKUP_DATA} />
              </div>

              <div className={`${GLASS_CARD} p-4`}>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[16px] font-semibold text-slate-800">
                    Active Incident Deep Dive
                  </p>

                  <button className="flex items-center gap-0.5 text-[11px] font-semibold text-blue-500 transition hover:text-blue-600">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {INCIDENTS.map((inc, i) => (
                    <div
                      key={i}
                      className="flex min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-white/70 bg-white/30 px-2.5 py-2 backdrop-blur-md transition hover:bg-white/55"
                    >
                      <span
                        className={`inline-flex flex-shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[9px] font-semibold ${inc.badge}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${inc.color}`}
                        />
                        {inc.severity}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold text-slate-700">
                          {inc.label}
                        </p>

                        <p className="truncate text-[9px] text-slate-400">
                          {inc.time} | {inc.info}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <NotificationsCard />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div
          className={`${GLASS_CARD} min-h-[345px] min-w-0 p-4 sm:p-5`}
        >
          <p className="text-[16px] font-semibold text-slate-800">
            Slow Query Monitoring
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Queries exceeding configured latency thresholds
          </p>

          <div className="mb-3 mt-5 flex items-center justify-between gap-3">
            <p className="text-[12px] font-semibold text-slate-700">
              Top Slow Queries
            </p>

            <div className="flex gap-2 text-[9px]">
              <span className="rounded-full bg-red-100/80 px-3 py-1 font-semibold text-red-600">
                Critical &gt; 1m
              </span>

              <span className="rounded-full bg-amber-100/80 px-3 py-1 font-semibold text-amber-600">
                Others &gt; 2s
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl">
            <table className="overflow-y-auto w-full min-w-[680px] max-h-[700px] text-xs">
              <thead>
                <tr className="bg-blue-100/35 text-slate-500">
                  <th className="whitespace-nowrap px-3 py-2.5 text-left text-[9px] font-semibold uppercase tracking-wide">
                    Query
                  </th>

                  <th className="whitespace-nowrap px-3 py-2.5 text-left text-[9px] font-semibold uppercase tracking-wide">
                    Database
                  </th>

                  <th className="whitespace-nowrap px-3 py-2.5 text-left text-[9px] font-semibold uppercase tracking-wide">
                    User / App
                  </th>

                  <th className="whitespace-nowrap px-3 py-2.5 text-left text-[9px] font-semibold uppercase tracking-wide">
                    Duration
                  </th>

                  <th className="whitespace-nowrap px-3 py-2.5 text-left text-[9px] font-semibold uppercase tracking-wide">
                    Status
                  </th>

                  <th className="whitespace-nowrap px-3 py-2.5 text-left text-[9px] font-semibold uppercase tracking-wide">
                    Last Seen
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/60">
                {databaseQueries?.map((row, i) => (
                  <tr
                    key={i}
                    className="transition-colors hover:bg-white/30"
                  >
                    <td className="max-w-[230px] truncate px-3 py-2.5 text-[10px] text-slate-600">
                      {row.query}
                    </td>

                    <td className="px-3 py-2.5 text-[10px] text-slate-500">
                      {row.database}
                    </td>

                    <td className="px-3 py-2.5 text-[10px] text-slate-500">
                      {row.user_app}
                    </td>

                    <td className="px-3 py-2.5 text-[10px] font-semibold text-slate-700">
                      {row.duration}s
                    </td>

                    <td className="px-3 py-2.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                          row.severity.name === "Critical"
                            ? "bg-red-100/80 text-red-600"
                            : "bg-amber-100/80 text-amber-600"
                        }`}
                      >
                        {row.severity.name}
                      </span>
                    </td>

                    <td className="px-3 py-2.5 text-[10px] text-slate-400">
                      {getMilitaryTime(row.last_seen)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={`${GLASS_CARD} flex min-h-[345px] min-w-0 flex-col gap-4 p-4 sm:p-5`}
        >
          <p className="text-[16px] font-semibold text-slate-800">
            Query Performance Insights
          </p>

          <div className="flex gap-3 rounded-xl border border-blue-100/70 bg-blue-100/45 px-3.5 py-3 backdrop-blur-md">
            <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />

            <div>
              <p className="text-[13px] font-semibold text-blue-700">
                High I/O wait time detected
              </p>

              <p className="mt-1 text-[10px] leading-relaxed text-blue-600/80">
                I/O wait time increased by 62% compared to the previous hour.
                Consider checking disk performance or missing indexes.
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Potential Root Causes
            </p>

            <div className="flex flex-wrap gap-2">
              {ROOT_CAUSES.map((cause, i) => (
                <button
                  key={cause}
                  type="button"
                  onClick={() => setActiveRootCause(i)}
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-medium transition ${
                    activeRootCause === i
                      ? "border-blue-100 bg-blue-100/70 text-blue-600"
                      : "border-white/80 bg-white/35 text-slate-600 hover:bg-white/60"
                  }`}
                >
                  {cause}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Suggested Actions
            </p>

            <div className="space-y-2">
              {[
                "Check for missing indexes on filtered columns",
                "Review query execution plan",
                "Analyze table size and consider partitioning if needed",
              ].map((action) => (
                <label
                  key={action}
                  className="flex cursor-pointer items-start gap-2 text-[11px] text-slate-600"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />

                  <span>{action}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="ml-auto mt-auto rounded-lg border border-blue-300/70 bg-white/30 px-7 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-white/55">
            Execute
          </button>
        </div>
      </div>
    </main>
  );
}