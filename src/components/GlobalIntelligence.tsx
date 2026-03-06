"use client";

import React, { useState, useEffect } from 'react';
import { Tv, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

const CHANNEL_IDS = [
    { id: "UCNye-wNBqNL5ZzHSJj3l8Bg", name: "AL JAZEERA (ENG)", type: "channel" },
    { id: "UCfiwzLy-8yKzIbsmZTzxDgw", name: "AL JAZEERA (AR)", type: "channel" },
    { id: "_03-Efdda7s", name: "ABC NEWS", type: "video" },
    { id: "UCIALMKvObZNtJ6AmdCLP7Lg", name: "BLOOMBERG", type: "channel" },
    { id: "6SDfqvJaCQM", name: "SKY NEWS", type: "video" },
    { id: "LuKwFajn37U", name: "DW NEWS", type: "video" },
];

export default function GlobalIntelligence() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [autoCycle, setAutoCycle] = useState(true);

    useEffect(() => {
        if (!isOpen || !autoCycle) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % CHANNEL_IDS.length);
        }, 60000);

        return () => clearInterval(interval);
    }, [isOpen, autoCycle]);

    const handlePrevious = () => {
        setAutoCycle(false);
        setCurrentIndex((prev) => (prev - 1 + CHANNEL_IDS.length) % CHANNEL_IDS.length);
    };

    const handleNext = () => {
        setAutoCycle(false);
        setCurrentIndex((prev) => (prev + 1) % CHANNEL_IDS.length);
    };

    const toggleAutoCycle = () => {
        setAutoCycle(!autoCycle);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* The Popup Monitor */}
            {isOpen && (
                <div
                    className="mb-4 w-[28vw] min-w-[340px] border border-[#22c55e]/30 bg-[#0a0f12] shadow-[0_0_15px_rgba(34,197,94,0.1)] overflow-hidden flex flex-col rounded-sm relative"
                >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#22c55e]/50" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#22c55e]/50" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#22c55e]/50" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#22c55e]/50" />

                    {/* Header */}
                    <div className="flex items-center justify-between bg-[#111820] border-b border-[#22c55e]/30 px-3 py-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                            <span className="text-[#22c55e] text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase">
                                Live Geopolitical Feed
                            </span>
                        </div>
                        <div className="text-[10px] text-[#22c55e]/70 font-mono flex items-center gap-2">
                            <button
                                onClick={toggleAutoCycle}
                                className={`px-1.5 py-0.5 border ${autoCycle ? 'border-[#22c55e]/50 text-[#22c55e]' : 'border-zinc-700 text-zinc-500'} hover:bg-[#22c55e]/10 transition-colors uppercase`}
                                title="Toggle 60s Auto-Cycle"
                            >
                                SYNC {autoCycle ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    </div>

                    {/* Action Bar (Channel switching) */}
                    <div className="flex items-center justify-between bg-[#0a0f12] px-2 py-1.5 border-b border-[#22c55e]/20">
                        <button
                            onClick={handlePrevious}
                            className="p-1 text-[#22c55e]/80 hover:text-[#22c55e] hover:bg-[#22c55e]/10 rounded transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex-1 text-center font-mono text-[11px] text-[#22c55e] tracking-wider">
                            TX-NODE: <span className="text-white">{CHANNEL_IDS[currentIndex].name}</span>
                        </div>
                        <button
                            onClick={handleNext}
                            className="p-1 text-[#22c55e]/80 hover:text-[#22c55e] hover:bg-[#22c55e]/10 rounded transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Video Player */}
                    <div className="relative w-full aspect-video bg-black flex items-center justify-center border-y border-[#22c55e]/10">
                        <iframe
                            key={CHANNEL_IDS[currentIndex].id}
                            src={CHANNEL_IDS[currentIndex].type === 'channel'
                                ? `https://www.youtube-nocookie.com/embed/live_stream?channel=${CHANNEL_IDS[currentIndex].id}&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`
                                : `https://www.youtube-nocookie.com/embed/${CHANNEL_IDS[currentIndex].id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
                            title="Global Intelligence Feed"
                            className="absolute top-0 left-0 w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        {/* CRT overlay effect */}
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,0,0.03),rgba(0,255,0,0.01),rgba(0,255,0,0.03))] bg-[length:100%_4px,3px_100%] opacity-30"></div>
                        <div className="pointer-events-none absolute inset-0 border border-[#22c55e]/5" />
                    </div>

                    {/* Footer status */}
                    <div className="bg-[#111820] px-3 py-1.5 flex justify-between items-center text-[9px] text-[#22c55e]/60 font-mono uppercase">
                        <div className="flex items-center gap-1.5">
                            <Activity size={10} className="text-[#22c55e]/70" />
                            <span>Signal Link Active</span>
                        </div>
                        <span className="text-[#22c55e]">[{currentIndex + 1}/{CHANNEL_IDS.length}]</span>
                    </div>
                </div>
            )}

            {/* Tactical Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group relative flex items-center gap-2 px-4 py-2 bg-[#0a0f12] border transition-all duration-300 ${isOpen ? 'border-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'border-[#22c55e]/30 hover:border-[#22c55e]/60'} overflow-hidden rounded-sm`}
            >
                <div className="absolute inset-0 bg-[#22c55e]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-[#22c55e] animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]' : 'bg-[#22c55e]/40'}`} />

                <span className={`font-mono text-[10px] tracking-widest font-bold uppercase transition-colors ${isOpen ? 'text-[#22c55e]' : 'text-[#22c55e]/60 group-hover:text-[#22c55e]'}`}>
                    INTEL FEED
                </span>

                <Tv size={14} className={`${isOpen ? 'text-[#22c55e]' : 'text-[#22c55e]/40 group-hover:text-[#22c55e]/80'} transition-colors ml-1`} />
            </button>
        </div>
    );
}
