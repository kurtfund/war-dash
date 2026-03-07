'use client';

import React, { useState } from 'react';

export default function WarHeartbeat({ score }: { score: number | string }) {
    const [isRevealed, setIsRevealed] = useState(false);

    // Convert score to a number for calculating the stroke dash (0 to 100)
    const numericScore = typeof score === 'string' ? parseFloat(score) || 0 : score;
    const isQuestionMark = !isRevealed || score === "??.?" || isNaN(numericScore);

    // SVG Circle Math for the arc
    const radius = 110;
    const circumference = 2 * Math.PI * radius;
    // Map 0-100 score to the visible offset (filling from bottom left upwards roughly)
    const progressOffset = isQuestionMark ? circumference : circumference - (numericScore / 100) * circumference;

    return (
        <div
            className="relative flex items-center justify-center w-80 h-80 group select-none pointer-events-auto"
            onClick={() => setIsRevealed(true)}
            style={{ cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text y="24" font-size="24">🚀</text></svg>') 16 16, crosshair` }}
        >
            {/* The SVG Circular Gauge */}
            <svg width="320" height="320" viewBox="0 0 320 320" className="absolute inset-0 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] pointer-events-none">
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
                    <div className="text-5xl leading-none text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] tabular-nums transition-all">
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

                    {/* Status Box */}
                    <div className="absolute bottom-16 text-[10px] bg-[#002f3a]/80 text-[#5ce1e6] px-3 py-1 rounded border border-[#005a70]">
                        NOMINAL: STABLE
                    </div>
                </div>
            </div>

            {/* Smoke Screen / Obfuscation Layer */}
            <div
                className={`absolute inset-0 z-30 flex items-center justify-center transition-all duration-1000 pointer-events-none ease-in-out ${isRevealed ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-0'
                    }`}
            >
                {/* Visual Smoky Cloud */}
                <div className="w-56 h-56 rounded-full bg-zinc-950/80 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.9)] border border-zinc-800 border-t-cyan-500/30 flex flex-col items-center justify-center group-hover:bg-zinc-900/80 transition-colors">
                    <span className="text-cyan-500/50 text-[10px] uppercase tracking-widest mb-3 animate-pulse">Data Encrypted</span>
                    <span className="text-[9px] text-zinc-400 block sm:hidden font-mono tracking-widest font-bold">Tap to Reveal</span>
                    <span className="text-[9px] text-zinc-400 hidden sm:block font-mono tracking-widest font-bold">Click to Reveal</span>
                </div>
            </div>
        </div>
    );
}
