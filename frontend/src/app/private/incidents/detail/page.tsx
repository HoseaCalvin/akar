import TopBar from "@/components/TopBar";
import { ChevronLeft, Download, Share2 } from "lucide-react";

export default function IncidentDetail() {
    return(
        <main className="main-container">
            <TopBar/>
            <section className="flex items-center space-y-1 shrink-0 gap-x-3 lg:gap-x-5">
                <div className="flex items-center lg:gap-x-4">
                    <ChevronLeft
                        className="inline w-auto h-7 cursor-pointer"
                    />
                    <h1 className="inline font-bold text-lg">INC-4082</h1>
                    <h1 className="inline font-semibold text-lg">Storage & DB Conn Failure</h1>
                </div>
                <div className="flex items-center gap-x-2 lg:gap-x-3">
                    <button
                        type="button"
                        aria-label="Export"
                        className="flex items-center bg-white border border-gray-400 rounded-lg cursor-pointer gap-x-1 py-1 px-3 font-semibold text-xs text-gray-500 lg:py-1.5 lg:px-4 lg:gap-x-2"
                    >
                        <Download
                            className="text-gray-500 w-auto h-4"
                        />
                        Export
                    </button>
                    <button
                        type="button"
                        aria-label="Export"
                        className="flex items-center bg-indigo-400 border border-indigo-500 rounded-lg cursor-pointer gap-x-1 py-1 px-3 font-semibold text-xs text-white lg:py-1.5 lg:px-4 lg:gap-x-2"
                    >
                        <Share2
                            className="text-white w-auto h-4"
                            fill="white"
                        />
                        Share
                    </button>
                </div>
            </section>
            <section className="flex justify-around w-full *:text-sm mt-5 lg:mt-7">
                <div>
                    <h1 className="font-bold">Status</h1>
                    <h2 className="font-semibold">Recovered</h2>
                </div>
                <div>
                    <h1 className="font-bold">Severity</h1>
                    <h2 className="font-semibold">Critical</h2>
                </div>
                <div>
                    <h1 className="font-bold">Duration</h1>
                    <h2 className="font-semibold">23m 14s</h2>
                </div>
                <div>
                    <h1 className="font-bold">Start Time</h1>
                    <h2 className="font-semibold">23m 14s</h2>
                </div>
                <div>
                    <h1 className="font-bold">End Time</h1>
                    <h2 className="font-semibold">23m 14s</h2>
                </div>
                <div>
                    <h1 className="font-bold">Affected Service</h1>
                    <h2 className="font-semibold">pymt-svc</h2>
                </div>
            </section>
            <section className="bg-linear-to-r from-white to-white/0 h-screen rounded-lg lg:rounded-2xl lg:mt-5">

            </section>
        </main>
    )
}