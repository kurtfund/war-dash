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
        const socket = io({
            transports: ['websocket', 'polling'],
            secure: true,
            rejectUnauthorized: false
        });

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
        <div className="absolute inset-0 overflow-y-auto custom-terminal-scroll p-3 space-y-3 pb-20">
            <AnimatePresence>
                {pulseData.map((item, idx) => (
                    <motion.div
                        key={item.symbol + idx}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border backdrop-blur-md shadow-lg flex justify-between items-center gap-4 ${item.up ? 'border-yellow-500/20 bg-yellow-900/10' : 'border-red-500/20 bg-red-900/10'
                            }`}
                    >
                        {/* Left Column: Ticker & Category */}
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <a
                                href={item.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono font-bold text-zinc-300 hover:text-cyan-400 hover:underline transition-colors flex items-center gap-1 truncate"
                                title={`View ${item.symbol} source data`}
                            >
                                <span className="truncate">{item.symbol}</span> ↗
                            </a>
                            <span className="text-[9px] uppercase tracking-widest text-zinc-500 bg-zinc-900/50 px-1.5 py-0.5 rounded w-max">
                                {item.category}
                            </span>
                        </div>

                        {/* Right Column: Price & Change */}
                        <div className="flex flex-col items-end shrink-0 text-right">
                            <span className={`text-[10px] font-bold uppercase ${item.up ? 'text-yellow-500' : 'text-red-500'} mb-1`}>
                                {item.up ? '↗' : '↘'}
                            </span>
                            <div className="text-xl font-mono font-bold text-white tracking-tighter shadow-sm">
                                {item.price}
                            </div>
                            <span className={`text-xs font-bold leading-none mt-1 ${item.up ? 'text-green-400' : 'text-red-400'}`}>
                                {item.change}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            <div className="text-center w-full py-4 animate-pulse text-zinc-600 font-mono text-xs uppercase">
                Loading deeper history...
            </div>
        </div>
    );
}
