import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function Header() {
    const [isExploding, setIsExploding] = useState(false);
    const [telemetry, setTelemetry] = useState({ iranSalvos: '4,210', intercepts: '1,390' });

    useEffect(() => {
        const socket = io();
        socket.on('telemetry_update', (data) => {
            if (data) setTelemetry(data);
        });
        return () => { socket.disconnect(); };
    }, []);

    const handleLogoClick = () => {
        setIsExploding(true);
        setTimeout(() => setIsExploding(false), 800);
    };

    // Calculate dynamic days since Feb 28, 2026
    const startDate = new Date('2026-02-28');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Format the date string: "Since Saturday, Feb 28, 2026"
    const startDateString = startDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <header className="flex flex-col lg:flex-row justify-between items-center p-2 lg:p-4 border-b border-zinc-800 bg-zinc-950 shadow-md min-h-[3rem] lg:min-h-[4rem] shrink-0 gap-3 lg:gap-0 z-50">
            {/* Top Left: Logo / Branding */}
            <div className="flex flex-row w-full lg:w-auto items-center justify-between sm:justify-start lg:justify-start gap-3 sm:gap-5">
                <div
                    onClick={handleLogoClick}
                    className={`
                        w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 rounded shrink-0 overflow-hidden border border-cyan-500/50 cursor-pointer
                        transition-all duration-300 ease-out origin-center
                        ${isExploding ? 'scale-[2.5] lg:scale-[3.0] opacity-0 shadow-[0_0_100px_rgba(34,211,238,1)] rotate-12 blur-sm' : 'scale-100 opacity-100 shadow-[0_0_15px_theme("colors.cyan.500")] hover:scale-110 hover:shadow-[0_0_25px_theme("colors.cyan.500")]'}
                    `}
                >
                    <img src="/wardash-logo.jpg" alt="War Dash Logo" className="w-full h-full object-cover" />
                </div>
                <div className="text-right sm:text-left flex-1 sm:flex-none">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-widest text-white leading-none">WAR DASH</h1>
                    <p className="text-[9px] sm:text-[10px] lg:text-xs text-cyan-400 font-mono tracking-widest uppercase mt-1 opacity-80">Geopolitical Heat Index</p>
                </div>
            </div>

            {/* Top Center: Consolidated Tally */}
            <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="flex items-center gap-4 bg-[#1a0f0f] border border-red-500/30 rounded px-6 py-2 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <div className="flex flex-col items-center">
                        <span className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] mb-1">TOTAL IRAN SALVOS *</span>
                        <div className="flex items-center gap-2">
                            <span className="text-red-500 text-xs animate-pulse">🚀</span>
                            <span className="text-white font-mono text-2xl font-black tabular-nums">{telemetry.iranSalvos}</span>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-zinc-800"></div>

                    <div className="flex flex-col items-center">
                        <span className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] mb-1">DEFENSE INTERCEPTS</span>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500 text-xs text-bold">⭘</span>
                            <span className="text-green-400 font-mono text-2xl font-black tabular-nums">{telemetry.intercepts}</span>
                        </div>
                    </div>
                </div>
                <div className="text-[8px] text-zinc-600 uppercase tracking-widest font-mono">
                    * Includes Ballistic, Cruise, and Drones
                </div>
            </div>

            {/* Top Right: The Timeline & Clock */}
            <div className="text-center w-full lg:w-auto lg:text-right font-mono flex flex-col items-center lg:items-end">
                <div className="text-sm text-yellow-500 font-bold">Day {diffDays} | Since {startDateString}</div>
                <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    14:32:18 UTC
                </div>
            </div>
        </header>
    );
}
