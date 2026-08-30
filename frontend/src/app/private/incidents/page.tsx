"use client";

import IncidentCard from "@/components/IncidentCard";
import TopBar from "@/components/TopBar";

export default function Incidents() {
    return(
        <main className="main-container">
            <TopBar/>
            <section className="space-y-1 shrink-0">
                <h1 className="font-semibold text-lg">2D Spatial Topology & Incident Queue</h1>
            </section>
            <section className="flex w-full flex-1 min-h-0 py-5">
                <section className="w-1/2">
                    <select name="" id="" className="bg-white p-1.5">
                        <option value="Worker1">Worker 1</option>
                        <option value="Worker2">Worker 2</option>
                    </select>
                </section>
                <section className="w-1/2 flex flex-col min-h-0">
                    <div className="flex gap-x-2.5 pt-3.5 lg:gap-x-5 shrink-0">
                        <header className="bg-white py-1 px-4 rounded-lg shadow-md cursor-pointer">Pods</header>
                        <header className="bg-white py-1 px-4 rounded-lg shadow-md cursor-pointer">Services</header>
                    </div>
                    <div className="rounded-2xl flex-1 min-h-0 lg:p-4">
                        <div className="flex justify-between">
                            <header className="flex items-center gap-x-3">
                                <h1 className="font-bold leading-0 lg:text-lg">Pods Incidents</h1>
                                <p className="leading-0 text-sm">2 Active Incidents</p>
                            </header>
                            <span className="text-sm shadow-md rounded-lg lg:py-1 lg:px-4">View More</span>
                        </div>
                        <div className="lg:py-3 lg:space-y-3">
                            <IncidentCard 
                                id=""
                                level="Critical"
                                isActive={true}
                            />
                            <IncidentCard 
                                id=""
                                level="High"
                                isActive={false}
                            />
                            <IncidentCard 
                                id=""
                                level="Low"
                                isActive={false}
                            />
                        </div>
                        <div className="bg-white rounded-lg lg:px-3 lg:py-2 lg:mt-5 lg:rounded-2xl">
                            <section className="flex lg:gap-x-3">
                                <h1 className="p-2">Details</h1>
                                <h1 className="p-2">Metrics</h1>
                                <h1 className="p-2">Events</h1>
                                <h1 className="p-2">Logs</h1>
                            </section>
                            <section className="space-y-2">
                                <div className="flex items-center w-full gap-x-3 lg:gap-x-5">
                                    <h1 className="text-sm font-bold">order-svc-4082</h1>
                                    <h2 className="text-xs font-semibold px-2 py-1 rounded-xl bg-warning-critical/10 text-warning-critical">Active Incident</h2>
                                </div>
                                <div>
                                    <div className="flex items-center lg:gap-x-1">
                                        <div className="flex items-center lg:gap-x-2">
                                            <figure className="w-2 h-2 bg-gray-400 rounded-full"></figure>
                                            <p className="text-sm text-gray-500">Namespace: </p>
                                        </div>
                                        <span className="text-sm text-gray-600">default</span>
                                    </div>
                                    <div className="flex items-center lg:gap-x-1">
                                        <div className="flex items-center lg:gap-x-2">
                                            <figure className="w-2 h-2 bg-gray-400 rounded-full"></figure>
                                            <p className="text-sm text-gray-500">Node:</p>
                                        </div>
                                        <span className="text-sm text-gray-600">worker-01</span>
                                    </div>
                                    <div className="flex items-center lg:gap-x-1">
                                        <div className="flex items-center lg:gap-x-2">
                                            <figure className="w-2 h-2 bg-gray-400 rounded-full"></figure>
                                            <p className="text-sm text-gray-500">Created:</p>
                                        </div>
                                        <span className="text-sm text-gray-600">May 16, 2025 10:24:17</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    )
}