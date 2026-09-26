"use client";

import type { ReactNode, CSSProperties } from "react";
import {
  Workflow,
  Server,
  Container,
  Database,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import type { EChartsOption } from "echarts";
import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import EChart from "@/components/EChart";
import PageState from "@/components/PageState";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import type { Severity } from "@/lib/types";

type CubeColour = "blue" | "purple" | "green" | "orange" | "red";

const severityDot: Record<Severity, string> = {
  Critical: "bg-warning-critical",
  High: "bg-warning-high",
  Medium: "bg-warning-medium",
  Low: "bg-warning-low",
};

const clusterData = [
  {
    name: "Cluster 1",
    status: "Healthy",
    statusClass: "bg-blue-50 text-slate-800",
    dotClass: "bg-blue-600",
    colour: "blue" as CubeColour,
    accent: "blue" as CubeColour,
    pods: 24,
    containers: 12,
    services: 6,
  },
  {
    name: "Cluster 2",
    status: "Warning",
    statusClass: "bg-yellow-50 text-slate-800",
    dotClass: "bg-yellow-400",
    colour: "blue" as CubeColour,
    accent: "orange" as CubeColour,
    pods: 30,
    containers: 60,
    services: 6,
  },
  {
    name: "Cluster 3",
    status: "Critical",
    statusClass: "bg-red-50 text-slate-800",
    dotClass: "bg-red-600",
    colour: "blue" as CubeColour,
    accent: "red" as CubeColour,
    pods: 24,
    containers: 12,
    services: 6,
  },
];

export default function Dashboard() {
  const { data, loading, error } = useApi("dashboard", () =>
    api.dashboard.get(),
  );

  if (!data) {
    return (
      <main className="main-container">
        <TopBar />
        <PageState loading={loading} error={error} empty={!loading} />
      </main>
    );
  }

  const infrastructureHealthData: EChartsOption = {
    animation: true,
    tooltip: {
      show: false,
    },
    series: [
      {
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        radius: "82%",
        center: ["50%", "52%"],
        min: 0,
        max: 100,
        splitNumber: 1,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          roundCap: true,
          width: 26,
        },
        axisLine: {
          lineStyle: {
            width: 26,
            color: [[1, "#d5d5d5"]],
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        detail: {
          show: false,
        },
        data: [
          {
            value: Number(data.health.healthyPercent),
          },
        ],
        itemStyle: {
          color: "#4fba00",
        },
      },
    ],
  };

  const performanceData: EChartsOption = {
    animation: true,
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: 0,
      right: 0,
      top: 10,
      bottom: 0,
      containLabel: false,
    },
    xAxis: {
      type: "category",
      show: false,
      boundaryGap: false,
      data: data.performance.series.map((point) => point.time),
    },
    yAxis: {
      type: "value",
      show: false,
      min: 0,
      max: 100,
    },
    series: [
      {
        name: "CPU",
        type: "line",
        smooth: true,
        showSymbol: false,
        data: data.performance.series.map((point) => point.cpu),
        lineStyle: {
          width: 2,
          color: "#3158ff",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(49,88,255,0.48)",
              },
              {
                offset: 1,
                color: "rgba(49,88,255,0.04)",
              },
            ],
          },
        },
      },
    ],
  };

  const firstIncidentId = data.recentIncidents[0]?.id;

  const incidentTimes = ["2m ago", "2m ago", "3m ago", "5m ago"];

  return (
    <main className="main-container min-h-screen bg-[#f1f5ff]">
      <TopBar />

      <section className="shrink-0">
        <h1 className="text-[25px] font-semibold leading-tight text-slate-950">
          Good Morning, {data.greetingName}
        </h1>

        <p className="mt-2 text-[16px] text-slate-800">
          Here&apos;s what is happening with your infrastructure
        </p>
      </section>

      <section className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={
            <Workflow
              className="h-[40px] w-[40px] rounded-[10px] bg-blue-100 p-2 text-blue-600"
              strokeWidth={2}
            />
          }
          value={data.counts.nodes}
          label="Nodes"
          sublabel="Total Nodes"
        />

        <Stat
          icon={
            <Server
              className="h-[40px] w-[40px] rounded-[10px] bg-green-100 p-2 text-green-600"
              fill="currentColor"
              strokeWidth={0}
            />
          }
          value={data.counts.pods}
          label="Pods"
          sublabel="Total Pods"
        />

        <Stat
          icon={
            <Container
              className="h-[40px] w-[40px] rounded-[10px] bg-purple-100 p-2 text-purple-700"
              fill="currentColor"
              strokeWidth={0}
            />
          }
          value={data.counts.deployments}
          label="Containers"
          sublabel="Total Containers"
        />

        <Stat
          icon={
            <Database
              className="h-[40px] w-[40px] rounded-[10px] bg-yellow-50 p-2 text-yellow-500"
              fill="currentColor"
              strokeWidth={0}
            />
          }
          value={data.counts.services}
          label="Services"
          sublabel="Total Services"
        />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,3fr)_minmax(300px,400px)]">
        <section className="glass-effect-2 rounded-[18px] px-7 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold text-slate-950">
              Infrastructure Nodes
            </h2>

            <Link
              href="/private/monitor"
              className="flex items-center gap-1 text-[17px] font-medium text-blue-600 hover:underline"
            >
              Show all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3 md:divide-x md:divide-slate-200">
            {clusterData.map((cluster) => (
              <ClusterCard key={cluster.name} cluster={cluster} />
            ))}
          </div>
        </section>

        <section className="glass-effect-2 ml-auto w-full max-w-[400px] rounded-[18px] px-6 py-6">
          <h2 className="text-[16px] font-semibold text-slate-950">
            Recent Incidents
          </h2>

          <div className="mt-4 space-y-4">
            {data.recentIncidents.slice(0, 4).map((incident, index) => (
              <Link
                key={incident.id}
                href={`/private/incidents/${incident.id}`}
                className="group block"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${severityDot[incident.severity]}`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[14px] font-semibold leading-tight text-slate-900 group-hover:text-blue-600">
                        {incident.title}
                      </h3>

                      <span className="shrink-0 text-[11px] text-slate-500">
                        {incidentTimes[index]}
                      </span>
                    </div>

                    <p className="mt-1 text-[13px] text-slate-800">
                      {incident.service}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            <Link
              href="/private/incidents"
              className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-blue-600 hover:underline"
            >
              View All Service Incidents
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </section>

      <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(260px,360px)_minmax(260px,360px)]">
        <section className="glass-effect-2 rounded-[18px] px-8 py-6">
          <h2 className="text-[16px] font-semibold text-slate-950">
            Infrastructure Health
          </h2>

          <div className="mt-2 flex min-h-[175px] items-center justify-center gap-5">
            <div className="relative h-[145px] w-[145px] shrink-0">
              <EChart option={infrastructureHealthData} />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[13px] font-semibold text-slate-900">
                  {data.health.healthyPercent}%
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start">
              <p className="text-[31px] font-semibold leading-none text-slate-950">
                {data.health.healthyPercent}%
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-[17px] font-semibold text-green-600">
                <CheckCircle2 className="h-[18px] w-[18px] fill-green-600 text-white" />
                {data.health.label}
              </div>
            </div>
          </div>
        </section>

        <section className="glass-effect-2 rounded-[18px] px-7 py-6">
          <h2 className="text-[16px] font-semibold text-slate-950">
            Performance Metrics
          </h2>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Metric value={data.performance.mttdMinutes} label="MTTD" />

            <Metric value={data.performance.mttrMinutes} label="MTTR" />

            <Metric value={data.performance.rcaMinutes} label="RCA Time" />
          </div>

          <div className="mt-3.5 h-[80px]">
            <EChart option={performanceData} />
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-white via-white to-[#fff8d9] px-8 py-6">
          <h2 className="text-[16px] font-semibold text-slate-950">
            Active Investigations
          </h2>

          <div className="mt-3.5 flex items-center justify-between">
            <div>
              <p className="text-[38px] font-bold leading-none text-slate-950">
                {data.activeInvestigations}
              </p>

              <p className="mt-2.5 text-[14px] font-medium text-slate-900">
                Active
              </p>
            </div>

            <Image
              src="/icon-invest.svg"
              alt="Investigation"
              width={74}
              height={74}
              className="h-[74px] w-[74px] object-contain"
            />
          </div>

          <Link
            href={
              firstIncidentId
                ? `/private/incidents/${firstIncidentId}/investigation`
                : "/private/incidents"
            }
            className="mt-4 flex h-9 w-full items-center justify-center rounded-full bg-[#05064b] text-[13px] font-medium text-white shadow-lg transition hover:bg-blue-950"
          >
            Go Investigate!
          </Link>
        </section>
      </section>
    </main>
  );
}

function Stat({
  icon,
  value,
  label,
  sublabel,
}: {
  icon: ReactNode;
  value: number;
  label: string;
  sublabel: string;
}) {
  return (
    <section className="flex min-h-[68px] items-center gap-3 rounded-[14px] bg-white/80 px-4 py-2.5 shadow-[0_8px_30px_rgba(95,112,160,0.06)] backdrop-blur-sm">
      {icon}

      <div>
        <p className="text-[22px] font-bold leading-none text-slate-950">
          {value}
        </p>

        <p className="mt-1 text-[13px] font-medium leading-none text-slate-900">
          {label}
        </p>

        <p className="mt-1 text-[9px] text-slate-500">{sublabel}</p>
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-[22px] font-semibold leading-none text-slate-950">
        {value}
        <span className="ml-1 text-[10px] font-medium">min</span>
      </p>

      <p className="mt-2 text-[10px] text-slate-700">{label}</p>
    </div>
  );
}

function ClusterCard({
  cluster,
}: {
  cluster: {
    name: string;
    status: string;
    statusClass: string;
    dotClass: string;
    colour: CubeColour;
    accent: CubeColour;
    pods: number;
    containers: number;
    services: number;
  };
}) {
  return (
    <div className="flex min-w-0 flex-col items-center">
      <div
        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium shadow-sm ${cluster.statusClass}`}
      >
        <span className={`h-3.5 w-3.5 rounded-full ${cluster.dotClass}`} />
        {cluster.status}
      </div>

      <h3 className="mt-3 text-[18px] font-medium text-slate-900">
        {cluster.name}
      </h3>

      <div className="relative mt-1 h-[220px] w-full overflow-visible">
        <div className="absolute left-1/2 top-[48px] -translate-x-1/2">
          <Cube4 colour={cluster.colour} accentColour={cluster.accent} size={44} />
        </div>
      </div>

      <div className="mt-1 grid w-full max-w-[220px] grid-cols-3 gap-1">
        <ClusterStat type="pod" value={cluster.pods} label="Pods" />
        <ClusterStat
          type="container"
          value={cluster.containers}
          label="Containers"
        />
        <ClusterStat type="service" value={cluster.services} label="Services" />
      </div>
    </div>
  );
}

function ClusterStat({
  type,
  value,
  label,
}: {
  type: "pod" | "container" | "service";
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1">
        {type === "pod" && (
          <Server
            className="h-3 w-3 text-green-600"
            fill="currentColor"
            strokeWidth={0}
          />
        )}

        {type === "container" && (
          <Container
            className="h-3 w-3 text-purple-700"
            fill="currentColor"
            strokeWidth={0}
          />
        )}

        {type === "service" && (
          <Database
            className="h-3 w-3 text-yellow-500"
            fill="currentColor"
            strokeWidth={0}
          />
        )}

        <span className="text-[12px] font-semibold text-slate-900">
          {value}
        </span>
      </div>

      <span className="mt-1 text-[10px] text-slate-600">{label}</span>
    </div>
  );
}

// ── 3D Cube components (copied from incidents page) ──────────────────────────

const CUBE_FACES: Record<
  string,
  { top: string; front: string; right: string }
> = {
  blue: {
    top: "#cfe0ff,#9fb8f5",
    front: "#5c7de0,#3a56c4",
    right: "#3a56c4,#22348f",
  },
  red: {
    top: "#ffc2bf,#f28b86",
    front: "#e2534d,#c23430",
    right: "#b93330,#8a1f1d",
  },
  orange: {
    top: "#fff3c4,#ffd27a",
    front: "#ffb347,#ff8a1e",
    right: "#ff9d33,#e6720f",
  },
  green: {
    top: "#ddf7c4,#b3ea7c",
    front: "#8cd94a,#63b829",
    right: "#4f9c1e,#3a7415",
  },
  purple: {
    top: "#e6d9ff,#c6a8fb",
    front: "#a072e6,#7d49cf",
    right: "#7140b8,#54308f",
  },
};

const CUBE_GLOW_RGB: Record<string, string> = {
  blue: "150,170,255",
  red: "255,120,110",
  orange: "255,175,60",
  green: "140,230,110",
  purple: "190,140,255",
};

function CubeUnit({
  colour = "blue",
  size = 80,
  top = 0,
  left = 0,
  z = 2,
  glow = false,
}: {
  colour?: CubeColour;
  size?: number;
  top?: number;
  left?: number;
  z?: number;
  glow?: boolean;
}) {
  const c = CUBE_FACES[colour] ?? CUBE_FACES.blue;
  const half = size / 2;
  const glowShadow = glow
    ? `0 0 ${size * 0.35}px ${size * 0.09}px rgba(${CUBE_GLOW_RGB[colour] ?? CUBE_GLOW_RGB.blue},.55)`
    : "none";

  const face: CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    boxShadow: glowShadow,
  };

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        transformStyle: "preserve-3d",
        transform: "rotateX(-30deg) rotateY(-45deg)",
        zIndex: z,
      }}
    >
      <div
        style={{
          ...face,
          transform: `rotateX(90deg) translateZ(${half}px)`,
          background: `linear-gradient(135deg, ${c.top})`,
          borderRadius: size * 0.04,
        }}
      />
      <div
        style={{
          ...face,
          transform: `translateZ(${half}px)`,
          background: `linear-gradient(180deg, ${c.front})`,
        }}
      />
      <div
        style={{
          ...face,
          transform: `rotateY(90deg) translateZ(${half}px)`,
          background: `linear-gradient(180deg, ${c.right})`,
        }}
      />
    </div>
  );
}

function Platform({
  w,
  h,
  top,
  left,
}: {
  w: number;
  h: number;
  top: number;
  left: number;
}) {
  const topFaceOffset = -(w - h) / 2;
  const ringInset = Math.max(4, w * 0.045);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: w,
        height: h,
        transformStyle: "preserve-3d",
        transform: "rotateX(-30deg) rotateY(-45deg)",
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: topFaceOffset,
          left: 0,
          width: w,
          height: w,
          transform: `rotateX(90deg) translateZ(${h / 2}px)`,
          borderRadius: w * 0.18,
          background:
            "linear-gradient(155deg,#5a78e6 0%, #2c3fae 55%, #1c2a86 100%)",
          boxShadow: "0 0 0 1px rgba(255,255,255,.06) inset",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: ringInset,
            borderRadius: w * 0.15,
            border: `${Math.max(1.5, w * 0.013)}px solid rgba(210,225,255,.9)`,
            boxShadow: `0 0 ${w * 0.04}px ${w * 0.008}px rgba(160,190,255,.9), 0 0 ${w * 0.09}px ${w * 0.03}px rgba(150,120,255,.5)`,
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  );
}

function Cube4({
  colour = "blue",
  accentColour = "orange",
  size = 110,
  platform = true,
}: {
  colour?: CubeColour;
  accentColour?: CubeColour;
  size?: number;
  platform?: boolean;
}) {
  const r = size / 150;
  return (
    <div
      style={{
        position: "relative",
        width: 480 * r,
        height: 480 * r,
        perspective: 1400,
      }}
    >
      {platform && (
        <Platform w={380 * r} h={60 * r} top={300 * r} left={50 * r} />
      )}
      <CubeUnit colour={colour} size={150 * r} top={0} left={165 * r} z={2} />
      <CubeUnit
        colour={colour}
        size={150 * r}
        top={120 * r}
        left={35 * r}
        z={3}
      />
      <CubeUnit
        colour={colour}
        size={150 * r}
        top={120 * r}
        left={295 * r}
        z={3}
      />
      <CubeUnit
        colour={accentColour}
        size={150 * r}
        top={210 * r}
        left={165 * r}
        z={5}
        glow
      />
    </div>
  );
}
