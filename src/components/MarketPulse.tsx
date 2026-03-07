'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

export default function MarketPulse() {
    // Live data injected by WebSocket. Start with a visual loading shell until the server broadcasts.
    const [pulseData, setPulseData] = useState<any[]>([
        { symbol: 'ESTABLISHING SECURE CONNECTION...', price: '---', change: '---', up: true, category: 'System', url: '#' }
    ]);

    useEffect(() => {
        // Enforce secure websocket polling on Render
        const socket = io();

        socket.on('market_update', (data) => {
            if (data && data.length > 0) {
                setPulseData(data);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-y-auto custom-terminal-scroll p-2 space-y-1.5 pb-10">
            <AnimatePresence>
                {pulseData.map((item, idx) => (
                    <motion.div
                        key={item.symbol + idx}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-2 rounded border backdrop-blur-md shadow flex justify-between items-center gap-2 ${item.up ? 'border-yellow-500/10 bg-yellow-900/5' : 'border-red-500/10 bg-red-900/5'
                            }`}
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
                            <div className="text-sm font-mono font-bold text-white tracking-tighter">
                                {item.price}
                            </div>
                            <span className={`text-[10px] font-bold leading-none ${item.up ? 'text-green-500/80' : 'text-red-500/80'}`}>
                                {item.change}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
