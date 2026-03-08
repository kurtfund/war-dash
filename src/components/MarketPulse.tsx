'use client';

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function MarketPulse() {
    // Live data injected by WebSocket.
    const [pulseData, setPulseData] = useState<any[]>([]);

    useEffect(() => {
        const socket = io();
        socket.on('market_update', (data) => {
            if (data && data.length > 0) {
                setPulseData(data);
            }
        });
        return () => { socket.disconnect(); };
    }, []);

    return (
        <div className="absolute inset-0 flex flex-col h-full overflow-y-auto custom-terminal-scroll p-1.5 pb-10">
            <div className="flex flex-col gap-1 w-full h-full min-h-min">
                {pulseData.length === 0 && (
                    <div className="p-4 text-center text-zinc-700 font-mono text-[10px] uppercase animate-pulse">
                        Synchronizing stock stream...
                    </div>
                )}
                {pulseData.map((item, idx) => (
                    <div
                        key={`${item.symbol}-${idx}`}
                        className={`p-2 rounded border backdrop-blur-md shadow-sm flex justify-between items-center gap-2 shrink-0 h-auto min-h-[44px] transition-colors duration-500 ${item.up ? 'border-yellow-500/10 bg-yellow-900/5' : 'border-red-500/10 bg-red-900/5'}`}
                    >
                        {/* Left Column: Ticker & Category */}
                        <div className="flex flex-col min-w-0 flex-1">
                            <a
                                href={item.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-mono font-bold text-zinc-300 hover:text-cyan-400 hover:underline transition-colors flex items-center gap-1 truncate"
                                title={`View ${item.symbol} source data`}
                            >
                                <span className="truncate">{item.symbol}</span> ↗
                            </a>
                            <span className="text-[8px] uppercase tracking-wider text-zinc-600 bg-zinc-900/30 px-1 rounded w-max">
                                {item.category}
                            </span>
                        </div>

                        {/* Right Column: Price & Change */}
                        <div className="flex flex-col items-end shrink-0 text-right">
                            <div className={`text-sm font-mono font-bold tracking-tighter transition-colors duration-300 ${item.up ? 'text-white' : 'text-zinc-100'}`}>
                                {item.price}
                            </div>
                            <span className={`text-[9px] font-bold leading-none ${item.up ? 'text-green-500/90' : 'text-red-500/90'}`}>
                                {item.change}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Add Ticker Button */}
                <button
                    className="mt-2 w-full py-3 border border-dashed border-zinc-800 rounded flex items-center justify-center gap-2 hover:bg-zinc-900 hover:border-zinc-700 transition-all group"
                    onClick={() => alert('Ticker addition module restricted to Alpha access.')}
                >
                    <span className="text-zinc-500 group-hover:text-cyan-400 text-lg">+</span>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono group-hover:text-zinc-400">Add Watchlist Ticker</span>
                </button>
            </div>
        </div>
    );
}
