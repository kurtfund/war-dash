'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type IntelUpdate = {
    id: string;
    source_country: string;
    source_name: string;
    raw_content: string;
    translated_content: string;
    importance_weight: number;
    isIran?: boolean;
    timestamp: string;
    url?: string;
};

interface IntelFeedProps {
    updates: IntelUpdate[];
}

export default function IntelFeed({ updates }: IntelFeedProps) {
    return (
        <div className="absolute inset-0 overflow-y-auto custom-terminal-scroll p-3 space-y-3">
            <AnimatePresence initial={false}>
                {updates.map((update) => (
                    <motion.div
                        key={update.id}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`p-3 border rounded text-xs font-mono shadow-md ${update.isIran
                            ? "border-red-500/50 bg-red-950/20"
                            : "border-zinc-800 bg-zinc-900/40"
                            }`}
                    >
                        {/* Header: Source & Time */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest ${update.isIran ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'
                                    }`}>
                                    {update.source_country}
                                </span>
                                {update.url ? (
                                    <a
                                        href={update.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-cyan-500 font-bold hover:text-cyan-400 hover:underline transition-all flex items-center gap-1"
                                        title="Open Intel Source"
                                    >
                                        {update.source_name} ↗
                                    </a>
                                ) : (
                                    <span className="text-cyan-500 font-bold">{update.source_name}</span>
                                )}
                                {update.isIran && (
                                    <span className="text-red-400 font-bold uppercase tracking-widest text-[9px] animate-pulse">
                                        ⚠️ Tehran-Direct
                                    </span>
                                )}
                            </div>
                            <span className="text-zinc-500 text-[9px] text-right leading-tight">
                                {new Date(update.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} <br />
                                {new Date(update.timestamp).toLocaleTimeString([], { hour12: false })}
                            </span>
                        </div>

                        {/* Translation Badge */}
                        {update.isIran && (
                            <div className="mb-2 w-max px-2 py-0.5 border border-yellow-500/50 bg-yellow-900/30 text-yellow-500 text-[9px] uppercase tracking-widest rounded flex items-center gap-1 shadow-[0_0_8px_rgba(234,179,8,0.3)]">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping mr-1"></span>
                                Translated from Farsi/Arabic
                            </div>
                        )}

                        {/* Content */}
                        <p className="text-zinc-300 leading-relaxed text-[11px]">
                            {update.translated_content}
                        </p>
                    </motion.div>
                ))}
            </AnimatePresence>

            {updates.length === 0 && (
                <div className="text-center text-zinc-600 font-mono text-xs mt-10">
                    Awaiting Intel Stream...
                </div>
            )}
        </div>
    );
}
