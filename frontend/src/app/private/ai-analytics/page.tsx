"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Paperclip,
  Settings,
  MoreVertical,
  ArrowUp,
  TrendingUp,
  Lightbulb,
  User,
} from "lucide-react";
import TopBar from "@/components/TopBar";

type MessageRole = "ai" | "user";

type ActionButton = {
  label: string;
  variant: "outline" | "primary" | "ghost";
};

type Message = {
  id: string;
  role: MessageRole;
  time: string;
  text: string;
  actions?: ActionButton[];
  proposedAction?: {
    command: string;
    confidence: number;
    recovery: string;
    policyGate: string;
  };
  highlights?: { phrase: string; color: string }[];
};


const DEMO_MESSAGES: Message[] = [
  {
    id: "m1",
    role: "ai",
    time: "15:09:45 UTC",
    text: "Halo! Saya mendeteksi insiden **INC-4082 (DB Connection Saturation)** pada kluster PostgreSQL Primary.\nDampak penyebaran saat ini menyebabkan lonjakan HTTP 504 pada **payment-service** dan **checkout-api**.\nApakah Anda ingin saya menampilkan ringkasan trace latency, mengisolasi pod penyebab, atau mengeksekusi simulasi dry-run?",
    highlights: [
      { phrase: "INC-4082 (DB Connection Saturation)", color: "text-blue-600 font-bold" },
      { phrase: "payment-service", color: "text-blue-500 font-semibold" },
      { phrase: "checkout-api", color: "text-blue-500 font-semibold" },
    ],
    actions: [
      { label: "Show Trace Breakdown", variant: "outline" },
      { label: "Run Dry-Run Simulation", variant: "outline" },
      { label: "Generate Incident Summary", variant: "outline" },
    ],
  },
  {
    id: "m2",
    role: "user",
    time: "15:21:08 UTC",
    text: "Kenapa query ke database bisa saturation dan apakah aman jika kita restart connection pool sekarang?",
  },
  {
    id: "m3",
    role: "ai",
    time: "15:25:14 UTC (Inference: 380ms)",
    text: "Berdasarkan korelasi log Loki dan metrik Prometheus:\n\n1. **Penyebab Saturation:** Terdapat lonjakan koneksi tidak tertutup (\"idle leak\") dari thread pool HikariCP di payment-service mencapai batas 100/100 socket.\n2. **Tingkat Keamanan Tindakan: AMAN (Low Risk / Blast Radius 2/12 Pods)**. Evaluasi dry-run membuktikan pod memiliki 3 replika aktif dan tidak akan menyebabkan downtime layanan utama.",
    highlights: [
      { phrase: "Penyebab Saturation:", color: "font-bold" },
      { phrase: "Tingkat Keamanan Tindakan:", color: "font-bold" },
      { phrase: "AMAN (Low Risk / Blast Radius 2/12 Pods)", color: "font-bold" },
    ],
    proposedAction: {
      command: "Kubectl rollout restart deployment/payment-service -n production",
      confidence: 98,
      recovery: "~2 mins",
      policyGate: "Pre-flight checks passed ✓",
    },
    actions: [
      { label: "✓ Approve & Execute", variant: "primary" },
      { label: "Simulate Dry-run", variant: "ghost" },
    ],
  },
  {
    id: "m4",
    role: "user",
    time: "15:29:02 UTC",
    text: "Tolong eksekusi perintah rollout restart sekarang dan verifikasi apakah latensi API kembali normal di bawah 60ms.",
  },
];


function RenderText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return (
          <span key={i}>
            {part.split("\n").map((line, j, arr) => (
              <span key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))}
          </span>
        );
      })}
    </>
  );
}


function ActionBtn({ label, variant }: ActionButton) {
  const base = "text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap";
  const styles =
    variant === "primary"
      ? `${base} bg-blue-600 text-white hover:bg-blue-700`
      : variant === "outline"
        ? `${base} border border-slate-300 text-slate-700 bg-white hover:bg-slate-50`
        : `${base} text-slate-600 hover:bg-slate-100`;
  return (
    <button type="button" className={styles}>
      {label}
    </button>
  );
}


function AiMessage({ msg }: { msg: Message }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a2f6e] to-[#2a4fbe] flex items-center justify-center flex-shrink-0 shadow-sm">
        <Image src='/akar-logo.png' alt="AKAR AI" className="w-5 h-5 object-contain" height={80} width={80}/>
      </div>

      <div className="flex-1 max-w-[82%]">
        <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-100 shadow-sm px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-slate-700">AKAR AI Copilot</span>
            <span className="text-[10px] text-slate-400">{msg.time}</span>
          </div>
          <p className="text-xs leading-6 text-slate-700">
            <RenderText text={msg.text} />
          </p>

          {msg.proposedAction && (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-bold text-slate-700 mb-1.5">
                Proposed Deterministic Action :
              </p>
              <p className="text-[11px] text-blue-600 font-medium font-mono mb-2 underline decoration-dotted cursor-pointer">
                {msg.proposedAction.command}
              </p>
              <p className="text-[10px] text-slate-500">
                Confidence <span className="font-semibold text-slate-700">{msg.proposedAction.confidence}%</span>
                {" · "}Estimated recovery:{" "}
                <span className="font-semibold text-slate-700">{msg.proposedAction.recovery}</span>
                {" · "}Policy Gate:{" "}
                <span className="text-emerald-600 font-semibold">{msg.proposedAction.policyGate}</span>
              </p>
            </div>
          )}

          {msg.actions && msg.actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {msg.actions.map((a) => (
                <ActionBtn key={a.label} {...a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function UserMessage({ msg }: { msg: Message }) {
  return (
    <div className="flex gap-3 items-start justify-end">
      <div className="max-w-[72%] rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-3 shadow-sm">
        <p className="text-xs leading-6 text-white">{msg.text}</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
        <User className="w-4 h-4 text-slate-500" />
      </div>
    </div>
  );
}


function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-12">
      <div className="w-32 h-32 flex items-center justify-center">
        <Image
          src='/akar-logo.png'
          alt="AKAR"
          className="w-28 h-28 object-contain drop-shadow-[0_0_24px_rgba(255,200,80,0.55)]"
          width={100}
          height={100}
        />
      </div>
      <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
        What can I help with today?
      </h2>
    </div>
  );
}


type ChatTab = "Analytics" | "Brainstorm";

function TabBar({ active, onChange }: { active: ChatTab; onChange: (t: ChatTab) => void }) {
  return (
    <div className="flex items-center gap-1 px-1 pb-1">
      <button
        type="button"
        onClick={() => onChange("Analytics")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          active === "Analytics"
            ? "text-slate-800 bg-slate-100"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
        }`}
      >
        Analytics
        <TrendingUp className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onChange("Brainstorm")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          active === "Brainstorm"
            ? "text-slate-800 bg-slate-100"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
        }`}
      >
        Brainstorm
        <Lightbulb className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}


function IncidentBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-white shadow-sm px-4 py-2.5 min-w-[280px] max-w-xs">
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-red-500 text-white tracking-wide">
            CRITICAL
          </span>
          <span className="text-xs font-semibold text-slate-800 truncate">
            INC-4082: Storage &amp; DB Connection Failure
          </span>
          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
        </div>
        <p className="text-[11px] text-slate-500">
          Detected 4 mins ago · Active for 15m 42s
        </p>
      </div>
    </div>
  );
}


export default function AiAnalytics() {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [activeTab, setActiveTab] = useState<ChatTab>("Analytics");
  const [started, setStarted]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
      text,
    };

    if (!started) {
      setMessages([...DEMO_MESSAGES, userMsg]);
      setStarted(true);
    } else {
      setMessages((prev) => [...prev, userMsg]);
    }
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function loadDemo() {
    setMessages(DEMO_MESSAGES);
    setStarted(true);
  }

  return (
    <main className="relative flex min-h-full flex-col">

      <TopBar />

      <div className="flex items-start justify-between gap-4 px-7 pt-5 pb-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">AI Investigator</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            AI-generated investigation summary based on structured RCA evidence
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <IncidentBanner />
        </div>
        <div className="w-40 hidden lg:block" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 sm:px-8 lg:px-16 xl:px-24 pb-4 space-y-5 min-h-0">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((msg) =>
              msg.role === "ai"
                ? <AiMessage key={msg.id} msg={msg} />
                : <UserMessage key={msg.id} msg={msg} />,
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      <div className="px-5 sm:px-8 lg:px-16 xl:px-24 pb-5 pt-2 flex-shrink-0">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
          <div className="px-3 pt-2">
            <TabBar active={activeTab} onChange={setActiveTab} />
          </div>

          <div className="flex items-end gap-2 px-4 py-3">
            <div className="flex items-center gap-1 flex-shrink-0 text-blue-500">
              <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
                <path d="M8 1l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10.1l-3.7 2.4 1.4-4.3L2 5.5h4.5z"/>
              </svg>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="flex-1 resize-none text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent leading-6 max-h-32"
              style={{ minHeight: 28 }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 transition-colors flex items-center justify-center shadow-sm"
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-100">
            <button type="button" className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 transition-colors">
              <Paperclip className="w-3.5 h-3.5" />
              Attach
            </button>
            <button type="button" className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 transition-colors">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
            <button type="button" className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 transition-colors">
              <MoreVertical className="w-3.5 h-3.5" />
              Options
            </button>
            {!started && (
              <button
                type="button"
                onClick={loadDemo}
                className="ml-auto text-[11px] text-blue-500 hover:underline font-medium"
              >
                Load demo conversation →
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
