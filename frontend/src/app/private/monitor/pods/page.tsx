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
  getDescriptionColor,
  getRowBackgroundColor,
  getBadgeColor,
  getBadgeTextColor,
} from "@/utils/row-style";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export default function Pods() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, loading, error } = useApi(`pods:${search}`, () =>
    api.monitor.pods(search || undefined),
  );

  return (
    <main className="relative flex flex-col min-h-full py-5 px-7">
      <TopBar />
      <section className="flex items-center lg:gap-x-2 lg:pb-10">
        <ChevronLeft
          className="inline cursor-pointer w-auto h-4 lg:h-7"
          onClick={() => router.push("/private/monitor/inventory")}
        />
        <h1 className="font-bold text-xl">Pods Directory</h1>
      </section>
      <section className="flex justify-start w-full lg:gap-x-5">
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
          <section className="overflow-y-auto w-full h-full max-h-screen lg:space-y-2.5 lg:mt-5">
            <div className="bg-[#F8FAFC] sticky top-0 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full justify-center rounded-lg text-sm *:text-gray-400 *:font-semibold lg:py-3 lg:px-5">
              <h1>POD NAME</h1>
              <h1>NODE HOST</h1>
              <h1>NAMESPACE</h1>
              <h1>RESTARTS</h1>
              <h1>CPU / RAM</h1>
              <h1>STATUS</h1>
              <h1>ACTION</h1>
            </div>
            <PageState loading={loading} error={error} empty={!loading && (data?.items.length ?? 0) === 0} />
            {data?.items.map((item) => (
              <div
                key={item.id}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full justify-center rounded-lg border ${getRowBackgroundColor(item.status)} lg:p-4`}
              >
                <div className="flex flex-col justify-center md:space-y-1">
                  <span className="text-sm font-bold">{item.name}</span>
                  <span className={`text-xs ${getDescriptionColor(item.status)}`}>{item.description}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm text-gray-400">{item.nodeHost}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm text-gray-400">{item.namespace}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-semibold text-gray-400">{item.restarts}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-semibold text-gray-400">{item.cpuRam}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <div className={`flex items-center rounded-lg w-fit ${getBadgeColor(item.status)} lg:py-0.5 lg:px-3`}>
                    <span className={`text-sm font-semibold ${getBadgeTextColor(item.status)}`}>{item.status}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <Link href={`/private/monitor/resources/${item.id}`} className="text-sm font-semibold text-blue-400">
                    Inspect Pod →
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
