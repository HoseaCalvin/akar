"use client";

import TopBar from "@/components/TopBar";
import HighlightBox from "@/components/HighlightBox";
import TableDetail from "@/components/TableDetail";

import { getDescriptionColor, getRowBackgroundColor, getBadgeColor, getBadgeTextColor } from "@/utils/row-style";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PodData {
  id: string;
  podName: string;
  descriptionResource: string;
  nodeHost: string;
  namespace: string;
  restarts: number;
  cpuRam: string;
  status: 'Critical' | 'High' | 'Low';
}

const dummyPodData: PodData[] = [
  {
    id: '1',
    podName: 'postgresql-primary-0',
    descriptionResource: 'Port: 5432/TCP',
    nodeHost: 'worker-node-01',
    namespace: 'production-db',
    restarts: 2,
    cpuRam: '42% / 78.4%',
    status: 'Critical',
  },
  {
    id: '2',
    podName: 'redis-cache-0',
    descriptionResource: 'Port: 6379/TCP',
    nodeHost: 'worker-node-02',
    namespace: 'production-cache',
    restarts: 0,
    cpuRam: '68% / 82.1%',
    status: 'High',
  },
  {
    id: '3',
    podName: 'nginx-ingress-7d9f8c6b5',
    descriptionResource: 'Port: 443/TCP',
    nodeHost: 'worker-node-03',
    namespace: 'ingress-nginx',
    restarts: 1,
    cpuRam: '31% / 54.6%',
    status: 'Low',
  },
  {
    id: '4',
    podName: 'api-server-6f4d8c7b9',
    descriptionResource: 'Port: 8080/TCP',
    nodeHost: 'worker-node-01',
    namespace: 'production-api',
    restarts: 7,
    cpuRam: '89% / 93.7%',
    status: 'Critical',
  },
  {
    id: '5',
    podName: 'worker-service-5c8d7f9a2',
    descriptionResource: 'Port: 9090/TCP',
    nodeHost: 'worker-node-04',
    namespace: 'production-worker',
    restarts: 3,
    cpuRam: '64% / 81.5%',
    status: 'High',
  },
  {
    id: '6',
    podName: 'frontend-web-7b6d9f8c4',
    descriptionResource: 'Port: 3000/TCP',
    nodeHost: 'worker-node-02',
    namespace: 'production-web',
    restarts: 0,
    cpuRam: '24% / 48.2%',
    status: 'Low',
  },
  {
    id: '7',
    podName: 'mongodb-primary-0',
    descriptionResource: 'Port: 27017/TCP',
    nodeHost: 'worker-node-05',
    namespace: 'production-db',
    restarts: 4,
    cpuRam: '76% / 87.9%',
    status: 'High',
  },
  {
    id: '8',
    podName: 'payment-service-8c7f6d5b4',
    descriptionResource: 'Port: 8080/TCP',
    nodeHost: 'worker-node-03',
    namespace: 'production-payment',
    restarts: 9,
    cpuRam: '94% / 97.8%',
    status: 'Critical',
  },
  {
    id: '9',
    podName: 'fluentbit-logging-x92kd',
    descriptionResource: 'Port: 2020/TCP',
    nodeHost: 'worker-node-04',
    namespace: 'logging',
    restarts: 1,
    cpuRam: '36% / 61.3%',
    status: 'Low',
  },
  {
    id: '10',
    podName: 'rabbitmq-cluster-0',
    descriptionResource: 'Port: 5672/TCP',
    nodeHost: 'worker-node-05',
    namespace: 'messaging',
    restarts: 5,
    cpuRam: '62% / 84.6%',
    status: 'High',
  },
];

export default function Pods() {
  const router = useRouter();
  
    return(
        <main className="relative flex flex-col min-h-full py-5 px-7">
            <TopBar/>
            <section className="flex items-center lg:gap-x-2 lg:pb-10 ">
                <ChevronLeft
                  className="inline cursor-pointer w-auto h-4 lg:h-7"
                  onClick={() => router.push("/private/monitor")}
                />
                <h1 className="font-bold text-xl">Pods Directory</h1>
            </section>
            <section className="flex justify-start w-full lg:gap-x-5">
                <HighlightBox
                    title="Total Pods"
                    value="84"
                    description="across 6 namespaces"
                    valueColor="text-black"
                    descriptionColor="text-gray-400"
                />
                <HighlightBox
                    title="Healthy Pods"
                    value="81"
                    description="96.4% Operational"
                    valueColor="text-warning-lowl"
                    descriptionColor="text-warning-low"
                />
                <HighlightBox
                    title="Anomalous / Restart"
                    value="3"
                    description="Attention Required"
                    valueColor="text-critical"
                    descriptionColor="text-warning-critical"
                />
                <HighlightBox
                    title="Crash Loop Detected"
                    value="1"
                    description="xyz-service-pod-02"
                    valueColor="text-black"
                    descriptionColor="text-warning-high"
                />
            </section>
            <section>
                <TableDetail>
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

                        { dummyPodData.map((data, index) => (
                            <div key={index} className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full justify-center rounded-lg border ${getRowBackgroundColor(data.status)} lg:p-4`}>
                                <div className="flex flex-col justify-center md:space-y-1">
                                    <span className="text-sm font-bold">{data.namespace}</span>
                                    <span className={`text-xs ${getDescriptionColor(data.status)}`}>{data.descriptionResource}</span>
                                </div>
                                <div className="flex flex-col justify-center md:space-y-1">
                                    <span className="text-sm text-gray-400">{data.nodeHost}</span>
                                </div>
                                <div className="flex flex-col justify-center md:space-y-1">
                                    <span className="text-sm text-gray-400">{data.namespace}</span>
                                </div>
                                <div className="flex flex-col justify-center md:space-y-1">
                                    <span className="text-sm font-semibold text-gray-400">{data.restarts}</span>
                                </div>
                                <div className="flex flex-col justify-center md:space-y-1">
                                    <span className="text-sm font-semibold text-gray-400">{data.cpuRam}</span>
                                </div>
                                <div className="flex flex-col justify-center md:space-y-1">
                                    <div className={`flex items-center gap-x-3 rounded-lg w-fit ${getBadgeColor(data.status)} lg:py-0.5 lg:px-3`}>
                                        <span className={`text-sm font-semibold ${getBadgeTextColor(data.status)}`}>{data.status}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center md:space-y-1">
                                    <span className="text-sm font-semibold text-blue-400">Inspect Pod →</span>
                                </div>
                            </div>
                        ))}
                    </section>
                </TableDetail>
            </section>
        </main>
    )
}