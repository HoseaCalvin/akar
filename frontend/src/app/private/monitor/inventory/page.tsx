"use client";

import TopBar from "@/components/TopBar";
import HighlightBox from "@/components/HighlightBox";
import TableDetail from "@/components/TableDetail";

import { getDescriptionColor, getRowBackgroundColor, getBadgeColor, getBadgeTextColor } from "@/utils/row-style";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
interface InventoryData {
  id: string;
  resourceName: string;
  descriptionResource: string;
  type: string;
  namespace: string;
  cpuRam: string;
  status: 'Critical' | 'High' | 'Low';
}

const dummyInventoryData: InventoryData[] = [
  {
    id: '1',
    resourceName: 'postgresql-primary-0',
    descriptionResource: 'Port: 8080/TCP',
    type: 'StatefulSet Pod',
    namespace: 'production-db',
    cpuRam: '42% / 99.8%',
    status: 'Critical',
  },
  {
    id: '2',
    resourceName: 'redis-cache-0',
    descriptionResource: 'Port: 6379/TCP',
    type: 'StatefulSet Pod',
    namespace: 'production-cache',
    cpuRam: '78% / 91.4%',
    status: 'High',
  },
  {
    id: '3',
    resourceName: 'nginx-ingress-controller',
    descriptionResource: 'Port: 443/TCP',
    type: 'Deployment Pod',
    namespace: 'ingress-nginx',
    cpuRam: '31% / 64.2%',
    status: 'Low',
  },
  {
    id: '4',
    resourceName: 'api-server-7d9f8c6b5',
    descriptionResource: 'Port: 8080/TCP',
    type: 'Deployment Pod',
    namespace: 'production-api',
    cpuRam: '86% / 94.7%',
    status: 'Critical',
  },
  {
    id: '5',
    resourceName: 'worker-node-01',
    descriptionResource: 'Port: 9090/TCP',
    type: 'DaemonSet Pod',
    namespace: 'production-worker',
    cpuRam: '67% / 82.3%',
    status: 'High',
  },
  {
    id: '6',
    resourceName: 'frontend-web-5c8d7f9b',
    descriptionResource: 'Port: 3000/TCP',
    type: 'Deployment Pod',
    namespace: 'production-web',
    cpuRam: '24% / 51.6%',
    status: 'Low',
  },
  {
    id: '7',
    resourceName: 'mongodb-primary-0',
    descriptionResource: 'Port: 27017/TCP',
    type: 'StatefulSet Pod',
    namespace: 'production-db',
    cpuRam: '73% / 88.9%',
    status: 'High',
  },
  {
    id: '8',
    resourceName: 'payment-service-6f4d8c7',
    descriptionResource: 'Port: 8080/TCP',
    type: 'Deployment Pod',
    namespace: 'production-payment',
    cpuRam: '91% / 97.5%',
    status: 'Critical',
  },
  {
    id: '9',
    resourceName: 'logging-fluentbit-x92kd',
    descriptionResource: 'Port: 2020/TCP',
    type: 'DaemonSet Pod',
    namespace: 'logging',
    cpuRam: '38% / 69.1%',
    status: 'Low',
  },
  {
    id: '10',
    resourceName: 'rabbitmq-cluster-0',
    descriptionResource: 'Port: 5672/TCP',
    type: 'StatefulSet Pod',
    namespace: 'messaging',
    cpuRam: '61% / 85.6%',
    status: 'High',
  },
];

export default function Inventory() {
  const router = useRouter();

    return(
        <main className="relative flex flex-col min-h-full py-5 px-7">
            <TopBar/>
            <section className="flex items-center lg:gap-x-2 lg:pb-10 ">
                <ChevronLeft
                  className="inline cursor-pointer w-auto h-4 lg:h-7"
                  onClick={() => router.push("/private/monitor")}
                />
                <h1 className="inline font-bold text-xl">Inventory</h1>
            </section>
            <section className="flex justify-start w-full lg:gap-x-5">
                <HighlightBox
                    title="Kubernetes Nodes"
                    value="12"
                    description="12/12 Ready"
                    valueColor="text-black"
                    descriptionColor="text-warning-low"
                />
                <HighlightBox
                    title="Running Pods"
                    value="84"
                    description="2 Anomalous"
                    valueColor="text-black"
                    descriptionColor="text-warning-critical"
                />
                <HighlightBox
                    title="Microservices"
                    value="18"
                    description="4 Degraded"
                    valueColor="text-black"
                    descriptionColor="text-warning-high"
                />
                <HighlightBox
                    title="Namespaces"
                    value="6"
                    description="production, staging..."
                    valueColor="text-black"
                    descriptionColor="text-gray-400"
                />
            </section>
            <section>
                <TableDetail>
                    <section className="overflow-y-auto w-full h-full max-h-screen lg:space-y-2.5 lg:mt-5">
                        <div className="bg-[#F8FAFC] sticky top-0 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] w-full justify-center rounded-lg text-sm *:text-gray-400 *:font-semibold lg:py-3 lg:px-5">
                            <h1>RESOURCE NAME</h1>
                            <h1>TYPE</h1>
                            <h1>NAMESPACE</h1>
                            <h1>CPU / RAM</h1>
                            <h1>HEALTH STATUS</h1>
                            <h1>ACTION</h1>
                        </div>

                        { dummyInventoryData.map((data, index) => (
                            <div key={index} className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] w-full justify-center rounded-lg border ${getRowBackgroundColor(data.status)} lg:p-4`}>
                                <div className="flex flex-col justify-center md:space-y-1">
                                    <span className="text-sm font-bold">{data.resourceName}</span>
                                    <span className={`text-xs ${getDescriptionColor(data.status)}`}>{data.descriptionResource}</span>
                                </div>
                                <div className="flex flex-col justify-center md:space-y-1">
                                    <span className="text-sm text-gray-400">{data.type}</span>
                                </div>
                                <div className="flex flex-col justify-center md:space-y-1">
                                    <span className="text-sm text-gray-400">{data.namespace}</span>
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
                                    <span className="text-sm font-semibold text-blue-400">Inspect Detail →</span>
                                </div>
                            </div>
                        ))}
                    </section>
                </TableDetail>
            </section>
        </main>
    )
}