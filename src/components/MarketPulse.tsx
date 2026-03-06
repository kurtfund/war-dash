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
                        className={`p-3 rounded-lg border backdrop-blur-md shadow-lg ${item.up ? 'border-yellow-500/20 bg-yellow-900/10' : 'border-red-500/20 bg-red-900/10'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono font-bold text-zinc-300 hover:text-cyan-400 hover:underline transition-colors flex items-center gap-1"
                                title={`View ${item.symbol} source data`}
                            >
                                {item.symbol} ↗
                            </a>
                            <span className={`text-[10px] font-bold uppercase ${item.up ? 'text-yellow-500' : 'text-red-500'}`}>
                                {item.up ? '↗' : '↘'}
                            </span>
                        </div>

                        <div className="text-xl font-mono font-bold text-white mb-1 tracking-tighter shadow-sm">
                            {item.price}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs font-bold leading-none ${item.up ? 'text-green-400' : 'text-red-400'}`}>
                                {item.change}
                            </span>
                            <span className="text-[9px] uppercase tracking-widest text-zinc-500 bg-zinc-900/50 px-1.5 py-0.5 rounded">
                                {item.category}
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
