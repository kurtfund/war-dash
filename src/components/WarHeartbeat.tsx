'use client';

import React, { useState } from 'react';

export default function WarHeartbeat({ score }: { score: number | string }) {
    const [isRevealed, setIsRevealed] = useState(false);

    // Convert score to a number for calculating the stroke dash (0 to 100)
    const numericScore = typeof score === 'string' ? parseFloat(score) || 0 : score;
    const isQuestionMark = !isRevealed || score === "??.?" || isNaN(numericScore);

    // Conditional Status Logic based on user feedback
    const isCritical = numericScore >= 99;
    const isWarning = numericScore >= 80 && !isCritical;
    const dynamicStatusText = isCritical ? 'CRITICAL: IMMINENT THREAT' : (isWarning ? 'WARNING: TENSION INCURRED' : 'NOMINAL: STABLE');
    const dynamicStatusStyles = isCritical
        ? 'bg-red-900/30 text-red-500 border-red-500 animate-[pulse_1s_ease-in-out_infinite]'
        : (isWarning ? 'bg-orange-800/30 text-orange-400 border-orange-500' : 'bg-[#002f3a]/80 text-[#5ce1e6] border-[#005a70]');

    // SVG Circle Math for the arc
    const radius = 110;
    const circumference = 2 * Math.PI * radius;
    // Map 0-100 score to the visible offset (filling from bottom left upwards roughly)
    const progressOffset = isQuestionMark ? circumference : circumference - (numericScore / 100) * circumference;

    return (
        <div
            className="relative flex items-center justify-center w-[320px] h-[320px] group select-none pointer-events-none transform scale-75 sm:scale-90 origin-center"
            onClick={() => setIsRevealed(true)}
        >
            {/* Exact Circular Hitbox to prevent blocking the map corners */}
            <div
                className="absolute w-[280px] h-[280px] rounded-full pointer-events-auto z-50"
                style={{ cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text y="24" font-size="24">🚀</text></svg>') 16 16, crosshair` }}
            ></div>
            {/* The SVG Circular Gauge */}
            <svg width="320" height="320" viewBox="0 0 320 320" className={`absolute inset-0 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] pointer-events-none ${isRevealed ? 'animate-heartbeat' : ''} origin-center`}>
                {/* Background Track Circle */}
                <circle
                    cx="160" cy="160" r={radius}
                    fill="transparent"
                    stroke="#1a1f24" /* Very dark grey track */
                    strokeWidth="24"
                    strokeLinecap="round"
                />

                {/* Inner Glowing Ring */}
                <circle
                    cx="160" cy="160" r="85"
                    fill="radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)"
                    stroke="#044d5a"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="opacity-50"
                />

                {/* Progress Arc */}
                <circle
                    cx="160" cy="160" r={radius}
                    fill="transparent"
                    stroke="#06b6d4" /* Cyan progress */
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    className="transition-all duration-1000 ease-out"
                    style={{ transform: 'rotate(135deg)', transformOrigin: '50% 50%' }}
                />

                {/* Outer Tick Marks Ring */}
                <circle
                    cx="160" cy="160" r="140"
                    fill="transparent"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeDasharray="2 18"
                    className="opacity-40"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />

                {/* Sweeping Needle Line */}
                {!isQuestionMark && (
                    <line
                        x1="160" y1="160"
                        x2="240" y2="40"
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        className="opacity-70 animate-[pulse_2s_ease-in-out_infinite]"
                    />
                )}
            </svg>

            {/* Central Typography and Data Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 font-mono text-cyan-400 font-bold uppercase tracking-widest pointer-events-none">
                {/* Top Border Text */}
                <div className="absolute top-4 w-full text-center text-xs tracking-[0.2em] opacity-80 backdrop-blur-sm">
                    GEOPOLITICAL HEAT INDEX
                </div>

                <div className="flex flex-col items-center mt-6">
                    <span className="text-[11px] mb-2 opacity-90 tracking-widest text-[#5ce1e6]">HEARTBEAT</span>

                    {/* The Scaled Down Giant Score */}
                    <div className="text-4xl leading-none text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] tabular-nums transition-all">
                        {isQuestionMark ? "??.?" : score}
                    </div>

                    <span className="text-[9px] mt-2 opacity-80 tracking-widest bg-black/20 px-2 py-0.5 rounded">
                        CONFLICT SCORE
                    </span>

                    {/* EKG Line Graphic */}
                    <div className="w-32 h-6 mt-3 relative">
                        <svg viewBox="0 0 100 30" className="w-full h-full drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
                            <polyline
                                fill="none"
                                stroke="#06b6d4"
                                strokeWidth="2"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                points="0,15 20,15 25,5 30,25 35,15 50,15 55,8 60,20 65,15 80,15 85,10 90,25 95,15 100,15"
                            />
                        </svg>
                    </div>

                    {/* Status Box (Hidden while encrypted to prevent paradoxes) */}
                    <div className={`absolute bottom-[56px] text-[10px] px-3 py-1 rounded border ${dynamicStatusStyles} transition-all duration-500 ${!isRevealed ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                        {dynamicStatusText}
                    </div>
                </div>
            </div>

            {/* Moving Smoke Screen / Dynamic Obfuscation Layer */}
            <div
                className={`absolute inset-0 z-30 flex items-center justify-center transition-all duration-[1500ms] pointer-events-none ease-[cubic-bezier(0.4,0,0.2,1)] ${isRevealed ? 'opacity-0 scale-150 blur-3xl' : 'opacity-100 scale-100 blur-0'
                    }`}
            >
                {/* Visual Smoky Cloud (Rotating Gradients) */}
                <div className="relative w-64 h-64 rounded-full flex flex-col items-center justify-center group-hover:brightness-125 transition-all overflow-hidden border border-[#061114] shadow-[inset_0_0_50px_rgba(0,0,0,0.9),0_0_50px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20">

                    {/* Deep Backing */}
                    <div className="absolute inset-0 bg-[#061114]/95 backdrop-blur-md z-0"></div>

                    {/* Smooth Swirling Smoke Layer */}
                    <div className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] animate-[spin_10s_linear_infinite] z-0 pointer-events-none">
                        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-cyan-500/20 rounded-full blur-[40px] mix-blend-screen"></div>
                        <div className="absolute bottom-[20%] right-[20%] w-[50%] h-[50%] bg-cyan-300/10 rounded-full blur-[50px] mix-blend-screen"></div>
                    </div>

                    {/* Central Elements */}
                    <div className="relative z-10 flex flex-col items-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        <span className="text-cyan-500/70 text-[11px] uppercase tracking-widest mb-4 animate-pulse font-bold">Data Encrypted</span>

                        <div className="flex gap-3 text-5xl font-mono text-zinc-500 opacity-60 font-black tracking-tighter mix-blend-screen mb-5">
                            <span>?</span>
                            <span className="animate-[pulse_1s_infinite]">.</span>
                            <span>?</span>
                        </div>

                        <span className="text-[10px] text-zinc-300 block sm:hidden font-mono tracking-widest font-bold bg-zinc-900/50 px-3 py-1 rounded border border-zinc-800">Tap to Reveal</span>
                        <span className="text-[10px] text-zinc-300 hidden sm:block font-mono tracking-widest font-bold bg-zinc-900/50 px-3 py-1 rounded border border-zinc-800 backdrop-blur">Click to Reveal</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
