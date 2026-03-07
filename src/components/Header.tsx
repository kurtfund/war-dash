import React from 'react';

export default function Header() {
    // Shared telemetry data (ideally pulled from a global store, but duplicated here for rapid calculation)
    const telemetryStats = [
        { country: 'IRAN', sent: 1847, stopped: 412 },
        { country: 'YEMEN', sent: 423, stopped: 98 },
        { country: 'LEBANON', sent: 892, stopped: 340 },
        { country: 'SAUDI', sent: 145, stopped: 140 },
        { country: 'QATAR', sent: 45, stopped: 45 },
        { country: 'BAHRAIN', sent: 12, stopped: 12 },
        { country: 'UAE (DUBAI)', sent: 24, stopped: 23 },
        { country: 'ABU DHABI', sent: 37, stopped: 35 },
    ];

    const totalInbound = telemetryStats.reduce((sum, stat) => sum + stat.sent, 0);
    const totalIntercepted = telemetryStats.reduce((sum, stat) => sum + stat.stopped, 0);

    return (
        <header className="flex flex-col lg:flex-row justify-between items-center p-4 border-b border-zinc-800 bg-zinc-950 shadow-md min-h-[4rem] shrink-0 gap-6 lg:gap-0 z-50">
            {/* Top Left: Logo / Branding */}
            <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center justify-center lg:justify-start gap-5">
                <div className="w-20 h-20 rounded shadow-[0_0_20px_theme('colors.cyan.500')] shrink-0 overflow-hidden border-2 border-cyan-500/50">
                    <img src="/wardash-logo.jpg" alt="War Dash Logo" className="w-full h-full object-cover" />
                </div>
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-widest text-white leading-none">WAR DASH</h1>
                    <p className="text-[10px] sm:text-xs text-cyan-400 font-mono tracking-widest uppercase mt-1 opacity-80">Geopolitical Heat Index</p>
                </div>
            </div>

            {/* Top Center: Missiles VS Pill Display */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {/* USA Element */}
                <div className="flex items-center gap-4 bg-[#1a2b3a] border border-[#2381c6] rounded px-4 py-1.5 shadow-[0_0_10px_rgba(35,129,198,0.2)]">
                    <div className="flex items-center gap-1">
                        <span className="text-[#2381c6] text-[10px] transform -rotate-45">🚀</span>
                        <span className="text-white font-bold text-xs tracking-wider">USA SENT</span>
                        <span className="text-[#55c8e3] font-bold text-lg leading-none ml-1 shadow-sm">245</span>
                    </div>
                    <div className="w-px h-5 bg-[#2381c6]/50"></div>
                    <div className="flex items-center gap-1">
                        <span className="text-[#5acb62] text-[10px] font-bold">⭘</span>
                        <span className="text-white font-bold text-xs tracking-wider">INT.</span>
                        <span className="text-[#5acb62] font-bold text-lg leading-none ml-1">198</span>
                    </div>
                </div>

                {/* VS Element */}
                <span className="text-zinc-400 font-bold text-[10px] tracking-widest italic opacity-70">VS</span>

                {/* IRAN Element */}
                <div className="flex items-center gap-4 bg-[#3a1a1c] border border-[#c6232b] rounded px-4 py-1.5 shadow-[0_0_10px_rgba(198,35,43,0.2)]">
                    <div className="flex items-center gap-1">
                        <span className="text-[#c6232b] text-[10px] transform -rotate-45">🚀</span>
                        <span className="text-white font-bold text-xs tracking-wider">IRAN SENT</span>
                        <span className="text-[#e2624b] font-bold text-lg leading-none ml-1 shadow-sm">1847</span>
                    </div>
                    <div className="w-px h-5 bg-[#c6232b]/50"></div>
                    <div className="flex items-center gap-1">
                        <span className="text-[#5acb62] text-[10px] font-bold">⭘</span>
                        <span className="text-white font-bold text-xs tracking-wider">INT.</span>
                        <span className="text-[#5acb62] font-bold text-lg leading-none ml-1">412</span>
                    </div>
                </div>
            </div>

            {/* Top Right: The Timeline & Clock */}
            <div className="text-center w-full lg:w-auto lg:text-right font-mono flex flex-col items-center lg:items-end">
                <div className="text-sm text-yellow-500 font-bold">Day 8 | Since Saturday, Feb 28, 2026</div>
                <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    14:32:18 UTC
                </div>
            </div>
        </header>
    );
}
