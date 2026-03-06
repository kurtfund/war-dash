'use client';

import React, { useState, useEffect } from 'react';

const CHANNELS = [
    { name: 'AP Live Briefing', id: 'uw_liwLvfVg' },
    { name: 'Global News 1', id: '21X5lGlDOfg' }, // NASA Live (placeholder safe stream)
    { name: 'Global News 2', id: '0f1kZf-A1iA' }, // Example live news feed
];

export default function MediaBoxCycle() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Cycle every 60 seconds as requested
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % CHANNELS.length);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const activeChannel = CHANNELS[currentIndex];

    return (
        <div className="relative w-full h-full bg-black group overflow-hidden">
            {/* Top Banner Tag */}
            <div className="absolute top-2 left-2 z-10 bg-red-600/90 text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded shadow-md backdrop-blur-sm border border-red-500 flex items-center gap-2 font-bold animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                LIVE: {activeChannel.name}
            </div>

            <div className="absolute bottom-2 right-2 z-10 text-[9px] font-mono text-zinc-500 bg-black/60 px-2 rounded backdrop-blur border border-zinc-800">
                Cycle Sync: 60s
            </div>

            <iframe
                key={activeChannel.id}
                className="w-full h-full object-cover scale-[1.05]" // slight zoom to hide letterboxing
                src={`https://www.youtube.com/embed/${activeChannel.id}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1`}
                title={activeChannel.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>

            {/* Scanline Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4yKSIvPjwvc3ZnPg==')] pointer-events-none opacity-50 mix-blend-overlay"></div>
        </div>
    );
}
