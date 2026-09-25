"use client";

import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";


const DESKTOP_MIN_WIDTH = 1024;

export default function MobileGuard({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [checked, setChecked]   = useState(false);

  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < DESKTOP_MIN_WIDTH);
      setChecked(true);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!checked) return null;

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#eef2fb] to-white px-8 text-center">


        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a2f6e]/10">
          <Monitor className="h-8 w-8 text-[#1a2f6e]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">
            Desktop Only
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
            AKAR is optimised for desktop use. Please open this app on a
            laptop or desktop with a screen width of at least 1024 px.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
