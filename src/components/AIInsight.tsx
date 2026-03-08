'use client';

import React from 'react';

export default function AIInsight() {
    // Simulated values based on "March 7-8" events
    const avgMissilesPerDay = 452.5; // (4210 / 8 days + new intensity)
    const conflictDurationPrediction = "14.2 Days";

    return (
        <div className="bg-[#0a0f12]/90 backdrop-blur-md border border-cyan-500/20 rounded p-4 font-mono shadow-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-cyan-500/10 pb-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <h3 className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Predictive AI Intel</h3>
                </div>
                <div className="text-[8px] text-zinc-500 uppercase">Model: GPT-4o-V2 // GEOPOL-SYNC</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-zinc-500 uppercase">Avg Missiles / 24H</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl text-white font-bold">{avgMissilesPerDay.toFixed(1)}</span>
                        <span className="text-[9px] text-red-500 animate-pulse">↑ 12.4%</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1 border-l border-zinc-800 pl-4">
                    <span className="text-[9px] text-zinc-500 uppercase">Predictive Conflict Arch</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl text-cyan-400 font-bold">{conflictDurationPrediction}</span>
                        <span className="text-[9px] text-zinc-500 uppercase">Rem.</span>
                    </div>
                </div>
            </div>

            {/* Visual Arch Sweep */}
            <div className="mt-4 h-1 bg-zinc-900 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-cyan-500/50 w-[65%] shadow-[0_0_10px_rgba(6,182,212,0.5)] animate-[pulse_2s_infinite]"></div>
                <div className="absolute top-0 left-0 h-full bg-cyan-400 w-[15%]"></div>
            </div>
            <div className="flex justify-between mt-1 text-[8px] text-zinc-600 uppercase tracking-tighter">
                <span>Inception</span>
                <span>Peak Escalation</span>
                <span>De-escalation Arch</span>
            </div>
        </div>
    );
}
