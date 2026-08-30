"use client";

import TopBar from "@/components/TopBar";

export default function Monitor() {
    return(
        <main className="relative flex flex-col min-h-full py-5 px-7">
            <TopBar/>
            <section className="space-y-1 shrink-0">
                <h1 className="font-semibold text-lg">Infrastructure Topology</h1>
                <p className="">Click each directory to see details.</p>
            </section>
            <section className="flex flex-col w-full h-full lg:px-5 lg:pt-6 lg:gap-y-4">
                <figure className="flex justify-center items-center min-h-screen flex-1 rounded-2xl filter-[drop-shadow(4px_-4px_10px_#3450EF40)_drop-shadow(0_4px_10px_#0026A240)] bg-linear-to-b from-white to-[#CEDBFF]">
                    (I'll implement 2D visualization using ReactFlow here, later) <br />
                    (To access details, copy this URL -&gt; http://localhost:3000/private/monitor/inventory)
                </figure>
                <legend className="flex justify-around w-full rounded-2xl shadow-[10px_4px_10px_0_rgba(0,38,162,0.2),0_8px_10px_0_rgba(0,38,162,0.15)] lg:py-3 lg:px-5">
                    <div className="flex items-center gap-x-2">
                        <span className="h-5 w-5 rounded-full bg-warning-critical"></span>
                        <p className="font-semibold lg:text-xl">Critical</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <span className="h-5 w-5 rounded-full bg-warning-high"></span>
                        <p className="font-semibold lg:text-xl">High</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <span className="h-5 w-5 rounded-full bg-warning-medium"></span>
                        <p className="font-semibold lg:text-xl">Medium</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <span className="h-5 w-5 rounded-full bg-warning-low"></span>
                        <p className="font-semibold lg:text-xl">Low</p>
                    </div>
                </legend>
            </section>     
        </main>
    )
}