"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import PageState from "@/components/PageState";
import { ChevronLeft, Download, Share2 } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export default function IncidentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = useApi(`incident:${id}`, () =>
    api.incidents.get(id),
  );

  if (!data) {
    return (
      <main className="main-container">
        <TopBar />
        <PageState loading={loading} error={error} />
      </main>
    );
  }

  return (
    <main className="main-container">
      <TopBar />
      <section className="flex items-center space-y-1 shrink-0 gap-x-3 lg:gap-x-5">
        <div className="flex items-center lg:gap-x-4">
          <ChevronLeft
            className="inline w-auto h-7 cursor-pointer"
            onClick={() => router.push("/private/incidents")}
          />
          <h1 className="inline font-bold text-lg">{data.code}</h1>
          <h1 className="inline font-semibold text-lg">{data.title}</h1>
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
      </section>
      <section className="flex justify-around w-full *:text-sm mt-5 lg:mt-7">
        <Meta label="Status" value={data.status} />
        <Meta label="Severity" value={data.severity} />
        <Meta label="Duration" value={data.duration} />
        <Meta label="Start Time" value={data.startTime} />
        <Meta label="End Time" value={data.endTime ?? "—"} />
        <Meta label="Affected Service" value={data.affectedService} />
      </section>
      <section className="bg-linear-to-r from-white to-white/0 min-h-[320px] rounded-lg lg:rounded-2xl lg:mt-5 p-6">
        <Link
          href={`/private/incidents/${id}/investigation`}
          className="text-blue-600 hover:underline"
        >
          Open investigation →
        </Link>
      </section>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h1 className="font-bold">{label}</h1>
      <h2 className="font-semibold">{value}</h2>
    </div>
  );
}
