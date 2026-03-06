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
        <header className="flex justify-between items-center p-3 border-b border-zinc-800 bg-zinc-950 shadow-md h-16 shrink-0">
            {/* Top Left: Logo / Branding */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 border-2 border-cyan-500 rounded flex items-center justify-center bg-zinc-900 shadow-[0_0_10px_theme('colors.cyan.500')]">
                    <span className="text-xl">🚀</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-widest text-white leading-none">WAR DASH</h1>
                    <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase mt-1 opacity-80">Geopolitical Heat Index</p>
                </div>
            </div>

            {/* Top Center: Impact Math */}
            <div className="hidden md:flex flex-col items-center">
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Impact Math</span>
                <div className="flex items-center gap-6 font-mono text-sm">
                    <div className="flex flex-col items-center">
                        <span className="text-red-500 font-bold text-lg leading-none">{totalInbound.toLocaleString()}</span>
                        <span className="text-zinc-400 text-[10px]">INBOUND</span>
                    </div>
                    <div className="h-6 w-px bg-zinc-800"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-cyan-500 font-bold text-lg leading-none">{totalIntercepted.toLocaleString()}</span>
                        <span className="text-zinc-400 text-[10px]">INTERCEPTED</span>
                    </div>
                </div>
            </div>

            {/* Top Right: The Timeline & Clock */}
            <div className="text-right font-mono flex flex-col items-end">
                <div className="text-sm text-yellow-500 font-bold">Day 8 | Since Saturday, Oct 7</div>
                <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    14:32:18 UTC
                </div>
            </div>
        </header>
    );
}
