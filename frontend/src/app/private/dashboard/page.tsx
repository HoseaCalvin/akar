"use client";

import ClusterDisc from "@/assets/cluster-cube.svg";

import { useState, useEffect } from "react";

import { Workflow, Server, Container, Database } from "lucide-react";

import type { EChartsOption } from "echarts";

import Image from "next/image";
import Link from "next/link";

import TopBar from "@/components/TopBar";
import EChart from "@/components/EChart";
import PageState from "@/components/PageState";
import DashboardOverview from "@/components/DashboardOverview";

import { getMilitaryTime } from "@/utils/helpers";

import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { endpoint } from "@/lib/endpoint";

import { ClusterSubsystems, Metrics, type Cluster, type Infrastructure, type Severity } from "@/lib/types";

const severityDot: any = {
  Critical: "bg-warning-critical",
  High: "bg-warning-high",
  Medium: "bg-warning-medium",
  Low: "bg-warning-low",
};

export default function Dashboard() {
  const [cluster, setCluster] = useState<Cluster[] | null>(null);
  const [clusterSubsystems, setClusterSubsystems] = useState<ClusterSubsystems | null>(null);
  const [infrastructure, setInfrastructure] = useState<Infrastructure | null>(null);
  const [metrics, setMetrics] = useState<Metrics[] | null>(null);
  const [averageMetrics, setAverageMetrics] = useState<Metrics | null>(null);
  const { data, loading, error } = useApi("dashboard", () => api.dashboard.get());

  useEffect(() => {
    const fetchInfrastructure = async () => {
      try {
        const infrastructureData = await endpoint.get<Infrastructure>(`/api/infrastructure/get/6477801f-7386-4758-aad2-cc3c53c69605`);

        setInfrastructure(infrastructureData.data);
      } catch (error) {
        setInfrastructure(null);
      }
    }

    const fetchAllClusterSubsystems = async () => {
      try {
        const allSubsystemsData = await endpoint.get<ClusterSubsystems>(`/api/cluster/all/get/31739a8c-22b9-455f-8952-1e0f85fe8dd1`);
        
        setClusterSubsystems(allSubsystemsData.data);
      } catch (error) {
        setClusterSubsystems(null);
      }
    }

    fetchInfrastructure();
    fetchAllClusterSubsystems();
  }, []);

  useEffect(() => {
    const fetchCluster = async () => {
      if(!infrastructure) {
        return;
      }

      try {
        const clusterData = await endpoint.get<Cluster[]>(`/api/cluster/get/31739a8c-22b9-455f-8952-1e0f85fe8dd1`);

        setCluster(clusterData.data);
      } catch (error) {
        setCluster(null);
      }
    }

    const fetchMetrics = async () => {
      if(!infrastructure) {
        return;
      }

      try {
        const metricsData = await endpoint.get<Metrics[]>(`/api/metrics/get/31739a8c-22b9-455f-8952-1e0f85fe8dd1`);

        setMetrics(metricsData.data);
      } catch (error) {
        setMetrics(null);
      }
    }

    const fetchAverageMetrics = async () => {
      if(!infrastructure) {
        return;
      }

      try {
        const averageMetrics = await endpoint.get<{ _avg: Metrics }>(`/api/metrics/avg/get/31739a8c-22b9-455f-8952-1e0f85fe8dd1`);

        setAverageMetrics(averageMetrics.data._avg);
      } catch (error) {
        setAverageMetrics(null);
      }
    }

    fetchCluster();
    fetchMetrics();
    fetchAverageMetrics();
  }, [infrastructure]);
  
  if (!data) {
    return (
      <main className="main-container">
        <TopBar />
        <PageState loading={loading} error={error} empty={!loading} />
      </main>
    );
  }

  const infrastructureHealthData: EChartsOption = {
    tooltip: { trigger: "item", formatter: "{b}: {d}%" },
    series: [
      {
        name: "Pod Status",
        type: "pie",
        radius: ["50%", "70%"],
        data: [
          { value: 100 - (infrastructure?.health || 0), itemStyle: { color: "transparent" } },
          { value: infrastructure?.health || 0 },
        ],
      },
    ],
  };

  const performanceData: EChartsOption = {
    tooltip: { trigger: "axis" },
    grid: { left: 45, right: 20, top: 30, bottom: 50 },
    xAxis: {
      type: "category",
      data: metrics?.map((metric) => getMilitaryTime(metric.time)),
    },
    yAxis: {
      type: "value",
      max: 100,
      axisLabel: { formatter: "{value}" },
    },
    series: [
      {
        name: "MTTD",
        type: "line",
        smooth: true,
        data: metrics?.map((metric) => metric.mttd),
      },
      {
        name: "MTTR",
        type: "line",
        smooth: true,
        data: metrics?.map((metric) => metric.mttr),
      },
      {
        name: "RCA Time",
        type: "line",
        smooth: true,
        data: metrics?.map((metric) => metric.rca_time),
      },
    ],
  };

  const firstIncidentId = data.recentIncidents[0]?.id;

  return (
    <main className="main-container">
      <TopBar />
      <section className="space-y-1 shrink-0">
        <h1 className="font-semibold text-lg">Good Morning, {data.greetingName}</h1>
        <p>Here&apos;s what is happening with your infrastructure.</p>
      </section>
      <section className="grid grid-cols-[repeat(4,1fr)] grid-rows-[repeat(8,100px)] min-h-full flex-1 gap-3 mt-5">
        <aside className="row-start-1 row-span-1 col-start-1 col-span-4 rounded-xl p-3 h-full">
          <div className="flex justify-around items-center w-full h-full xl:px-4.5">
            <DashboardOverview 
              icon={
                <Workflow 
                  className="bg-blue-100 w-auto h-12 rounded-lg p-1.5" 
                  fill="#0045FF" 
                  stroke="#FFF" 
                  strokeWidth={1.5} 
                />
              } 
              value={clusterSubsystems?.node_count || 0} 
              label="Nodes" 
            />
            <DashboardOverview 
              icon={
                <Server 
                  className="bg-green-100 w-auto h-12 rounded-lg p-1.5" 
                  fill="#12B200" 
                  strokeWidth={1.5} 
                  stroke="#FFF" 
                />
              } 
              value={clusterSubsystems?.pod_count || 0} 
              label="Pods" 
            />
            <DashboardOverview 
              icon={
                <Container 
                  className="bg-purple-100 w-auto h-12 rounded-lg p-1.5" 
                  fill="#6C00B4" 
                  strokeWidth={1.5} 
                  stroke="#FFF" 
                />
              } 
              value={clusterSubsystems?.container_count || 0} 
              label="Containers" 
            />
            <DashboardOverview 
              icon={
                <Database 
                  className="bg-yellow-100 w-auto h-12 rounded-lg p-1.5" 
                  fill="#FFC72D" 
                  strokeWidth={1.5} 
                  stroke="#FFF" 
                />
              } 
              value={clusterSubsystems?.service_count || 0}
              label="Services" 
            />
          </div>
        </aside>
        <aside className="row-start-2 row-span-4 col-start-1 col-span-3 glass-effect-2 rounded-xl p-3 h-full">
          <h1 className="font-semibold lg:text-base">Infrastructure Nodes</h1>
          <article className="flex justify-around items-center w-full h-full overflow-x-auto xl:px-4.5">
            { cluster && cluster.length > 0 ? (
              cluster.map((clusterItem, index) => (
                <div key={index}>
                  <figure>
                    <h1 className="w-full text-center font-semibold p-1 lg:text-xl">Cluster {index + 1}</h1>
                    <Image
                      src={ClusterDisc}
                      className="h-[5rem] w-auto lg:h-[13rem] xl:h-[16rem]"
                      alt="Cluster"
                      width={80}
                      height={80}
                    />
                  </figure>
                  <figure className="flex items-center justify-around w-full p-2 lg:p-3.5">
                    <div>
                      <div className="flex items-center gap-x-1 lg:gap-x-2">
                        <Server 
                          className="w-auto h-8 rounded-lg" 
                          fill="#12B200" 
                          stroke="transparent" 
                          strokeWidth={1} 
                        />
                        <h2 className="font-semibold">{clusterItem.pod_count}</h2>
                      </div>
                      <h3 className="p-0.5 text-sm lg:p-1">Pods</h3>
                    </div>
                    <div>
                      <div className="flex items-center gap-x-1 lg:gap-x-2">
                        <Container 
                          className="w-auto h-8 rounded-lg" 
                          fill="#6C00B4" 
                          stroke="transparent" 
                          strokeWidth={1} 
                        />         
                        <h2 className="font-semibold">{clusterItem.container_count}</h2>         
                      </div>
                      <h3 className="p-0.5 text-sm lg:p-1">Containers</h3>
                    </div>
                    <div>
                      <div className="flex items-center gap-x-1 lg:gap-x-2">
                        <Database 
                          className="w-auto h-8 rounded-lg" 
                          fill="#FFC72D" 
                          stroke="transparent" 
                          strokeWidth={1} 
                        />
                        <h2 className="font-semibold">{clusterItem.service_count}</h2>
                      </div>
                      <h3 className="p-0.5 text-sm lg:p-1">Services</h3>
                    </div>
                  </figure>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <p className="text-gray-500">No cluster data available.</p>
              </div>
            )}
          </article>
        </aside>
        <aside className="row-start-2 row-span-4 col-start-4 col-span-1 glass-effect-2 rounded-xl p-3">
          <h1 className="font-semibold lg:text-base">Recent Incidents</h1>
          <div className="lg:space-y-2.5 lg:pt-3">
            {data.recentIncidents.map((incident) => (
              <Link
                key={incident.id}
                href={`/private/incidents/${incident.id}`}
                className="flex flex-wrap items-center lg:gap-x-3.5"
              >
                <figure className={`w-3 h-3 ${severityDot[incident.severity.name]} rounded-full`} />
                <div>
                  <h2 className="font-semibold">{incident.title}</h2>
                  <h3 className="text-sm">{incident.service}</h3>
                </div>
              </Link>
            ))}
            <Link
              href="/private/incidents"
              className="text-sm text-blue-500 cursor-pointer hover:underline"
            >
              View All Incidents
            </Link>
          </div>
        </aside>
        <aside className="row-start-6 row-span-3 col-start-1 col-span-2 glass-effect-2 rounded-xl p-3">
          <h1 className="font-semibold lg:text-base">Infrastructure Health</h1>
          <div className="flex justify-center items-center w-full h-full gap-x-4 lg:gap-x-6">
            <div className="w-1/2 h-full">
              <EChart option={infrastructureHealthData} />
            </div>
            <div className="flex flex-col justify-center w-1/5 h-full lg:space-y-3">
              <h2 className="text-center font-semibold lg:text-4xl">{infrastructure?.health || 0}%</h2>
              <h3 className="text-center font-semibold text-green-600 lg:text-2xl">Healthy</h3>
            </div>
          </div>
        </aside>
        <aside className="row-start-6 row-span-3 col-start-3 col-span-1 glass-effect-2 rounded-xl p-3">
          <h1 className="font-semibold lg:text-base">Performance Metrics</h1>
          <div className="flex justify-center items-center h-1/3 lg:gap-x-5 xl:px-4">
            <div className="*:text-center">
              <h2>
                <strong className="text-xl">{averageMetrics?.mttd || 0}</strong> min
              </h2>
              <h3 className="text-xs">MTTD</h3>
            </div>
            <div className="*:text-center">
              <h2>
                <strong className="text-xl">{averageMetrics?.mttr || 0}</strong> min
              </h2>
              <h3 className="text-xs">MTTR</h3>
            </div>
            <div className="*:text-center">
              <h2>
                <strong className="text-xl">{averageMetrics?.rca_time || 0}</strong> min
              </h2>
              <h3 className="text-xs">RCA Time</h3>
            </div>
          </div>
          <div className="h-2/3">
            <EChart option={performanceData} />
          </div>
        </aside>
        <aside className="row-start-6 row-span-3 col-start-4 col-span-1 glass-effect-2 rounded-xl flex flex-col h-full lg:p-3 lg:pb-7">
          <h1 className="font-semibold text-base">Active Investigations</h1>
          <div className="flex justify-center items-center h-screen xl:px-5 xl:mt-3 xl:gap-x-2">
            <div>
              <h1 className="text-center font-bold leading-none xl:text-6xl">{data.activeInvestigations}</h1>
              <h2 className="text-center lg:leading-12 lg:text-3xl">Active</h2>
            </div>
          </div>
          <Link
            href={firstIncidentId ? `/private/incidents/${firstIncidentId}/investigation` : "/private/incidents"}
            aria-label="Investigate"
            className="bg-blue-950 block mx-auto text-white cursor-pointer w-[85%] text-center animate hover:bg-blue-900 lg:py-1 lg:px-6 lg:mt-1 lg:rounded-xl"
          >
            Go Investigate
          </Link>
        </aside>
      </section>
    </main>
  );
}