"use client";

import AkarLogo from "../../../../public/akar.png";

import { useState } from "react";

import TopBar from "@/components/TopBar";

import { Message } from "@/lib/types";

import { ChartNoAxesColumn, Lightbulb, Logs, MoveUp, Paperclip, Settings } from "lucide-react";
import Image from "next/image";

export default function AiAnalytics() {
    const [chat, setChat] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    const sendPrompt = () => {
        const content = chat.trim();

        if (!content) {
            return;
        }

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content,
            },
        ]);

        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: `Halo! Saya mendeteksi insiden INC-4082 (DB Connection Saturation) pada kluster PostgreSQL Primary. 
                Dampak penyebaran saat ini menyebabkan lonjakan HTTP 504 pada payment-service dan checkout-api.
                Apakah Anda ingin saya menampilkan ringkasan trace latency, mengisolasi pod penyebab, atau mengeksekusi simulasi dry-run?`,
            },
        ]);

        setChat('');
    }

    return(
        <main className="main-container h-screen flex flex-col overflow-hidden">
            <TopBar />
            <section className="space-y-1 shrink-0">
                <h1 className="font-semibold text-lg">AI Investigator</h1>
                <p>AI-generated investigation summary based on structured RCA evidence.</p>
            </section>
            <section className="flex-1 min-h-0 flex flex-col">
                <section className="flex-1 min-h-0 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="flex flex-col items-center text-center -translate-y-8">
                                <div className="mb-6">
                                    <Image
                                        src={AkarLogo}
                                        alt="Akar Logo"
                                        width={50}
                                        height={50}
                                        className="w-[7rem] h-[7rem] lg:h-[12rem] lg:w-[12rem]"
                                    />
                                </div>

                                <h2 className="text-3xl font-medium tracking-tight">
                                    What can I help with today?
                                </h2>
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto w-full max-w-5xl space-y-6 py-6">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={
                                        message.role === "user"
                                            ? "flex justify-end"
                                            : "flex justify-center"
                                    }
                                >
                                    <div
                                        className={ 
                                            message.role === "user" 
                                                ? "max-w-[80%] rounded-2xl bg-blue-600 px-4 py-3 text-white"
                                                : "max-w-[80%] rounded-2xl  px-4 py-3"
                                        }
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                <section className="space-y-1 shrink-0">
                    <div className="flex md:gap-x-3">
                        <button
                            type="button"
                            aria-label="Analytics"
                            className="flex items-center text-xs gap-x-2 cursor-pointer py-1 px-2.5 my-1 rounded-md hover:bg-white/20 md:text-sm"
                        >
                            Analytics
                            <ChartNoAxesColumn
                                className="w-4 h-4"
                            />
                        </button>
                        <button
                            type="button"
                            aria-label="Brainstorm"
                            className="flex items-center text-xs gap-x-2 cursor-pointer py-1 px-2.5 my-1 rounded-md hover:bg-white/20 md:text-sm"
                        >
                            Brainstorm
                            <Lightbulb
                                className="w-4 h-4"
                            />
                        </button>
                    </div>
                    <div className="bg-white w-full rounded-md p-1.5 focus:ring-2 focus:ring-blue-400 lg:rounded-2xl">
                        <div className="flex items-center lg:px-3">
                            <textarea 
                                value={chat}
                                onChange={(event) => setChat(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" && !event.shiftKey) {
                                        event.preventDefault();
                                        sendPrompt();
                                    }
                                }}
                                placeholder="Ask me anything..."
                                className="resize-none text-sm p-1 h-fit w-full rounded-md focus:outline-0 lg:rounded-lg lg:p-2"
                            />
                            <button
                                type="button"
                                aria-label="Send"
                                className="bg-blue-800 flex-1 cursor-pointer h-fit rounded-lg animate hover:bg-blue-900"
                            >
                                <MoveUp
                                    className="w-7 h-7 lg:py-2.5 lg:px-2 lg:h-10 lg:w-11"
                                    stroke="#FFF"
                                />
                            </button>
                        </div>
                        <div className="flex px-3 pb-3 lg:gap-x-5">
                            <button
                                type="button"
                                aria-label="Attach"
                                className="flex items-center text-xs gap-x-2 text-gray-500 cursor-pointer leading-none md:text-sm"                    
                            >
                                <Paperclip
                                    className="w-3.5 h-3.5"
                                />
                                Attach
                            </button>
                            <button
                                type="button"
                                aria-label="Settings"
                                className="flex items-center text-xs gap-x-2 text-gray-500 cursor-pointer leading-none md:text-sm"                    
                            >
                                <Settings
                                    className="w-3.5 h-3.5"                            
                                />
                                Settings
                            </button>
                            <button
                                type="button"
                                aria-label="Options"
                                className="flex items-center text-xs gap-x-2 text-gray-500 cursor-pointer leading-none md:text-sm"                    
                            >
                                <Logs
                                    className="w-3.5 h-3.5" 
                                />
                                Options
                            </button>
                        </div>
                    </div>    
                </section>
            </section>
        </main>
    )
}