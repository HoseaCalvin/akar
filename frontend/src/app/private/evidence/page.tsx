"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";

import EvidenceAlert from "@/components/EvidenceAlert";
import TopBar from "@/components/TopBar";
import PageState from "@/components/PageState";
import Sparkline from "@/components/Sparkline";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type EvidenceType = "All" | "Metric" | "Log" | "Trace" | "Change";

const DETAIL_TABS = [
  "Log Samples",
  "Patterns",
  "Raw Data",
  "Affected Services (2)",
] as const;

type DetailTab = (typeof DETAIL_TABS)[number];

export default function EvidencePage() {
  const type: EvidenceType = "All";

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailTab, setDetailTab] =
    useState<DetailTab>("Log Samples");

  const { data, loading, error } = useApi(
    `evidence:${type}`,
    () =>
      api.evidence.list({
        type: type === "All" ? undefined : type,
      }),
  );

  const items = useMemo(() => {
    return data?.items ?? [];
  }, [data?.items]);

  const selected = useMemo(() => {
    if (selectedId) {
      const found = items.find(
        (item) => item.id === selectedId,
      );

      if (found) {
        return found;
      }
    }

    return items[0] ?? null;
  }, [items, selectedId]);

  const pageError = error ? String(error) : null;

  return (
    <main className="main-container flex h-screen min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <TopBar />
      </div>

      <section className="mt-0 shrink-0 px-0">
        <div className="flex min-w-0 items-start gap-50">
          <div className="min-w-0 shrink-0">
            <h1 className="text-[26px] font-semibold leading-[31px] tracking-[-0.5px] text-[#111111]">
              Evidence Explorer
            </h1>

            <p className="mt-[6px] text-[13px] leading-[19px] text-[#687B9B]">
              Explore the metrics, logs and traces that supports your RCA result
            </p>
          </div>

          <EvidenceAlert/>
        </div>
      </section>

      <section className="mt-3 flex w-full min-w-0 shrink-0 items-center gap-3">
        <div className="grid shrink-0 grid-cols-4 gap-2">
          <EvidenceStat
            icon="evidence"
            value="12"
            label="All Evidence"
          />

          <EvidenceStat
            icon="metric"
            value="5"
            label="Metrics"
          />

          <EvidenceStat
            icon="log"
            value="4"
            label="Logs"
          />

          <EvidenceStat
            icon="trace"
            value="3"
            label="Traces"
          />
        </div>

        <div className="ml-auto flex min-w-0 items-center justify-end gap-2">
          <EvidenceFilter
            label="Source (All)"
            width="130px"
          />

          <EvidenceFilter
            label="Component (All)"
            width="162px"
          />

          <EvidenceFilter
            label="Type (All)"
            width="120px"
          />

          <EvidenceFilter
            label="Aug 01, 13:25 - 14:00"
            width="220px"
            calendar
          />

          <button
            type="button"
            aria-label="Filter evidence"
            className="
              flex
              h-[42px]
              w-[46px]
              shrink-0
              items-center
              justify-center
              rounded-[10px]
              border
              border-[#E8EBF2]
              bg-white
              shadow-[0_5px_16px_rgba(35,61,120,0.09)]
              transition
              hover:bg-[#F8F9FC]
            "
          >
            <Filter className="h-[17px] w-[17px] stroke-[1.8]" />
          </button>
        </div>
      </section>

      <section
        className="
          mt-4
          grid
          min-h-0
          flex-1
          grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]
          gap-4
          overflow-hidden
          pb-4
        "
      >
        <section
          className="
            flex
            h-full
            min-h-0
            min-w-0
            flex-col
            overflow-hidden
            rounded-[20px]
            border
            border-[#EEF1F7]
            bg-white
            p-4
            shadow-[0_8px_24px_rgba(32,57,110,0.10)]
          "
        >
          <div className="flex shrink-0 items-center justify-between">
            <h2 className="text-[20px] font-semibold tracking-[-0.4px] text-[#111111]">
              Evidence Timeline
            </h2>

            <button
              type="button"
              className="
                flex
                h-[32px]
                items-center
                gap-2
                rounded-[9px]
                bg-white
                px-3
                text-[10px]
                font-medium
                text-[#222222]
                shadow-[0_4px_15px_rgba(45,69,120,0.12)]
              "
            >
              Relevance
              <ChevronDown className="h-[13px] w-[13px]" />
            </button>
          </div>

          <div
            className="
              mt-3
              min-h-0
              flex-1
              overflow-x-hidden
              overflow-y-auto
              overscroll-contain
              pr-2
            "
          >
            <div className="relative">
              <div className="absolute bottom-0 left-[11px] top-0 w-px bg-[#DDE2EC]" />

              <PageState
                loading={loading}
                error={pageError}
                empty={!loading && items.length === 0}
                emptyLabel="No evidence matched"
              />

              {!loading &&
                items.map((item) => (
                  <EvidenceTimelineItem
                    key={item.id}
                    item={item}
                    selected={selected?.id === item.id}
                    onSelect={() => {
                      setSelectedId(item.id);

                      if (item.type !== "Metric") {
                        setDetailTab("Log Samples");
                      }
                    }}
                  />
                ))}
            </div>
          </div>
        </section>

        <section
          className="
            h-full
            min-h-0
            min-w-0
            overflow-hidden
            rounded-[20px]
            border
            border-[#EEF1F7]
            bg-white
            p-5
            shadow-[0_8px_24px_rgba(32,57,110,0.10)]
          "
        >
          {selected ? (
            <EvidenceDetail
              item={selected}
              detailTab={detailTab}
              setDetailTab={setDetailTab}
            />
          ) : (
            <EmptyDetail />
          )}
        </section>
      </section>
    </main>
  );
}


function EvidenceStat({
  icon,
  value,
  label,
}: {
  icon: "evidence" | "metric" | "log" | "trace";
  value: string;
  label: string;
}) {
  const config = {
    evidence: {
      box: "bg-[#EEE7FF]",
      shadow: "shadow-[0_0_7px_rgba(108,0,180,0.14)]",
    },
    metric: {
      box: "bg-[#FFF8C9]",
      shadow: "shadow-[0_0_7px_rgba(196,188,0,0.14)]",
    },
    log: {
      box: "bg-[#FFD9D9]",
      shadow: "shadow-[0_0_7px_rgba(244,68,68,0.14)]",
    },
    trace: {
      box: "bg-[#DFFFCA]",
      shadow: "shadow-[0_0_7px_rgba(22,163,74,0.14)]",
    },
  }[icon];

  return (
    <div
      className="
        flex
        h-[50px]
        w-[104px]
        items-center
        rounded-[8px]
        border
        border-[#E4E8F1]
        bg-white
        px-[6px]
        shadow-[0_3px_10px_rgba(44,69,125,0.07)]
      "
    >
      <div
        className={`
          flex
          h-[25px]
          w-[25px]
          shrink-0
          items-center
          justify-center
          rounded-[6px]
          ${config.box}
          ${config.shadow}
        `}
      >
        {icon === "evidence" && <DocumentIcon />}
        {icon === "metric" && <MetricIcon />}
        {icon === "log" && <LogIcon />}
        {icon === "trace" && <TraceIcon />}
      </div>

      <div className="ml-[6px] min-w-0">
        <p className="text-[16px] font-bold leading-[16px] text-[#17254A]">
          {value}
        </p>

        <p className="mt-[1px] whitespace-nowrap text-[7px] font-semibold leading-[8px] text-[#8796B4]">
          {label}
        </p>
      </div>
    </div>
  );
}

function EvidenceFilter({
  label,
  width,
  calendar = false,
}: {
  label: string;
  width: string;
  calendar?: boolean;
}) {
  return (
    <button
      type="button"
      style={{ width }}
      className="
        flex
        h-[42px]
        shrink-0
        items-center
        justify-between
        rounded-[10px]
        border
        border-[#E7EAF1]
        bg-white
        px-[11px]
        text-[11px]
        font-medium
        text-[#171717]
        shadow-[0_4px_13px_rgba(30,55,120,0.07)]
        transition
        hover:bg-[#F9FAFC]
      "
    >
      <span className="flex min-w-0 items-center gap-[6px]">
        {calendar && (
          <CalendarDays className="h-[15px] w-[15px] shrink-0 stroke-[1.8]" />
        )}

        <span className="truncate whitespace-nowrap">
          {label}
        </span>
      </span>

      <ChevronDown className="ml-2 h-[14px] w-[14px] shrink-0 stroke-[1.7]" />
    </button>
  );
}

function EvidenceTimelineItem({
  item,
  selected,
  onSelect,
}: {
  item: {
    id: string;
    title: string;
    type: string;
    source: string;
    component: string;
    relevance: string;
    time: string;
    ago: string;
    incidentCode: string;
    sparkline?: number[];
    sparklineColor?: string;
  };
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="relative mb-3 flex gap-3 last:mb-0">
      <div className="relative z-10 flex w-[22px] shrink-0 justify-center">
        <span
          className={`
            mt-[4px]
            h-[10px]
            w-[10px]
            rounded-full
            border-2
            border-white
            ${
              selected
                ? "bg-[#F04444]"
                : "bg-[#FF8A00]"
            }
          `}
        />
      </div>

      <div className="w-[54px] shrink-0 pt-0">
        <p className="text-[10px] font-medium text-[#202020]">
          {item.time}
        </p>

        <p className="mt-1 whitespace-nowrap text-[9px] text-[#6D6D6D]">
          {item.ago}
        </p>
      </div>

      <button
        type="button"
        onClick={onSelect}
        className={`
          min-w-0
          flex-1
          rounded-[15px]
          border
          bg-white
          px-4
          py-3
          text-left
          transition
          ${
            selected
              ? "border-[#6969FF] bg-[#F9FAFF] shadow-[0_2px_8px_rgba(88,88,255,0.04)]"
              : "border-[#D4D4D4] hover:border-[#BFC8DE]"
          }
        `}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-[13px] font-bold text-[#111111]">
            {item.title}
          </h3>

          <div className="flex shrink-0 items-center gap-1.5">
            <EvidenceTypeBadge type={item.type} />

            <ChevronRight className="h-[14px] w-[14px] text-[#555555]" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2.5">
          <TimelineMeta
            label="Source"
            value={item.source}
          />

          <TimelineMeta
            label="Component"
            value={item.component}
          />

          <TimelineMeta
            label="Relevance"
            value={item.relevance}
            accent
          />
        </div>

        {item.sparkline && (
          <div className="mt-2 h-[52px] w-full">
            <Sparkline
              values={item.sparkline}
              color={
                item.sparklineColor === "orange"
                  ? "#FF9B00"
                  : "#FF4B4B"
              }
            />
          </div>
        )}
      </button>
    </div>
  );
}

function TimelineMeta({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] text-[#666666]">
        {label}
      </p>

      <p
        className={`
          mt-1
          truncate
          text-[10px]
          font-bold
          ${
            accent
              ? "text-[#FF1717]"
              : "text-[#111111]"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}

function EvidenceTypeBadge({
  type,
}: {
  type: string;
}) {
  const style =
    type === "Log"
      ? "bg-[#FFDADA] text-[#F54B4B]"
      : type === "Change"
        ? "bg-[#E8EEFF] text-[#1D4ED8]"
        : type === "Trace"
          ? "bg-[#F3E8FF] text-[#7E22CE]"
          : "bg-[#FFF4BF] text-[#B28A00]";

  return (
    <span
      className={`
        rounded-full
        px-[8px]
        py-[4px]
        text-[8px]
        font-medium
        ${style}
      `}
    >
      {type}
    </span>
  );
}

function EvidenceDetail({
  item,
  detailTab,
  setDetailTab,
}: {
  item: {
    id: string;
    title: string;
    type: string;
    source: string;
    component: string;
    relevance: string;
    time: string;
    ago: string;
    incidentCode: string;
    sparkline?: number[];
    sparklineColor?: string;
  };
  detailTab: DetailTab;
  setDetailTab: (tab: DetailTab) => void;
}) {
  const isMetric = item.type === "Metric";

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-3">
        <EvidenceTypeBadge type={item.type} />

        <span className="flex items-center gap-2 text-[11px] font-medium text-[#171717]">
          <span className="h-[9px] w-[9px] rounded-full bg-[#FF0909]" />
          High Relevance
        </span>
      </div>

      <h2 className="mt-3.5 text-[22px] font-bold leading-[27px] tracking-[-0.4px] text-[#090909]">
        {item.title}
      </h2>

      <p className="mt-2 max-w-[650px] text-[11px] leading-[17px] text-[#111111]">
        {isMetric
          ? "The spike in connection errors aligns with the incidents start time and indicates the database is unable to handle incoming connections"
          : "A significant increased in database connection errors detected"}
      </p>

      <div className="mt-3.5 space-y-2.5">
        <DetailRow
          label="Source"
          value={item.source}
        />

        <DetailRow
          label="Component"
          value={item.component}
          blue
        />

        <DetailRow
          label="Time stamp"
          value="Aug 01, 15:25 -16:00"
        />

        <DetailRow
          label="Relevance"
          value={item.relevance}
          red
        />
      </div>

      {isMetric ? (
        <>
          <h3 className="mt-4 text-[15px] font-bold text-[#111111]">
            Metric Overview
          </h3>

          <MetricChart />
        </>
      ) : (
        <>
          <h3 className="mt-4 text-[15px] font-bold text-[#111111]">
            Log Summary
          </h3>

          <div className="mt-2 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-6 overflow-x-auto">
              {DETAIL_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDetailTab(tab)}
                  className={`
                    whitespace-nowrap
                    border-b-2
                    px-0
                    pb-2
                    text-[10px]
                    font-medium
                    ${
                      detailTab === tab
                        ? "border-[#315EFF] text-[#315EFF]"
                        : "border-transparent text-[#333333]"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <LogSummary tab={detailTab} />
        </>
      )}

      <RelatedEvidence />

      <AiEvidenceSummary />
    </div>
  );
}

function DetailRow({
  label,
  value,
  blue = false,
  red = false,
}: {
  label: string;
  value: string;
  blue?: boolean;
  red?: boolean;
}) {
  return (
    <div className="grid grid-cols-[100px_minmax(0,1fr)] items-center gap-3">
      <span className="text-[11px] text-[#333333]">
        {label}
      </span>

      <span
        className={`
          truncate
          text-[12px]
          font-medium
          ${
            blue
              ? "text-[#1454D8]"
              : red
                ? "text-[#FF1717]"
                : "text-[#111111]"
          }
        `}
      >
        {value}
      </span>
    </div>
  );
}

function MetricChart() {
  const values = [
    52,
    68,
    76,
    72,
    75,
    70,
    80,
    85,
    72,
    75,
    77,
    88,
    100,
    125,
    140,
    150,
    205,
    150,
    95,
    105,
    100,
    110,
    100,
    85,
    65,
    75,
    78,
    110,
    95,
    125,
    118,
    135,
    130,
    142,
  ];

  return (
    <div className="mt-2.5 rounded-[13px] bg-[#F4F7FD] p-3">
      <div className="relative h-[175px]">
        <div className="absolute bottom-7 left-[58px] right-3 top-2">
          <svg
            viewBox="0 0 600 180"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient
                id="metricFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#FF6B6B"
                  stopOpacity="0.72"
                />

                <stop
                  offset="100%"
                  stopColor="#FF6B6B"
                  stopOpacity="0.10"
                />
              </linearGradient>
            </defs>

            <path
              d={buildAreaPath(values)}
              fill="url(#metricFill)"
            />

            <path
              d={buildLinePath(values)}
              fill="none"
              stroke="#FF1717"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            <line
              x1="398"
              x2="398"
              y1="0"
              y2="180"
              stroke="#777777"
              strokeDasharray="2 3"
            />

            <circle
              cx="398"
              cy={getPointY(values, 16)}
              r="5"
              fill="#050505"
            />
          </svg>
        </div>

        <div className="absolute left-0 top-1 flex h-[165px] flex-col justify-between text-[10px] text-[#333333]">
          <span>200%</span>
          <span>100%</span>
          <span>80%</span>
          <span>40%</span>
          <span>20%</span>
        </div>

        <div className="absolute bottom-0 left-[58px] right-3 flex justify-between text-[10px] text-[#333333]">
          <span>15:00</span>
          <span>15:15</span>
          <span>15:20</span>
          <span>15:25</span>
          <span>15:30</span>
          <span>15:45</span>
          <span>16:00</span>
        </div>
      </div>
    </div>
  );
}

function buildLinePath(values: number[]) {
  if (!values.length) return "";

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);

  return values
    .map((value, index) => {
      const x =
        (index / (values.length - 1)) * 600;

      const y =
        175 -
        ((value - min) / range) * 155;

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function buildAreaPath(values: number[]) {
  if (!values.length) return "";

  const line = buildLinePath(values);

  return `${line} L 600 180 L 0 180 Z`;
}

function getPointY(
  values: number[],
  index: number,
) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);

  return (
    175 -
    ((values[index] - min) / range) * 155
  );
}

function LogSummary({
  tab,
}: {
  tab: DetailTab;
}) {
  if (tab === "Patterns") {
    return (
      <div className="mt-2 overflow-hidden rounded-[12px] border border-[#D9DDE6]">
        <div className="grid grid-cols-[150px_1fr_80px_80px] border-b bg-[#FAFBFD] px-2 py-2 text-[9px] font-medium text-[#333333]">
          <span>Pattern</span>
          <span>Description</span>
          <span>Occurrences</span>
          <span>Severity</span>
        </div>

        <PatternRow
          code="DB_CONNECTION_TIMEOUT"
          description="Database connection attempts timed out"
          occurrences="142"
          severity="Critical"
          critical
        />

        <PatternRow
          code="CONNECTION_POOL_EXHAUSTED"
          description="Connection pool reached maximum limit"
          occurrences="87"
          severity="High"
        />

        <PatternRow
          code="RETRY_CONNECTION_FAILED"
          description="All retry attempts to connect failed"
          occurrences="64"
          severity="High"
        />

        <PatternRow
          code="DB_REQUEST_TIMEOUT"
          description="Database request execution timed out"
          occurrences="39"
          severity="Medium"
        />
      </div>
    );
  }

  if (tab === "Raw Data") {
    return (
      <div className="mt-2 rounded-[12px] border border-[#D9DDE6] bg-[#FCFCFD] p-3 font-mono text-[9px] leading-[17px] text-[#333333]">
        <p>
          2025-05-16T15:24:05.102+07:00 ERROR [payment-svc]
          org.postgresql.util.PSQLException:
        </p>

        <p>
          Connection to postgresql-primary:5432 timed out.
        </p>

        <p className="mt-2">
          2025-05-16T15:24:05.807+07:00 WARN [payment-svc]
          Retrying connection attempt.
        </p>

        <p className="mt-2">
          2025-05-16T15:24:05.210+07:00 ERROR [payment-svc]
          Connection attempt failed after retries.
        </p>
      </div>
    );
  }

  if (tab === "Affected Services (2)") {
    return (
      <div className="mt-2 grid grid-cols-2 gap-3">
        <ServiceBox
          name="Payment Service"
          status="Critical"
        />

        <ServiceBox
          name="PostgreSQL Primary"
          status="Critical"
        />
      </div>
    );
  }

  return (
    <div className="mt-2 rounded-[12px] border border-[#D9DDE6] bg-white p-2.5">
      <LogLine
        number="1"
        time="2025-05-16T15:24:05.102+07:00"
        type="ERROR"
        text="Connection to postgresql-primary:5432 timed out. Timeout after 5000 ms."
      />

      <LogLine
        number="2"
        time="2025-05-16T15:24:05.807+07:00"
        type="WARN"
        text="Retrying connection (attempt 2/3)..."
      />

      <LogLine
        number="3"
        time="2025-05-16T15:24:05.210+07:00"
        type="ERROR"
        text="Connection attempt failed after 3 retries. Giving up."
      />

      <LogLine
        number="4"
        time="2025-05-16T15:24:05.211+07:00"
        type="ERROR"
        text="Connection is not available, request timed out after 5000ms."
      />
    </div>
  );
}

function LogLine({
  number,
  time,
  type,
  text,
}: {
  number: string;
  time: string;
  type: string;
  text: string;
}) {
  return (
    <div className="grid grid-cols-[18px_1fr] gap-2 py-1.5 font-mono text-[8px] leading-[13px]">
      <span className="text-[#333333]">
        {number}
      </span>

      <div>
        <span className="text-[#333333]">
          {time}
        </span>

        <span
          className={`
            ml-2
            ${
              type === "ERROR"
                ? "text-[#FF0000]"
                : "text-[#E29B00]"
            }
          `}
        >
          {type}
        </span>

        <span className="ml-2 text-[#333333]">
          {text}
        </span>
      </div>
    </div>
  );
}

function PatternRow({
  code,
  description,
  occurrences,
  severity,
  critical = false,
}: {
  code: string;
  description: string;
  occurrences: string;
  severity: string;
  critical?: boolean;
}) {
  return (
    <div className="grid grid-cols-[150px_1fr_80px_80px] items-center border-b border-[#EDF0F4] px-2 py-2 text-[8px] last:border-0">
      <span
        className={`
          w-fit
          rounded-[5px]
          px-1.5
          py-1
          font-medium
          ${
            critical
              ? "bg-[#FFD0D0] text-[#F04444]"
              : "bg-[#FFE5CF] text-[#E68A00]"
          }
        `}
      >
        {code}
      </span>

      <span className="text-[#333333]">
        {description}
      </span>

      <span className="font-bold text-[#222222]">
        {occurrences}
      </span>

      <span className="flex items-center gap-1.5">
        <span
          className={`
            h-[6px]
            w-[6px]
            rounded-full
            ${
              severity === "Critical"
                ? "bg-[#FF1717]"
                : severity === "High"
                  ? "bg-[#FFA500]"
                  : "bg-[#D6DD00]"
            }
          `}
        />

        {severity}
      </span>
    </div>
  );
}

function RelatedEvidence() {
  return (
    <section className="mt-3.5">
      <h3 className="text-[15px] font-bold text-[#111111]">
        Related Evidence
      </h3>

      <div className="mt-2 grid grid-cols-2 gap-3">
        <RelatedBox
          title="PostgreSQL Connection Timeout Errors"
          type="Log"
          relevance="95% Relevance"
          tone="red"
        />

        <RelatedBox
          title="Slow Query Trace"
          type="Trace"
          relevance="90% Relevance"
          tone="green"
        />
      </div>
    </section>
  );
}

function RelatedBox({
  title,
  type,
  relevance,
  tone,
}: {
  title: string;
  type: string;
  relevance: string;
  tone: "red" | "green";
}) {
  return (
    <Link
      href="#"
      className={`
        min-w-0
        rounded-[10px]
        border
        bg-white
        px-3
        py-2.5
        ${
          tone === "red"
            ? "border-[#FFBABA]"
            : "border-[#9FEA64]"
        }
      `}
    >
      <p className="truncate text-[10px] font-bold text-[#222222]">
        {title}
      </p>

      <div className="mt-1.5 flex items-center gap-2.5 text-[8px] text-[#444444]">
        <span>{type}</span>

        <span className="h-[4px] w-[4px] rounded-full bg-[#D0D0D0]" />

        <span>{relevance}</span>
      </div>
    </Link>
  );
}

function AiEvidenceSummary() {
  return (
    <section className="mt-3.5 rounded-[10px] border border-[#6666FF] bg-[#F9FAFF] px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[15px] text-[#5454FF]">
              ✧
            </span>

            <h3 className="text-[12px] font-bold text-[#111111]">
              AI Evidence Summary
            </h3>
          </div>

          <p className="mt-1 truncate text-[9px] text-[#222222]">
            the metric shows a strong correlation with the root cause
          </p>
        </div>

        <button
          type="button"
          className="
            flex
            h-[32px]
            shrink-0
            items-center
            gap-2
            rounded-[8px]
            border
            border-[#A8C3FF]
            bg-[#EFF4FF]
            px-2.5
            text-[9px]
            font-medium
            text-[#222222]
          "
        >
          View Analysis
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}

function EmptyDetail() {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F4FA]">
        <Search className="h-5 w-5 text-[#71809D]" />
      </div>

      <h2 className="mt-3 text-[17px] font-semibold text-[#222222]">
        Select evidence
      </h2>

      <p className="mt-1 text-[12px] text-[#71809D]">
        Select an evidence item from the timeline to inspect its details.
      </p>
    </div>
  );
}

function ServiceBox({
  name,
  status,
}: {
  name: string;
  status: string;
}) {
  return (
    <div className="rounded-[9px] border border-[#FFBABA] p-2.5">
      <p className="text-[11px] font-bold text-[#222222]">
        {name}
      </p>

      <p className="mt-1 text-[9px] text-[#FF1717]">
        {status}
      </p>
    </div>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6 3.5H14L19 8.5V19C19 19.8284 18.3284 20.5 17.5 20.5H6C5.17157 20.5 4.5 19.8284 4.5 19V5C4.5 4.17157 5.17157 3.5 6 3.5Z"
        fill="#6500A8"
      />

      <path
        d="M14 3.5V8.5H19"
        stroke="white"
        strokeWidth="1.5"
      />

      <path
        d="M8 12H16M8 15H16"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MetricIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4 18.5V14L8 10.5L11 13.5L17 6.5L20 9V18.5H4Z"
        fill="#A7A000"
      />

      <path
        d="M4 19H20"
        stroke="#A7A000"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M8 6L4 12L8 18M16 6L20 12L16 18"
        stroke="#F04444"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M14 5L10 19"
        stroke="#F04444"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TraceIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="6"
        cy="12"
        r="2.5"
        fill="#16A34A"
      />

      <circle
        cx="17.5"
        cy="6"
        r="2.5"
        fill="#16A34A"
      />

      <circle
        cx="17.5"
        cy="18"
        r="2.5"
        fill="#16A34A"
      />

      <path
        d="M8.5 11L15 7M8.5 13L15 17"
        stroke="#16A34A"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}