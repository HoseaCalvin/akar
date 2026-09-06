"use client";

import { Download, Share2 } from "lucide-react";

export default function ActBtn() {
    const handleExport = () => {
        console.log("Export clicked");
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: "Incident Timeline",
                text: "Incident Timeline",
            });
        }
    };

    return (
        <section className="absolute top-9 right-15 flex items-center gap-2">
            <button
                type="button"
                onClick={handleExport}
                className="
                    flex h-10 w-28
                    sm:h-10 sm:w-30
                    lg:h-[42px] lg:w-[120px]
                    items-center justify-center gap-2
                    rounded-xl
                    border border-[#E1E1E1]
                    bg-white
                    text-[#60708D]
                    transition-all
                    hover:bg-[#F8F9FB]
                    active:scale-95
                "
            >
                <Download
                    className="h-[18px] w-[18px]"
                    strokeWidth={2.2}
                />

                <span className="text-[15px] font-medium">
                    Export
                </span>
            </button>

            <button
                type="button"
                onClick={handleShare}
                className="
                    flex h-10 w-28
                    sm:h-10 sm:w-30
                    lg:h-[42px] lg:w-[120px]
                    items-center justify-center gap-2
                    rounded-xl
                    bg-[#7B9AF2]
                    text-white
                    transition-all
                    hover:bg-[#6F90EB]
                    active:scale-95
                "
            >
                <Share2
                    className="h-[18px] w-[18px]"
                    strokeWidth={2.2}
                />

                <span className="text-[15px] font-medium">
                    Share
                </span>
            </button>
        </section>
    );
}