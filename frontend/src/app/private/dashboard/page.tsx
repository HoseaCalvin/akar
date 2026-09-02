"use client";

import { Workflow, Server, Container, Database } from "lucide-react";

import type { EChartsOption } from 'echarts';

import TopBar from "@/components/TopBar";
import EChart from "@/components/EChart";

export default function Dashboard() {
    const infrastructureHealthData: EChartsOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {d}%',
        },
        series: [
            {
                name: 'Pod Status',
                type: 'pie',
                radius: ['45%', '70%'],
                data: [
                    { name: 'Critical', value: 20 },
                    { name: 'High', value: 30 },
                    { name: 'Low', value: 50 },
                ],
                label: {
                    formatter: '{b}: {d}%',
                },
            },
        ],
    };

    const performanceData: EChartsOption = {
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            left: 45,
            right: 20,
            top: 30,
            bottom: 50,
        },
        xAxis: {
            type: 'category',
            data: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
        },
        yAxis: {
            type: 'value',
            max: 100,
            axisLabel: {
                formatter: '{value}%',
            },
        },
        series: [
            {
                name: 'CPU',
                type: 'line',
                smooth: true,
                data: [42, 55, 48, 67, 73, 61],
            },
            {
                name: 'RAM',
                type: 'line',
                smooth: true,
                data: [65, 68, 72, 78, 81, 76],
            },
        ],
    };

    return(
        <main className="main-container">
            <TopBar/>
            <section className="space-y-1 shrink-0">
                <h1 className="font-semibold text-lg">Good Morning, Zick</h1>
                <p className="">Here&apos;s what is happening with your infrastructure.</p>
            </section>
            <section className="grid grid-cols-[repeat(4,1fr)] grid-rows-[repeat(8,100px)] min-h-full flex-1 gap-3 mt-5">
                <aside className="row-start-1 row-span-1 col-start-1 col-span-4 rounded-xl p-3 h-full">
                    <div className="flex justify-around items-center w-full h-full xl:px-4.5">
                        <section className="flex items-center glass-effect gap-x-3 rounded-xl lg:py-4 lg:px-6">
                            <Workflow
                                className="bg-blue-100 w-auto h-12 rounded-lg p-1.5"
                                fill="#0045FF"
                                stroke="#FFF"
                                strokeWidth={1.5}
                            />
                            <div>
                                <p className="font-bold text-xl leading-none">12</p>
                                <p className="font-semibold leading-6">Nodes</p>
                            </div>
                        </section>
                        <section className="flex items-center glass-effect gap-x-3 rounded-xl lg:py-4 lg:px-6">
                            <Server
                                className="bg-green-100 w-auto h-12 rounded-lg p-1.5"
                                fill="#12B200"
                                strokeWidth={1.5}
                                stroke="#FFF"
                            />
                            <div>
                                <p className="font-bold text-xl leading-none">12</p>
                                <p className="font-semibold leading-6">Pods</p>
                            </div>
                        </section>
                        <section className="flex items-center glass-effect gap-x-3 rounded-xl lg:py-4 lg:px-6">
                            <Container
                                className="bg-purple-100 w-auto h-12 rounded-lg p-1.5"
                                fill="#6C00B4"
                                strokeWidth={1.5}
                                stroke="#FFF"
                            />
                            <div>
                                <p className="font-bold text-xl leading-none">12</p>
                                <p className="font-semibold leading-6">Containers</p>
                            </div>
                        </section>
                        <section className="flex items-center glass-effect gap-x-3 rounded-xl lg:py-4 lg:px-6">
                            <Database
                                className="bg-yellow-100 w-auto h-12 rounded-lg p-1.5"
                                fill="#FFC72D"
                                strokeWidth={1.5}
                                stroke="#FFF"
                            />
                            <div>
                                <p className="font-bold text-xl leading-none">12</p>
                                <p className="font-semibold leading-6">Services</p>
                            </div>
                        </section>
                    </div>
                </aside>
                <aside className="row-start-2 row-span-4 col-start-1 col-span-3 glass-effect-2 rounded-xl p-3 h-full">
                    <h1 className="font-semibold lg:text-base">Infrastructure Nodes</h1>
                </aside>
                <aside className="row-start-2 row-span-4 col-start-4 col-span-1 glass-effect-2 rounded-xl p-3">
                    <h1 className="font-semibold lg:text-base">Recent Incidents</h1>
                    <div className="lg:space-y-2.5 lg:pt-3">
                        <div className="flex flex-wrap items-center lg:gap-x-3.5">
                            <figure className="w-3 h-3 bg-warning-critical rounded-full"></figure>
                            <div>
                                <h2 className="font-semibold">Spiking storage usage</h2>
                                <h3 className="text-sm">payment-service</h3>
                            </div>
                        </div>
                        <div className="flex items-center lg:gap-x-3.5">
                            <figure className="w-3 h-3 bg-warning-high rounded-full"></figure>
                            <div>
                                <h2 className="font-semibold">Spiking storage usage</h2>
                                <h3 className="text-sm">payment-service</h3>
                            </div>
                        </div>
                        <div className="flex items-center lg:gap-x-3.5">
                            <figure className="w-3 h-3 bg-warning-critical rounded-full"></figure>
                            <div>
                                <h2 className="font-semibold">Spiking storage usage</h2>
                                <h3 className="text-sm">payment-service</h3>
                            </div>
                        </div>
                        <div className="flex items-center lg:gap-x-3.5">
                            <figure className="w-3 h-3 bg-warning-low rounded-full"></figure>
                            <div>
                                <h2 className="font-semibold">Spiking storage usage</h2>
                                <h3 className="text-sm">payment-service</h3>
                            </div>
                        </div>
                        <button 
                            className="text-sm text-blue-500 cursor-pointer hover:underline"
                        >
                            View All Incidents
                        </button>  
                    </div>
                </aside>
                <aside className="row-start-6 row-span-3 col-start-1 col-span-2 glass-effect-2 rounded-xl p-3">
                    <h1 className="font-semibold lg:text-base">Infrastructure Health</h1>
                    <div className="flex justify-center items-center w-full h-full gap-x-4 lg:gap-x-6">
                        <div className="w-2/3 h-full">
                            <EChart 
                                option={infrastructureHealthData} 
                            />
                        </div>
                        <div className="flex flex-col justify-center w-1/3 h-full lg:space-y-3">
                            <h2 className="text-center font-semibold lg:text-4xl">64.24%</h2>
                            <h3 className="text-center font-semibold text-green-600 lg:text-2xl">Healthy</h3>
                        </div>
                    </div>
                </aside>
                <aside className="row-start-6 row-span-3 col-start-3 col-span-1 glass-effect-2 rounded-xl p-3">
                    <h1 className="font-semibold lg:text-base">Performance Metrics</h1>
                    <div className="flex justify-center items-center h-1/3 lg:gap-x-5 xl:gap-x-8 xl:px-4">
                        <div className="*:text-center">
                            <h2><strong className="text-xl">2.4</strong> min</h2>
                            <h3 className="text-xs">MTTD</h3>
                        </div>
                        <div className="*:text-center">
                            <h2><strong className="text-xl">47</strong> min</h2>
                            <h3 className="text-xs">MTTR</h3>
                        </div>
                        <div className="*:text-center">
                            <h2><strong className="text-xl">47</strong> min</h2>
                            <h3 className="text-xs">RCA Time</h3>
                        </div>
                    </div>
                    <div className="h-2/3">
                        <EChart
                            option={performanceData}
                        />
                    </div>
                </aside>
                <aside className="row-start-6 row-span-3 col-start-4 col-span-1 glass-effect-2 rounded-xl flex flex-col h-full lg:p-3 lg:pb-7">
                    <h1 className="font-semibold text-base">Active Investigations</h1>
                    <div className="flex justify-center items-center h-screen xl:px-5 xl:mt-3 xl:gap-x-2">
                        <div>
                            <h1 className="text-center font-bold leading-none xl:text-6xl">2</h1>
                            <h2 className="text-center lg:leading-12 lg:text-3xl">Active</h2>
                        </div>
                    </div>
                    <button
                        aria-label="Investigate"
                        className="bg-blue-950 block mx-auto text-white cursor-pointer w-[85%] animate hover:bg-blue-900 lg:py-1 lg:px-6 lg:mt-1 lg:rounded-xl"
                    >
                        Go Investigate
                    </button>
                </aside>
            </section>
        </main>
    )
}