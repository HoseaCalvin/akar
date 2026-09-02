"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import PageState from "@/components/PageState";
import { ChevronLeft, ExternalLink, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export default function IncidentTimeline({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = useApi(`timeline:${id}`, () =>
    api.incidents.timeline(id),
  );

  if (!data) {
    return (
      <main className="main-container min-h-screen px-7 pb-8 pt-5">
        <TopBar />
        <PageState loading={loading} error={error} />
      </main>
    );
  }

  const { incident, events } = data;

  return (
    <main className="main-container min-h-screen px-7 pb-8 pt-5 text-[#17294D]">
      <section className="flex min-h-[72px] items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={() => router.push(`/private/incidents/${id}`)}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-white/60"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <div className="flex min-w-0 items-center gap-5">
            <h1 className="shrink-0 text-2xl font-bold text-black md:text-3xl">
              {incident.code}
            </h1>
            <h2 className="truncate text-2xl font-semibold text-black md:text-3xl">
              {incident.title}
            </h2>
          </div>
        </div>
        <div className="shrink-0">
          <TopBar />
        </div>
      </section>

      <section className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-3 xl:grid-cols-6">
        <div>
          <p className="text-sm font-bold text-black">Status</p>
          <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#55B91B]">
            <CheckCircle2 className="h-3.5 w-3.5 fill-[#55B91B] text-white" />
            {incident.status}
          </p>
        </div>
        <Meta label="Severity" value={incident.severity} className="text-red-500" />
        <Meta label="Duration" value={incident.duration} />
        <Meta label="Start Time" value={incident.startTime} />
        <Meta label="End Time" value={incident.endTime ?? "—"} />
        <Meta label="Affected Service" value={incident.affectedService} />
      </section>

      <section className="mt-7 rounded-[26px] bg-gradient-to-r from-white via-white to-transparent px-7 py-6 md:px-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold md:text-xl">Incidents Timeline</h2>
          <p className="mt-1 text-xs text-slate-500 md:text-sm">
            Chronological causal event playback, state transitions, and recovery tracking
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block">
            <div className="absolute bottom-[32px] left-[139px] top-[32px] w-[5px] overflow-hidden rounded-full">
              <div className="h-full w-full bg-gradient-to-b from-[#FF0000] via-[#F39A18] via-[#F2C318] to-[#36E51F]" />
            </div>
          </div>

          <div className="space-y-5">
            {events.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 gap-3 md:grid-cols-[180px_24px_minmax(0,1fr)] md:gap-0"
              >
                <div className="relative flex min-h-[92px] items-center">
                  <span
                    className="text-sm font-bold md:absolute md:right-[88px]"
                    style={{ color: item.color }}
                  >
                    {item.time}
                  </span>
                  <span
                    className="absolute left-[107px] top-1/2 hidden h-[64px] w-[64px] -translate-y-1/2 rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.12)] md:block"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <div className="hidden md:block" />
                <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_3px_12px_rgba(40,64,110,0.04)] md:min-h-[92px] md:px-6">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1.45fr_auto] lg:items-center lg:gap-5">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold md:text-base" style={{ color: item.color }}>
                        {item.title}
                      </h3>
                      <div className="mt-1.5 space-y-0.5 text-[11px] leading-[1.35rem] text-[#26334D] md:text-xs">
                        {item.description.map((description) => (
                          <p key={description}>{description}</p>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 border-l-0 border-slate-200 sm:grid-cols-3 lg:border-l lg:pl-5">
                      {item.details.map((detail) => (
                        <div key={detail.label} className="min-w-0">
                          <p className="text-[11px] text-[#26334D] md:text-xs">{detail.label}</p>
                          <p
                            className={`mt-2 break-words text-[11px] font-bold leading-4 md:text-xs ${detail.valueColor ?? "text-[#1D2942]"}`}
                          >
                            {detail.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/private/incidents/${id}/timeline/${item.id}`}
                      className="flex w-fit items-center gap-2 rounded-xl border border-[#9DBCF5] bg-[#EDF4FF] px-4 py-2.5 text-[11px] font-medium text-[#253856] transition hover:bg-[#E2EDFF] lg:ml-auto"
                    >
                      View Details
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Meta({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold text-black">{label}</p>
      <p className={`mt-3 text-sm font-medium ${className ?? "text-black"}`}>{value}</p>
    </div>
  );
}
