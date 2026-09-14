"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import HighlightBox from "@/components/HighlightBox";
import TableDetail from "@/components/TableDetail";
import PageState from "@/components/PageState";
import { ChevronLeft } from "lucide-react";
import {
  getRowBackgroundColor,
  getBadgeColor,
  getBadgeTextColor,
} from "@/utils/row-style";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export default function Nodes() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, loading, error } = useApi(`nodes:${search}`, () =>
    api.monitor.nodes(search || undefined),
  );

  return (
    <main className="relative flex flex-col min-h-full py-5 px-7 ">
      <TopBar />
      <section className="flex items-center gap-2 pb-8">
        <button 
          onClick={() => router.push("/private/monitor/inventory")} 
          className="p-2 rounded-lg hover:bg-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        <h1 className="text-xl font-semibold text-slate-800">Nodes</h1>
      </section>
      <section className="flex justify-start w-full gap-4 mb-6">
        {data?.highlights.map((item) => (
          <HighlightBox
            key={item.title}
            title={item.title}
            value={item.value}
            description={item.description}
            tone={item.tone}
          />
        ))}
      </section>
      <section>
        <TableDetail counts={data?.counts} search={search} onSearchChange={setSearch}>
          <section className="overflow-y-auto w-full h-full max-h-screen space-y-2 mt-5">
            <div className="bg-white sticky top-0 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full justify-center rounded-lg border border-slate-200 text-sm *:text-slate-500 *:font-medium py-3 px-4">
              <h1>Node Hostname</h1>
              <h1>Role</h1>
              <h1>K8S Version / OS</h1>
              <h1>Active Pods</h1>
              <h1>Resources</h1>
              <h1>Condition</h1>
              <h1>Action</h1>
            </div>
            <PageState loading={loading} error={error} empty={!loading && (data?.items.length ?? 0) === 0} />
            {data?.items.map((item) => (
              <div
                key={item.id}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full justify-center rounded-lg border bg-white ${getRowBackgroundColor(item.status)} py-3 px-4 transition-shadow hover:shadow-sm`}
              >
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-medium text-slate-800">{item.hostname}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm text-slate-500">{item.role}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm text-slate-500">{item.versionOs}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-medium text-slate-600">{item.activePods}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-medium text-slate-600">{item.cpuRam}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <div className={`flex items-center rounded-lg w-fit px-2 py-1 ${getBadgeColor(item.status)}`}>
                    <span className={`text-sm font-medium ${getBadgeTextColor(item.status)}`}>{item.status}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <Link href={`/private/monitor/resources/${item.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Inspect →
                  </Link>
                </div>
              </div>
            ))}
          </section>
        </TableDetail>
      </section>
    </main>
  );
}
