import React, { useState } from 'react';

export default function Header() {
    const [isExploding, setIsExploding] = useState(false);

    const handleLogoClick = () => {
        setIsExploding(true);
        setTimeout(() => setIsExploding(false), 800);
    };

    // Shared telemetry data
    const telemetryStats = [
        { country: 'IRAN (TEHRAN)', sent: 4210, stopped: 955 },
        { country: 'QATAR (DOHA)', sent: 165, stopped: 162 },
        { country: 'YEMEN', sent: 423, stopped: 98 },
        { country: 'SAUDI', sent: 145, stopped: 140 },
        { country: 'BAHRAIN', sent: 12, stopped: 12 },
        { country: 'UAE (DUBAI)', sent: 24, stopped: 23 },
    ];

    const totalInbound = telemetryStats.reduce((sum, stat) => sum + stat.sent, 0);
    const totalIntercepted = telemetryStats.reduce((sum, stat) => sum + stat.stopped, 0);

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

            {/* Top Center: Missiles VS Pill Display */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {/* HOUTHI VS CENTCOM Element */}
                <a href="https://apnews.com/article/houthi-rebels-yemen-red-sea-attacks-f698a9641cd0ed0bcab6d644d6db3ba9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#1a2b3a] border border-[#2381c6] hover:bg-[#1f3547] transition-colors rounded px-4 py-1.5 shadow-[0_0_10px_rgba(35,129,198,0.2)] cursor-pointer decoration-none">
                    <div className="flex items-center gap-1">
                        <span className="text-[#2381c6] text-[10px] transform -rotate-45">🚀</span>
                        <span className="text-white font-bold text-xs tracking-wider">HOU SENT</span>
                        <span className="text-[#ff9800] font-bold text-lg leading-none ml-1 shadow-sm opacity-80">~130</span>
                    </div>
                    <div className="w-px h-5 bg-[#2381c6]/50"></div>
                    <div className="flex items-center gap-1">
                        <span className="text-[#5acb62] text-[10px] font-bold">⭘</span>
                        <span className="text-white font-bold text-xs tracking-wider">US INT.</span>
                        <span className="text-[#5acb62] font-bold text-lg leading-none ml-1">100+</span>
                    </div>
                </a>

                {/* VS Element */}
                <span className="text-zinc-400 font-bold text-[10px] tracking-widest italic opacity-70">VS</span>

                {/* IRAN Element (TEHRAN) */}
                <a href="https://apnews.com/article/israel-iran-hamas-hezbollah-lebanon-14300bb88383f79efbcfbc8e64c39eb0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-4 bg-[#3a1a1c] border border-[#c6232b] hover:bg-[#4d2124] transition-colors rounded px-2 sm:px-4 py-1.5 shadow-[0_0_10px_rgba(198,35,43,0.2)] cursor-pointer decoration-none">
                    <div className="flex items-center gap-1">
                        <span className="text-[#c6232b] text-[10px] transform -rotate-45 hidden sm:inline">🚀</span>
                        <span className="text-white font-bold text-[10px] sm:text-xs tracking-wider">TEHRAN</span>
                        <span className="text-[#e2624b] font-bold text-sm sm:text-lg leading-none ml-1 shadow-sm">4.2k</span>
                    </div>
                    <div className="w-px h-5 bg-[#c6232b]/50"></div>
                    <div className="flex items-center gap-1">
                        <span className="text-[#5acb62] text-[10px] font-bold">⭘</span>
                        <span className="text-white font-bold text-xs tracking-wider">US/IL INT.</span>
                        <span className="text-[#5acb62] font-bold text-lg leading-none ml-1">181</span>
                    </div>
                </a>
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
