"use client";

import {
  useState,
  useMemo,
  type ReactNode,
} from "react";
import {
  Box,
  Network,
  Search,
  Clock3,
  ChevronDown,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import EChart from "@/components/EChart";
import type { EChartsOption } from "echarts";

export type MockEntity = {
  id: string;
  name: string;
  kind:
    | "CLUSTER"
    | "NODE"
    | "POD"
    | "SERVICE"
    | "DATABASE"
    | "EXTERNAL";
  status:
    | "Safe"
    | "Anomalous"
    | "Affected"
    | "Root Cause"
    | "Unhealthy";
  namespace?: string;
  meta?: Record<string, string>;
};

export type MockEdge = {
  source: string;
  target: string;
};

const MOCK_ENTITIES: MockEntity[] = [
  {
    id: "cluster-1",
    name: "production-cluster",
    kind: "CLUSTER",
    status: "Unhealthy",
  },
  {
    id: "node-1",
    name: "worker-01",
    kind: "NODE",
    status: "Safe",
  },
  {
    id: "node-2",
    name: "worker-02",
    kind: "NODE",
    status: "Anomalous",
  },
  {
    id: "node-3",
    name: "worker-03",
    kind: "NODE",
    status: "Safe",
  },
  {
    id: "pod-1",
    name: "pymt-pod-9d3",
    kind: "POD",
    status: "Safe",
    namespace: "default",
    meta: {
      Node: "worker-01",
      Restarts: "0",
      Age: "2h 14m",
    },
  },
  {
    id: "pod-2",
    name: "pymt-pod-9c3a1",
    kind: "POD",
    status: "Anomalous",
    namespace: "default",
    meta: {
      Node: "worker-02",
      Restarts: "4",
      Age: "2h 14m",
    },
  },
  {
    id: "pod-3",
    name: "user-pod-b23d5",
    kind: "POD",
    status: "Safe",
    namespace: "default",
    meta: {
      Node: "worker-03",
      Restarts: "0",
      Age: "5h 02m",
    },
  },
  {
    id: "pod-4",
    name: "service-pod",
    kind: "POD",
    status: "Affected",
    namespace: "default",
    meta: {
      Node: "worker-02",
      Restarts: "2",
      Age: "1h 30m",
    },
  },
  {
    id: "svc-1",
    name: "pymt-svc",
    kind: "SERVICE",
    status: "Anomalous",
    namespace: "app-order",
    meta: {
      Type: "ClusterIP",
      "Cluster IP": "10.20.0.5",
      Port: "80/TCP,443/TCP",
      Selector: "app-order",
    },
  },
  {
    id: "svc-2",
    name: "order-svc",
    kind: "SERVICE",
    status: "Affected",
    namespace: "app-order",
    meta: {
      Type: "ClusterIP",
      "Cluster IP": "10.20.0.8",
      Port: "80/TCP",
      Selector: "app-order",
    },
  },
  {
    id: "svc-3",
    name: "user-svc",
    kind: "SERVICE",
    status: "Safe",
    namespace: "app-user",
    meta: {
      Type: "ClusterIP",
      "Cluster IP": "10.20.0.12",
      Port: "80/TCP",
      Selector: "app-user",
    },
  },
  {
    id: "svc-4",
    name: "notification-svc",
    kind: "SERVICE",
    status: "Safe",
    namespace: "app-order",
    meta: {
      Type: "ClusterIP",
      "Cluster IP": "10.20.0.15",
      Port: "80/TCP",
      Selector: "app-notify",
    },
  },
  {
    id: "db-1",
    name: "pymt-db",
    kind: "DATABASE",
    status: "Anomalous",
  },
  {
    id: "db-2",
    name: "order-db",
    kind: "DATABASE",
    status: "Affected",
  },
  {
    id: "db-3",
    name: "user-db",
    kind: "DATABASE",
    status: "Safe",
  },
  {
    id: "ext-1",
    name: "banking-api",
    kind: "EXTERNAL",
    status: "Root Cause",
  },
];

const MOCK_EDGES: MockEdge[] = [
  {
    source: "cluster-1",
    target: "node-1",
  },
  {
    source: "cluster-1",
    target: "node-2",
  },
  {
    source: "cluster-1",
    target: "node-3",
  },
  {
    source: "node-1",
    target: "pod-1",
  },
  {
    source: "node-2",
    target: "pod-2",
  },
  {
    source: "node-3",
    target: "pod-3",
  },
  {
    source: "node-2",
    target: "pod-4",
  },
  {
    source: "pod-1",
    target: "svc-1",
  },
  {
    source: "pod-2",
    target: "svc-1",
  },
  {
    source: "pod-2",
    target: "svc-2",
  },
  {
    source: "pod-3",
    target: "svc-3",
  },
  {
    source: "svc-1",
    target: "db-1",
  },
  {
    source: "svc-2",
    target: "db-2",
  },
  {
    source: "svc-3",
    target: "db-3",
  },
  {
    source: "svc-1",
    target: "svc-2",
  },
  {
    source: "svc-2",
    target: "svc-3",
  },
  {
    source: "ext-1",
    target: "svc-1",
  },
];

const MOCK_SERVICES = MOCK_ENTITIES.filter(
  (entity) => entity.kind === "SERVICE",
);

const MOCK_PODS = MOCK_ENTITIES.filter(
  (entity) => entity.kind === "POD",
);

const MOCK_NODES = MOCK_ENTITIES.filter(
  (entity) => entity.kind === "NODE",
);

const MOCK_ENDPOINTS = [
  {
    ip: "10.20.2.8",
    node: "worker-01",
    status: "Safe",
  },
  {
    ip: "10.20.22.110",
    node: "worker-02",
    status: "Affected",
  },
  {
    ip: "10.20.22.115",
    node: "worker-03",
    status: "Safe",
  },
];

const MOCK_POD_DEPENDENCIES = {
  "pod-2": {
    dependsOn: [
      {
        from: "pymt-svc",
        to: "order-svc",
        fromStatus: "Anomalous",
        toStatus: "Affected",
      },
    ],
    usedBy: [
      {
        from: "pymt-deploy",
        to: "pymt-svc",
        fromStatus: "Safe",
        toStatus: "Anomalous",
      },
    ],
  },
};

const MOCK_RELATED_SERVICES = [
  {
    name: "pymt-svc",
    status: "Critical",
  },
  {
    name: "order-svc",
    status: "Affected",
  },
  {
    name: "user-svc",
    status: "Safe",
  },
];

function statusBorderBg(status: string) {
  switch (status) {
    case "Safe":
      return "border-slate-300 bg-white";
    case "Anomalous":
      return "border-red-400 bg-red-50";
    case "Affected":
      return "border-orange-400 bg-orange-50";
    case "Root Cause":
      return "border-red-500 bg-red-50";
    case "Unhealthy":
      return "border-slate-300 bg-white";
    default:
      return "border-slate-300 bg-white";
  }
}

function statusTextColor(status: string) {
  switch (status) {
    case "Safe":
      return "text-slate-600";
    case "Anomalous":
      return "text-red-600";
    case "Affected":
      return "text-orange-600";
    case "Root Cause":
      return "text-red-600";
    case "Unhealthy":
      return "text-red-500";
    default:
      return "text-slate-600";
  }
}

function statusDot(status: string) {
  switch (status) {
    case "Safe":
      return "bg-slate-400";
    case "Anomalous":
      return "bg-red-500";
    case "Affected":
      return "bg-orange-500";
    case "Root Cause":
      return "bg-red-600";
    case "Critical":
      return "bg-red-500";
    default:
      return "bg-slate-300";
  }
}

function statusDotColor(status: string) {
  switch (status) {
    case "Safe":
      return "text-slate-400";
    case "Affected":
      return "text-orange-500";
    case "Critical":
      return "text-red-500";
    default:
      return "text-slate-400";
  }
}

function HealthDonut() {
  const anomalous = 18;
  const suspected = 18;
  const affected = 34;
  const safe = 198;

  const option: EChartsOption = {
    animation: false,
    series: [
      {
        type: "pie",
        radius: ["54%", "82%"],
        startAngle: 90,
        data: [
          {
            value: anomalous,
            itemStyle: {
              color: "#dc2626",
            },
          },
          {
            value: suspected,
            itemStyle: {
              color: "#9333ea",
            },
          },
          {
            value: affected,
            itemStyle: {
              color: "#ea580c",
            },
          },
          {
            value: safe,
            itemStyle: {
              color: "#cbd5e1",
            },
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
    <div className="flex items-center gap-3">
      <div className="h-[96px] w-[96px] shrink-0">
        <EChart
          option={option}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        {[
          ["bg-red-600", "Anomalous", anomalous],
          ["bg-purple-600", "Suspected", suspected],
          ["bg-orange-600", "Affected", affected],
          ["bg-slate-300", "Safe", safe],
        ].map(([dot, label, value]) => (
          <div
            key={String(label)}
            className="flex items-center gap-1.5 text-[11px]"
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${dot}`}
            />

            <span className="truncate text-slate-600">
              {label}
            </span>

            <span className="ml-auto font-semibold text-slate-800">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DependenciesLegend() {
  return (
    <div className="rounded-[18px] border border-white/70 bg-white/45 p-4 shadow-[0_10px_35px_rgba(65,84,130,0.10)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/40">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">
        Dependencies
      </h3>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <DepItem
          icon={
            <NodeIcon
              textColor="text-slate-500"
            />
          }
          label="Safe"
          sub="Normal Operations"
        />

        <DepItem
          icon={
            <NodeIcon
              textColor="text-red-500"
              status="Anomalous"
            />
          }
          label="Anomalous"
          sub="Critical issues"
        />

        <DepItem
          icon={
            <NodeIcon
              textColor="text-orange-500"
              status="Affected"
            />
          }
          label="Affected"
          sub="Experiencing issues"
        />

        <DepItem
          icon={
            <NodeIcon
              textColor="text-red-500"
              status="Root Cause"
              rootCause
            />
          }
          label="Root Cause"
          sub="Suspected root cause"
        />

        <DepItem
          icon={
            <LegendLine type="dashed" />
          }
          label="Data Flow"
        />

        <DepItem
          icon={
            <LegendLine
              type="dashed"
              problematic
            />
          }
          label="Problematic Path"
        />

        <DepItem
          icon={
            <LegendLine type="solid" />
          }
          label="Dependency"
        />
      </div>
    </div>
  );
}

function NodeIcon({
  textColor,
  rootCause,
}: {
  textColor: string;
  status?: string;
  rootCause?: boolean;
}) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center">
      {rootCause ? (
        <Network
          className={`h-[18px] w-[18px] ${textColor}`}
          strokeWidth={1.8}
        />
      ) : (
        <Box
          className={`h-[20px] w-[20px] ${textColor}`}
          strokeWidth={1.8}
        />
      )}
    </span>
  );
}

function LegendLine({
  type,
  problematic = false,
}: {
  type: "solid" | "dashed";
  problematic?: boolean;
}) {
  return (
    <span className="flex h-7 w-9 shrink-0 items-center justify-center">
      <span
        className={`block w-9 border-t-2 ${
          type === "dashed"
            ? "border-dashed"
            : "border-solid"
        } ${
          problematic
            ? "border-red-400"
            : "border-slate-400"
        }`}
      />
    </span>
  );
}

function DepItem({
  icon,
  label,
  sub,
}: {
  icon: ReactNode;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-7 w-9 shrink-0 items-center justify-center">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="whitespace-nowrap text-[11px] font-medium leading-[14px] text-slate-700">
          {label}
        </p>

        {sub && (
          <p className="whitespace-nowrap text-[9px] leading-[12px] text-slate-400">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

const ROW_KINDS = [
  "CLUSTER",
  "NODE",
  "POD",
  "SERVICE",
  "DATABASE",
  "EXTERNAL",
] as const;

type RowKind = (typeof ROW_KINDS)[number];

const ROW_LABELS: Record<RowKind, string> = {
  CLUSTER: "CLUSTER",
  NODE: "NODES",
  POD: "PODS",
  SERVICE: "SERVICES",
  DATABASE: "DATABASES",
  EXTERNAL: "EXTERNAL SERVICES",
};

const TOPOLOGY_VISIBLE_IDS = new Set([
  "cluster-1",
  "node-1",
  "node-2",
  "node-3",
  "pod-1",
  "pod-2",
  "pod-3",
  "svc-1",
  "svc-2",
  "svc-3",
  "db-1",
  "db-2",
  "db-3",
  "ext-1",
]);

function buildLayout(entities: MockEntity[]) {
  const byRow = new Map<RowKind, MockEntity[]>();

  for (const kind of ROW_KINDS) {
    byRow.set(kind, []);
  }

  for (const entity of entities) {
    byRow
      .get(entity.kind as RowKind)
      ?.push(entity);
  }

  const ROW_H = 72;
  const COL_W = 175;
  const CANVAS_W = 980;
  const TOP_OFFSET = 42;

  const positions = new Map<
    string,
    {
      x: number;
      y: number;
    }
  >();

  ROW_KINDS.forEach((kind, rowIdx) => {
    const items = byRow.get(kind) ?? [];

    const totalW = items.length * COL_W;

    const startX =
      (CANVAS_W - totalW) / 2 +
      COL_W / 2;

    items.forEach((entity, col) => {
      positions.set(entity.id, {
        x: startX + col * COL_W,
        y: TOP_OFFSET + rowIdx * ROW_H,
      });
    });
  });

  const canvasH =
    TOP_OFFSET +
    ROW_KINDS.length * ROW_H +
    30;

  return {
    positions,
    canvasH,
    CANVAS_W,
  };
}

function TopoGraph({
  entities,
  edges,
  selected,
  onSelect,
}: {
  entities: MockEntity[];
  edges: MockEdge[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const visibleEntities = useMemo(
    () =>
      entities.filter((entity) =>
        TOPOLOGY_VISIBLE_IDS.has(entity.id),
      ),
    [entities],
  );

  const visibleIds = useMemo(
    () =>
      new Set(
        visibleEntities.map(
          (entity) => entity.id,
        ),
      ),
    [visibleEntities],
  );

  const visibleEdges = useMemo(
    () =>
      edges.filter(
        (edge) =>
          visibleIds.has(edge.source) &&
          visibleIds.has(edge.target),
      ),
    [edges, visibleIds],
  );

  const {
    positions,
    canvasH,
    CANVAS_W,
  } = buildLayout(
    visibleEntities,
  );

  const related = useMemo(() => {
    if (!selected) {
      return new Set<string>();
    }

    const result = new Set<string>();

    for (const edge of visibleEdges) {
      if (edge.source === selected) {
        result.add(edge.target);
      }

      if (edge.target === selected) {
        result.add(edge.source);
      }
    }

    return result;
  }, [selected, visibleEdges]);

  function getEntity(id: string) {
    return visibleEntities.find(
      (entity) => entity.id === id,
    );
  }

  function edgeColor(
    source: string,
    target: string,
  ) {
    const sourceEntity = getEntity(
      source,
    );

    const targetEntity = getEntity(
      target,
    );

    if (
      sourceEntity?.status === "Anomalous" ||
      targetEntity?.status === "Anomalous" ||
      sourceEntity?.status === "Root Cause" ||
      targetEntity?.status === "Root Cause"
    ) {
      return "#ff3030";
    }

    if (
      sourceEntity?.status === "Affected" ||
      targetEntity?.status === "Affected"
    ) {
      return "#f97316";
    }

    return "#aeb7c5";
  }

  function edgeDash(
    source: string,
    target: string,
  ) {
    const sourceEntity = getEntity(
      source,
    );

    const targetEntity = getEntity(
      target,
    );

    if (
      sourceEntity?.status === "Anomalous" ||
      targetEntity?.status === "Anomalous" ||
      sourceEntity?.status === "Root Cause" ||
      targetEntity?.status === "Root Cause" ||
      sourceEntity?.status === "Affected" ||
      targetEntity?.status === "Affected"
    ) {
      return "7 5";
    }

    return undefined;
  }

  return (
    <div className="relative h-[474px] overflow-hidden bg-[linear-gradient(180deg,#F8F9FC_0%,#EEF2FA_50%,#E7ECF8_100%)]">
      <div
        className="absolute left-1/2 top-0 origin-top-left"
        style={{
          width: CANVAS_W,
          height: canvasH,
          transform: "translateX(-50%)",
        }}
      >
        <svg
          className="pointer-events-none absolute inset-0"
          width={CANVAS_W}
          height={canvasH}
        >
          <defs>
            <marker
              id="topo-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path
                d="M 1 1 L 8 5 L 1 9"
                fill="none"
                stroke="context-stroke"
                strokeWidth="1.5"
              />
            </marker>
          </defs>

          {visibleEdges.map((edge) => {
            const source = positions.get(
              edge.source,
            );

            const target = positions.get(
              edge.target,
            );

            if (!source || !target) {
              return null;
            }

            const sourceEntity =
              getEntity(edge.source);

            const targetEntity =
              getEntity(edge.target);

            const color = edgeColor(
              edge.source,
              edge.target,
            );

            const dash = edgeDash(
              edge.source,
              edge.target,
            );

            const isVertical =
              Math.abs(
                source.x - target.x,
              ) < 2;

            const middleY =
              (source.y + target.y) / 2;

            let path = "";

            if (isVertical) {
              path = `M ${source.x} ${
                source.y + 23
              } L ${target.x} ${
                target.y - 23
              }`;
            } else if (
              source.y < target.y
            ) {
              path = `M ${source.x} ${
                source.y + 23
              } C ${
                source.x
              } ${middleY}, ${
                target.x
              } ${middleY}, ${
                target.x
              } ${
                target.y - 23
              }`;
            } else {
              path = `M ${source.x} ${
                source.y - 23
              } C ${
                source.x
              } ${middleY}, ${
                target.x
              } ${middleY}, ${
                target.x
              } ${
                target.y + 23
              }`;
            }

            const isProblem =
              sourceEntity?.status ===
                "Anomalous" ||
              targetEntity?.status ===
                "Anomalous" ||
              sourceEntity?.status ===
                "Affected" ||
              targetEntity?.status ===
                "Affected" ||
              sourceEntity?.status ===
                "Root Cause" ||
              targetEntity?.status ===
                "Root Cause";

            const active =
              !selected ||
              edge.source === selected ||
              edge.target === selected ||
              related.has(edge.source) ||
              related.has(edge.target);

            return (
              <path
                key={`${edge.source}-${edge.target}`}
                d={path}
                stroke={color}
                strokeDasharray={dash}
                strokeWidth={
                  isProblem ? 1.8 : 1.3
                }
                opacity={
                  selected && !active
                    ? 0.12
                    : 0.9
                }
                fill="none"
                markerEnd="url(#topo-arrow)"
              />
            );
          })}
        </svg>

        {visibleEntities.map((entity) => {
          const position =
            positions.get(entity.id);

          if (!position) {
            return null;
          }

          const isSelected =
            selected === entity.id;

          const isRelated =
            related.has(entity.id);

          const dimmed =
            selected &&
            !isSelected &&
            !isRelated;

          return (
            <button
              key={entity.id}
              type="button"
              onClick={() =>
                onSelect(
                  isSelected
                    ? null
                    : entity.id,
                )
              }
              style={{
                left: position.x - 80,
                top: position.y - 23,
                width: 160,
                height: 46,
              }}
              className={`absolute rounded-[11px] border px-2.5 py-2 text-left shadow-[0_4px_12px_rgba(60,72,96,0.10)] transition-all duration-150 ${statusBorderBg(
                entity.status,
              )} ${
                entity.kind === "CLUSTER"
                  ? "border-dashed border-slate-400"
                  : ""
              } ${
                isSelected
                  ? "ring-2 ring-blue-300"
                  : ""
              } ${
                isRelated && !isSelected
                  ? "ring-1 ring-blue-200"
                  : ""
              } ${
                dimmed
                  ? "opacity-25"
                  : "opacity-100"
              } hover:shadow-[0_6px_15px_rgba(60,72,96,0.14)]`}
            >
              <div className="flex h-full items-center gap-2">
                <EntityIcon
                  kind={entity.kind}
                  status={entity.status}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold leading-tight tracking-[-0.01em] text-slate-900">
                    {entity.name}
                  </p>

                  <p
                    className={`mt-1 text-[9px] font-normal leading-none ${statusTextColor(
                      entity.status,
                    )}`}
                  >
                    {entity.status}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EntityIcon({
  kind,
  status,
}: {
  kind: string;
  status: string;
}) {
  const color =
    status === "Anomalous" ||
    status === "Root Cause"
      ? "#ff1f2d"
      : status === "Affected"
        ? "#f97300"
        : "#111827";

  if (kind === "DATABASE") {
    return (
      <svg
        className="h-[22px] w-[22px] shrink-0"
        viewBox="0 0 32 32"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      >
        <ellipse
          cx="16"
          cy="7"
          rx="10"
          ry="4"
        />

        <path d="M6 7v15c0 2.2 4.5 4 10 4s10-1.8 10-4V7" />

        <path d="M6 14c0 2.2 4.5 4 10 4s10-1.8 10-4" />

        <path d="M6 21c0 2.2 4.5 4 10 4s10-1.8 10-4" />
      </svg>
    );
  }

  if (kind === "EXTERNAL") {
    return (
      <Network
        className="h-[22px] w-[22px] shrink-0"
        strokeWidth={1.8}
        color={color}
      />
    );
  }

  return (
    <Box
      className="h-[23px] w-[23px] shrink-0"
      strokeWidth={1.8}
      color={color}
    />
  );
}

function TopologyPanel({
  entities,
  edges,
  selected,
  onSelect,
}: {
  entities: MockEntity[];
  edges: MockEdge[];
  selected: string | null;
  onSelect: (
    id: string | null,
  ) => void;
}) {
  const ROW_H = 72;

  return (
    <div className="overflow-hidden rounded-[22px] border border-white/80 bg-[linear-gradient(180deg,#F8F9FC_0%,#EEF2FA_52%,#E6EBF8_100%)] shadow-[0_12px_40px_rgba(65,84,130,0.12)]">
      <div className="flex h-[60px] items-center justify-end gap-2 border-white/50 bg-white/25 px-4 backdrop-blur-xl">
        <button
          type="button"
          className="rounded-[9px] border border-blue-300 bg-white/60 px-2.5 py-1.5 text-[10px] font-medium text-blue-600 shadow-[0_4px_12px_rgba(65,84,130,0.06)] backdrop-blur-xl transition hover:bg-white/80 sm:text-[11px]"
        >
          + Add Database
        </button>

        <button
          type="button"
          className="rounded-[9px] border border-blue-300 bg-white/60 px-2.5 py-1.5 text-[10px] font-medium text-blue-600 shadow-[0_4px_12px_rgba(65,84,130,0.06)] backdrop-blur-xl transition hover:bg-white/80 sm:text-[11px]"
        >
          + Add Cluster
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-[9px] border border-slate-300 bg-white/65 px-2.5 py-1.5 text-[10px] font-medium text-slate-600 shadow-[0_4px_12px_rgba(65,84,130,0.06)] backdrop-blur-xl transition hover:bg-white/80 sm:text-[11px]"
        >
          <Clock3 className="h-3 w-3" />

          Last 15 minutes

          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="flex">
        <div className="relative z-10 hidden w-[150px] shrink-0 flex-col bg-transparent sm:flex lg:w-[185px]">
          {ROW_KINDS.map((kind) => (
            <div
              key={kind}
              className="mt-2 flex items-center justify-start bg-transparent pl-7 text-left text-[12px] font-medium uppercase tracking-[0.11em] text-slate-900 lg:pl-8"
              style={{
                height:
                  kind === "CLUSTER"
                    ? 42
                    : ROW_H,
              }}
            >
              {ROW_LABELS[kind]}
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <TopoGraph
            entities={entities}
            edges={edges}
            selected={selected}
            onSelect={onSelect}
          />
        </div>
      </div>
    </div>
  );
}

function Sparkline({
  color,
}: {
  color: string;
}) {
  const data = [
    30,
    45,
    28,
    55,
    40,
    62,
    48,
    70,
    55,
    80,
  ];

  const option: EChartsOption = {
    animation: false,
    grid: {
      top: 2,
      right: 2,
      bottom: 2,
      left: 2,
    },
    xAxis: {
      type: "category",
      show: false,
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        type: "line",
        data,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color,
          width: 1.5,
        },
        areaStyle: {
          color,
          opacity: 0.15,
        },
      },
    ],
  };

  return (
    <EChart
      option={option}
      style={{
        width: "100%",
        height: 32,
      }}
    />
  );
}

type DetailTab =
  | "Clusters"
  | "Nodes"
  | "Pods"
  | "Services";

function DetailPanel({
  selected,
}: {
  selected: string | null;
}) {
  const [activeTab, setActiveTab] =
    useState<DetailTab>("Services");

  const [searchQ, setSearchQ] =
    useState("");

  const [selectedSvc, setSelectedSvc] =
    useState<MockEntity>(
      MOCK_SERVICES.find(
        (item) => item.id === "svc-2",
      ) ?? MOCK_SERVICES[0],
    );

  const [selectedPod, setSelectedPod] =
    useState<MockEntity>(
      MOCK_PODS[1],
    );

  const selectedEntity =
    selected
      ? MOCK_ENTITIES.find(
          (entity) =>
            entity.id === selected,
        )
      : null;

  const tabItems: Record<
    DetailTab,
    MockEntity[]
  > = useMemo(
    () => ({
      Clusters:
        MOCK_ENTITIES.filter(
          (entity) =>
            entity.kind === "CLUSTER",
        ),
      Nodes: MOCK_NODES,
      Pods: MOCK_PODS,
      Services: MOCK_SERVICES,
    }),
    [],
  );

  const filteredList =
    useMemo(() => {
      const items =
        tabItems[activeTab];

      if (!searchQ.trim()) {
        return items;
      }

      return items.filter(
        (entity) =>
          entity.name
            .toLowerCase()
            .includes(
              searchQ.toLowerCase(),
            ),
      );
    }, [
      activeTab,
      searchQ,
      tabItems,
    ]);

  const tabs: DetailTab[] = [
    "Clusters",
    "Nodes",
    "Pods",
    "Services",
  ];

  return (
    <div className="overflow-hidden rounded-[22px] border border-white/80 bg-[#edf2fc]/90 shadow-[0_12px_35px_rgba(65,84,130,0.10)]">
      <div className="flex h-[58px] items-end gap-1 overflow-x-auto border-b border-white/80 px-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() =>
              setActiveTab(tab)
            }
            className={`relative flex h-full shrink-0 items-center px-5 pt-1 text-[13px] font-medium transition ${
              activeTab === tab
                ? "text-blue-600"
                : "text-slate-800 hover:text-blue-500"
            }`}
          >
            {tab}

            {activeTab === tab && (
              <span className="absolute bottom-0 left-1/2 h-[3px] w-[72px] -translate-x-1/2 rounded-t-full bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[300px_minmax(0,1.55fr)_minmax(0,1.8fr)]">
        <div className="min-w-0 rounded-[16px] bg-white/90 p-3 shadow-[0_4px_15px_rgba(65,84,130,0.06)]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[15px] font-semibold text-slate-900">
              {activeTab}

              {activeTab ===
                "Services" && (
                <span className="ml-1 font-normal text-slate-400">
                  (32)
                </span>
              )}

              {activeTab !==
                "Services" && (
                <span className="ml-1 font-normal text-slate-400">
                  ({filteredList.length})
                </span>
              )}
            </p>
          </div>

          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />

            <input
              type="text"
              value={searchQ}
              onChange={(event) =>
                setSearchQ(
                  event.target.value,
                )
              }
              placeholder={
                activeTab ===
                "Services"
                  ? "Search pods..."
                  : "Search..."
              }
              className="h-[30px] w-full rounded-[7px] border border-slate-300 bg-white px-2 pl-8 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>

          <div className="overflow-hidden rounded-[7px] border border-slate-200 bg-white">
            <div className="max-h-[176px] overflow-y-auto">
              {filteredList.map(
                (item) => {
                  const active =
                    (activeTab ===
                      "Services" &&
                      selectedSvc.id ===
                        item.id) ||
                    (activeTab ===
                      "Pods" &&
                      selectedPod.id ===
                        item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (
                          activeTab ===
                          "Services"
                        ) {
                          setSelectedSvc(
                            item,
                          );
                        }

                        if (
                          activeTab ===
                          "Pods"
                        ) {
                          setSelectedPod(
                            item,
                          );
                        }
                      }}
                      className={`flex h-[28px] w-full items-center gap-2 border-b border-slate-100 px-3 text-left last:border-b-0 ${
                        active
                          ? "bg-[#e9effc]"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot(
                          item.status,
                        )}`}
                      />

                      <span className="truncate text-[11px] font-medium text-slate-700">
                        {item.name}
                      </span>
                    </button>
                  );
                },
              )}

              {activeTab ===
                "Services" && (
                <div className="flex h-[27px] items-center border-t border-slate-100 px-3 text-[10px] font-medium text-slate-700">
                  + 27 more
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-[16px] bg-white/90 p-3 shadow-[0_4px_15px_rgba(65,84,130,0.06)]">
          {activeTab ===
            "Services" && (
            <ServiceDetail
              svc={selectedSvc}
            />
          )}

          {activeTab ===
            "Pods" && (
            <PodDetail
              pod={selectedPod}
            />
          )}

          {activeTab ===
            "Nodes" && (
            <NodeDetail />
          )}

          {activeTab ===
            "Clusters" && (
            <ClusterDetail
              entity={
                selectedEntity
              }
            />
          )}
        </div>

        <div className="min-w-0 rounded-[16px] bg-white/90 p-3 shadow-[0_4px_15px_rgba(65,84,130,0.06)]">
          {activeTab ===
            "Services" && (
            <EndpointsPanel />
          )}

          {activeTab ===
            "Pods" && (
            <PodDependencies
              podId={
                selectedPod.id
              }
            />
          )}

          {activeTab ===
            "Nodes" && (
            <EndpointsPanel />
          )}

          {activeTab ===
            "Clusters" && (
            <EndpointsPanel />
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceDetail({
  svc,
}: {
  svc: MockEntity;
}) {
  const [metricTab, setMetricTab] =
    useState<
      | "Metrics"
      | "Logs"
      | "Events"
      | "YAML"
    >("Metrics");

  return (
    <div>
      <div className="mb-3 flex items-center gap-1.5">
        <span
          className={`h-2 w-2 rounded-full ${statusDot(
            svc.status,
          )}`}
        />

        <p className="text-xs font-semibold text-slate-700">
          {svc.name}
        </p>
      </div>

      {svc.meta && (
        <div className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
          {Object.entries(
            svc.meta,
          ).map(
            ([key, value]) => (
              <div
                key={key}
                className="min-w-0"
              >
                <p className="text-slate-400">
                  {key}
                </p>

                <p className="truncate font-medium text-slate-700">
                  {value}
                </p>
              </div>
            ),
          )}
        </div>
      )}

      <div className="mb-2 flex gap-3">
        {[
          "Metrics",
          "Logs",
          "Events",
          "YAML",
        ].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() =>
              setMetricTab(
                tab as
                  | "Metrics"
                  | "Logs"
                  | "Events"
                  | "YAML",
              )
            }
            className={`border-b pb-0.5 text-[10px] font-semibold ${
              metricTab === tab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {metricTab ===
        "Metrics" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricSparkCard
            label="Request/sec"
            value="1.2k"
            delta="+13%"
            up
            color="#3b82f6"
          />

          <MetricSparkCard
            label="Error Rate"
            value="0.3%"
            delta="-44%"
            up={false}
            color="#ef4444"
          />

          <MetricSparkCard
            label="Latency"
            value="42ms"
            delta="+26%"
            up
            color="#10b981"
          />
        </div>
      )}
    </div>
  );
}

function MetricSparkCard({
  label,
  value,
  delta,
  up,
  color,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  color: string;
}) {
  return (
    <div>
      <p className="mb-0.5 text-[10px] text-slate-400">
        {label}
      </p>

      <p className="font-bold text-slate-800">
        {value}
      </p>

      <p
        className={`text-[9px] ${
          up
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {up ? "▲" : "▼"} {delta}
      </p>

      <Sparkline color={color} />
    </div>
  );
}

function PodDetail({
  pod,
}: {
  pod: MockEntity;
}) {
  const [metricTab, setMetricTab] =
    useState<
      | "Metrics"
      | "Logs"
      | "Events"
      | "YAML"
    >("Metrics");

  return (
    <div>
      <div className="mb-3 flex items-center gap-1.5">
        <span
          className={`h-2 w-2 rounded-full ${statusDot(
            pod.status,
          )}`}
        />

        <p className="text-xs font-semibold text-slate-700">
          {pod.name}
        </p>
      </div>

      {pod.meta && (
        <div className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
          {Object.entries(
            pod.meta,
          ).map(
            ([key, value]) => (
              <div key={key}>
                <p className="text-slate-400">
                  {key}
                </p>

                <p className="font-medium text-slate-700">
                  {value}
                </p>
              </div>
            ),
          )}
        </div>
      )}

      <div className="mb-2 flex gap-3">
        {[
          "Metrics",
          "Logs",
          "Events",
          "YAML",
        ].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() =>
              setMetricTab(
                tab as
                  | "Metrics"
                  | "Logs"
                  | "Events"
                  | "YAML",
              )
            }
            className={`border-b pb-0.5 text-[10px] font-semibold ${
              metricTab === tab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {metricTab ===
        "Metrics" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-0.5 text-[10px] text-slate-400">
              CPU Usage
            </p>

            <p className="text-base font-bold text-slate-800">
              89%
            </p>

            <Sparkline color="#ef4444" />
          </div>

          <div>
            <p className="mb-0.5 text-[10px] text-slate-400">
              Memory Usage
            </p>

            <p className="text-base font-bold text-slate-800">
              87%
            </p>

            <Sparkline color="#ef4444" />
          </div>
        </div>
      )}
    </div>
  );
}

function NodeDetail() {
  return (
    <div className="space-y-2 text-xs">
      <p className="mb-2 font-semibold text-slate-700">
        Node Summary
      </p>

      {MOCK_NODES.map((node) => (
        <div
          key={node.id}
          className="flex items-center gap-2 border-b border-slate-50 py-1.5"
        >
          <span
            className={`h-2 w-2 rounded-full ${statusDot(
              node.status,
            )}`}
          />

          <span className="font-medium text-slate-700">
            {node.name}
          </span>

          <span
            className={`ml-auto text-[10px] ${statusTextColor(
              node.status,
            )}`}
          >
            {node.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function ClusterDetail({
  entity,
}: {
  entity:
    | MockEntity
    | null
    | undefined;
}) {
  return (
    <div className="space-y-2 text-xs">
      <p className="mb-2 font-semibold text-slate-700">
        Cluster Info
      </p>

      {[
        [
          "Name",
          entity?.name ??
            "production-cluster",
        ],
        ["Status", "Unhealthy"],
        ["Nodes", "3"],
        ["Pods", "4"],
        ["Services", "4"],
        [
          "Region",
          "ap-southeast-1",
        ],
      ].map(
        ([key, value]) => (
          <div
            key={key}
            className="grid grid-cols-[70px_1fr] gap-2"
          >
            <span className="text-slate-400">
              {key}
            </span>

            <span className="truncate font-medium text-slate-700">
              {value}
            </span>
          </div>
        ),
      )}
    </div>
  );
}

function EndpointsPanel() {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold text-slate-700">
        End Points
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] text-xs">
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-slate-400">
              <th className="pb-1.5 text-left font-medium">
                IP
              </th>

              <th className="pb-1.5 text-left font-medium">
                Node
              </th>

              <th className="pb-1.5 text-left font-medium">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/60">
            {MOCK_ENDPOINTS.map(
              (endpoint) => (
                <tr
                  key={
                    endpoint.ip
                  }
                >
                  <td className="py-1.5 text-slate-500">
                    {endpoint.ip}
                  </td>

                  <td className="py-1.5 font-medium text-slate-700">
                    {endpoint.node}
                  </td>

                  <td className="py-1.5">
                    <span
                      className={`flex items-center gap-1 text-[10px] font-medium ${
                        endpoint.status ===
                        "Affected"
                          ? "text-orange-500"
                          : "text-slate-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusDot(
                          endpoint.status,
                        )}`}
                      />

                      {endpoint.status}
                    </span>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PodDependencies({
  podId,
}: {
  podId: string;
}) {
  const deps =
    MOCK_POD_DEPENDENCIES[
      podId as keyof typeof MOCK_POD_DEPENDENCIES
    ];

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-700">
          Pod Dependencies
        </p>

        {deps ? (
          deps.dependsOn.map(
            (
              dependency,
              index,
            ) => (
              <div
                key={index}
                className="mb-1 flex items-center gap-1.5 rounded-lg border border-white/60 bg-white/35 px-2 py-1.5 text-[10px] backdrop-blur-md"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${statusBorderBg(
                    dependency.fromStatus,
                  )}`}
                >
                  <Box
                    className={`h-2.5 w-2.5 ${statusTextColor(
                      dependency.fromStatus,
                    )}`}
                  />
                </span>

                <span className="font-medium text-slate-600">
                  {dependency.from}
                </span>

                <span className="text-slate-300">
                  →
                </span>

                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${statusBorderBg(
                    dependency.toStatus,
                  )}`}
                >
                  <Box
                    className={`h-2.5 w-2.5 ${statusTextColor(
                      dependency.toStatus,
                    )}`}
                  />
                </span>

                <span className="font-medium text-slate-600">
                  {dependency.to}
                </span>
              </div>
            ),
          )
        ) : (
          <p className="text-[10px] text-slate-400">
            No dependencies
            found
          </p>
        )}
      </div>

      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Used by
        </p>

        {deps?.usedBy.map(
          (
            dependency,
            index,
          ) => (
            <div
              key={index}
              className="mb-1 flex items-center gap-1.5 rounded-lg border border-white/60 bg-white/35 px-2 py-1.5 text-[10px] backdrop-blur-md"
            >
              <span className="font-medium text-slate-600">
                {dependency.from}
              </span>

              <span className="text-slate-300">
                →
              </span>

              <span className="font-medium text-slate-600">
                {dependency.to}
              </span>
            </div>
          ),
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-slate-700">
          Related Services
        </p>

        {MOCK_RELATED_SERVICES.map(
          (service) => (
            <div
              key={
                service.name
              }
              className="flex items-center gap-2 py-1"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  service.status ===
                  "Critical"
                    ? "border-red-300 bg-red-50"
                    : service.status ===
                        "Affected"
                      ? "border-orange-300 bg-orange-50"
                      : "border-slate-200 bg-white"
                }`}
              >
                <Box
                  className={`h-2.5 w-2.5 ${
                    service.status ===
                    "Critical"
                      ? "text-red-500"
                      : service.status ===
                          "Affected"
                        ? "text-orange-500"
                        : "text-slate-400"
                  }`}
                />
              </span>

              <span className="flex-1 truncate text-xs text-slate-700">
                {service.name}
              </span>

              <span
                className={`flex shrink-0 items-center gap-1 text-[10px] font-medium ${statusDotColor(
                  service.status,
                )}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${statusDot(
                    service.status,
                  )}`}
                />

                {service.status}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function HowToUse() {
  return (
    <div className="rounded-[18px] border border-white/70 bg-white/45 p-4 shadow-[0_10px_35px_rgba(65,84,130,0.10)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/40">
      <h3 className="mb-2 text-sm font-semibold text-slate-800">
        How to Use
      </h3>

      <div className="flex items-center justify-between gap-4">
        <p className="max-w-[180px] text-[11px] leading-relaxed text-slate-500">
          Click on any
          components to focus
          and see the related
          dependency path
        </p>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 text-slate-500">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M8.5 11.5V6.2a1.7 1.7 0 0 1 3.4 0v4.2"
              strokeLinecap="round"
            />

            <path
              d="M11.9 10V5.2a1.7 1.7 0 0 1 3.4 0v5.4"
              strokeLinecap="round"
            />

            <path
              d="M15.3 10.5V7.2a1.7 1.7 0 0 1 3.4 0v6.1"
              strokeLinecap="round"
            />

            <path
              d="M8.5 10.5V9a1.7 1.7 0 0 0-3.4 0v4.8c0 4.4 3.1 7.2 7.3 7.2h1.2c4.2 0 7.4-3.2 7.4-7.4v-1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function ClusterMonitor() {
  const [selected, setSelected] =
    useState<string | null>(null);

  return (
    <main className="min-h-full overflow-x-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#E8EDF9_45%,#CAD6F4_100%)] px-3 py-4 sm:px-5 sm:py-5 lg:px-7">
      <TopBar />

      <section className="relative mb-4 pt-1 sm:mb-5">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-800 sm:text-xl">
            Production Cluster
          </h1>

          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Interactive view of
            your Kubernetes
            environment and
            dependencies
          </p>
        </div>
      </section>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-5">
          <aside className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:block lg:space-y-4">
            <div className="rounded-[18px] border border-white/70 bg-white/45 p-4 shadow-[0_10px_35px_rgba(65,84,130,0.10)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/40">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Health Overview
              </h3>

              <HealthDonut />
            </div>

            <DependenciesLegend />

            <HowToUse />
          </aside>

          <section className="min-w-0">
            <TopologyPanel
              entities={MOCK_ENTITIES}
              edges={MOCK_EDGES}
              selected={selected}
              onSelect={setSelected}
            />
          </section>
        </div>

        <div className="w-full">
          <DetailPanel
            selected={selected}
          />
        </div>
      </div>
    </main>
  );
}