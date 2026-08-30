"use client";

import TopBar from "@/components/TopBar";
import HighlightBox from "@/components/HighlightBox";
import TableDetail from "@/components/TableDetail";

import { useRouter } from "next/navigation";

import { ChevronLeft } from "lucide-react";

import { getDescriptionColor, getRowBackgroundColor, getBadgeColor, getBadgeTextColor } from "@/utils/row-style";

interface ServicesData {
  id: string;
  podName: string;
  descriptionResource: string;
  nodeHost: string;
  namespace: string;
  restarts: number;
  cpuRam: string;
  status: 'Critical' | 'High' | 'Low';
}

export default function Services() {
    const router = useRouter();

    return(
        <main className="relative flex flex-col min-h-full py-5 px-7">
            <TopBar/>
            <section className="flex items-center lg:gap-x-2 lg:pb-10 ">
                <ChevronLeft
                  className="inline cursor-pointer w-auto h-4 lg:h-7"
                  onClick={() => router.push("/private/monitor")}
                />
                <h1 className="font-bold text-xl">Services Directory</h1>
            </section>
            <section className="flex justify-start w-full lg:gap-x-5">
                <HighlightBox
                    title="Total Services"
                    value="84"
                    description="ClusterIP & Ingress"
                    valueColor="text-black"
                    descriptionColor="text-gray-400"
                />
                <HighlightBox
                    title="Normal Traffic"
                    value="81"
                    description="77.7% Nominal"
                    valueColor="text-warning-lowl"
                    descriptionColor="text-warning-low"
                />
                <HighlightBox
                    title="Degraded / 5XX Spikes"
                    value="3"
                    description="Cascading Latency"
                    valueColor="text-critical"
                    descriptionColor="text-warning-critical"
                />
                <HighlightBox
                    title="Avg Services Latency"
                    value="1"
                    description="Spike (180 ms)"
                    valueColor="text-black"
                    descriptionColor="text-warning-high"
                />
            </section>
            <section>
                <TableDetail>
                    <section className="overflow-y-auto w-full h-full max-h-screen lg:space-y-2.5 lg:mt-5">
                        <div className="bg-[#F8FAFC] sticky top-0 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full justify-center rounded-lg text-sm *:text-gray-400 *:font-semibold lg:py-3 lg:px-5">
                            <h1>SERVICE NAME</h1>
                            <h1>TYPE / PROTOCOL</h1>
                            <h1>NAMESPACE</h1>
                            <h1>TARGET PODS</h1>
                            <h1>LATENCY (P95)</h1>
                            <h1>HEALTH STATUS</h1>
                            <h1>ACTION</h1>
                        </div>
                    </section>
                </TableDetail>
            </section>
        </main>
    )
}