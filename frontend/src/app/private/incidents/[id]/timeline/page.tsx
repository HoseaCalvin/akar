"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ChevronLeft, ExternalLink, Download, Share2 } from "lucide-react";

import TopBar from "@/components/TopBar";
import PageState from "@/components/PageState";

import { endpoint } from "@/lib/endpoint";

import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { IncidentHeader, IncidentTimeline } from "@/lib/types";
import { getDuration, getMilitaryTime } from "@/utils/helpers";

export default function IncidentsTimeline({ params }: { params: Promise<{ id: string }>;}) {
  const { id } = use(params);
  const router = useRouter();

  const [incidentHeader, setIncidentHeader] = useState<IncidentHeader | null>(null);
  const [incidentTimeline, setIncidentTimeline] = useState<IncidentTimeline[] | null>(null);

  const { data, loading, error } = useApi(`timeline:${id}`, () =>
    api.incidents.timeline(id),
  );

  useEffect(() => {
    const fetchIncidentHeader = async () => {
      const incidentHeader = await endpoint.get<IncidentHeader>(`/api/incident/header/get/${id}`);

      setIncidentHeader(incidentHeader.data);
    }

    fetchIncidentHeader();
  }, []);
  
  useEffect(() => {
    const fetchIncidentTimeline = async () => {
      const incidentTimeline = await endpoint.get<IncidentTimeline[]>(`/api/incident/timeline/get/${id}`);;
      
      setIncidentTimeline(incidentTimeline.data);
    }

    fetchIncidentTimeline();
  }, [incidentHeader]);


  if (!data) {
    return (
      <main className="main-container min-h-screen px-7 pb-8 pt-5">
        <TopBar />
        <PageState loading={loading} error={error} />
      </main>
    );
  }


  return (
    <main className="main-container min-h-screen px-7 pb-8 pt-5 text-[#17294D]">
      <section className="flex items-center justify-between gap-6">
        <div className="flex gap-x-3 lg:gap-x-5">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => router.push(`/private/incidents/`)}
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-white/60"
            >
              <ChevronLeft 
                className="h-8 w-8" 
              />
            </button>
            <div className="flex min-w-0 items-center gap-x-5">
              <h1 className="shrink-0 text-2xl font-bold text-black md:text-xl">
                {incidentHeader?.code}
              </h1>
              <h2 className="truncate text-2xl font-semibold text-black md:text-xl">
                {incidentHeader?.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-x-2 lg:gap-x-3">
            <button
              type="button"
              aria-label="Export"
              className="flex items-center bg-white border border-gray-400 rounded-lg cursor-pointer gap-x-1 py-1 px-3 font-semibold text-xs text-gray-500 lg:py-1.5 lg:px-4 lg:gap-x-2"
            >
              <Download className="text-gray-500 w-auto h-4" />
              Export
            </button>
            <Link
              href={`/private/incidents/${id}/timeline`}
              aria-label="Open timeline"
              className="flex items-center bg-indigo-400 border border-indigo-500 rounded-lg cursor-pointer gap-x-1 py-1 px-3 font-semibold text-xs text-white lg:py-1.5 lg:px-4 lg:gap-x-2"
            >
              <Share2 className="text-white w-auto h-4" fill="white" />
              Timeline
            </Link>
          </div>
        </div>
        <div className="shrink-0">
          <TopBar />
        </div>
      </section>
      <section className="mt-7 flex justify-around gap-x-8 gap-y-5">
        <div>
          <p className="text-sm font-bold text-black">Severity</p>
          <p className={`mt-1 text-sm font-medium`}>{incidentHeader?.severity.name}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-black">Duration</p>
          <p className={`mt-1 text-sm font-medium`}>{incidentHeader ? getDuration(incidentHeader.start_time, incidentHeader.end_time) : "—"}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-black">Start Time</p>
          <p className={`mt-1 text-sm font-medium`}>{incidentHeader ? getMilitaryTime(incidentHeader?.start_time) : '-'}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-black">End Time</p>
          <p className={`mt-1 text-sm font-medium`}>{incidentHeader? getMilitaryTime(incidentHeader?.end_time) : '-'}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-black">Affected Service</p>
          <p className={`mt-1 text-sm font-medium`}>{incidentHeader?.affected_service}</p>
        </div>
      </section>
      <section className="mt-7 rounded-[26px] bg-gradient-to-r from-white via-white to-transparent px-7 py-6 md:px-8">
        <div className="flex w-full mb-6">
          <div className="w-1/2">
            <h2 className="text-lg font-bold md:text-lg">Incidents Timeline</h2>
            <p className="text-xs text-slate-500 md:text-sm">
              Chronological causal event playback, state transitions, and recovery tracking
            </p>
          </div>
          <div className="flex items-center w-1/2">
              <Link
                href={`/private/incidents/${id}/timeline/detail`}
                className="flex w-fit items-center gap-2 rounded-xl border border-[#9DBCF5] bg-[#EDF4FF] px-4 py-2.5 text-[11px] font-medium text-[#253856] transition hover:bg-[#E2EDFF] lg:ml-auto"
              >
                View Details
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
          </div>
        </div>
        <div className="relative">
          <div className="hidden md:block">
            <div className="absolute bottom-[32px] left-[139px] top-[32px] w-[5px] overflow-hidden rounded-full">
              <div className="h-full w-full bg-gray-200" />
            </div>
          </div>
          <div className="space-y-5">
            {incidentTimeline?.map((timeline) => (
              <div
                key={timeline.title}
                className="grid grid-cols-1 gap-3 md:grid-cols-[180px_24px_minmax(0,1fr)] md:gap-0"
              >
                <div className="relative flex min-h-[92px] items-center">
                  <span
                    className="text-sm font-bold md:absolute md:right-[88px]"
                  >
                    {getMilitaryTime(timeline.time_log)}
                  </span>
                  <span
                    className="absolute left-[119px] bg-indigo-400 border border-indigo-500 top-1/2 hidden h-11 w-11 -translate-y-1/2 rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.12)] md:block"
                  />
                </div>
                <div className="hidden md:block" />
                <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_3px_12px_rgba(40,64,110,0.04)] md:min-h-[92px] md:px-6">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1.45fr_auto] lg:items-center lg:gap-5">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold md:text-base">
                        {timeline.title}
                      </h3>
                      <div className="mt-1.5 text-xs leading-[1.35rem] text-[#26334D]">
                        {timeline.description}
                      </div>
                      <div className="space-y-0.5 text-xs leading-[1.35rem] text-gray-400">
                        {timeline.additional_description}
                      </div>
                    </div>
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

function InformationStat({
  label,
  value,
  className,
}: {
  label: string;
  value: any;
  className?: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold text-black">{label}</p>
      <p className={`mt-1 text-sm font-medium ${className ?? "text-black"}`}>{value}</p>
    </div>
  );
}
