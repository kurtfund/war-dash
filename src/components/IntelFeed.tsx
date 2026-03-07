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
    // Sort updates to enforce newest first
    const sortedUpdates = [...updates].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="absolute inset-0 overflow-y-auto custom-terminal-scroll p-3 space-y-4">
            <AnimatePresence initial={false}>
                {sortedUpdates.map((update) => (
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
                        <div className="flex items-start justify-between mb-3 gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest whitespace-nowrap ${update.isIran ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'
                                    }`}>
                                    {update.source_country}
                                </span>
                                {update.url ? (
                                    <a
                                        href={update.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-cyan-500 font-bold hover:text-cyan-400 hover:underline transition-all flex items-center gap-1 truncate"
                                        title="Open Intel Source"
                                    >
                                        <span className="truncate">{update.source_name}</span> ↗
                                    </a>
                                ) : (
                                    <span className="text-cyan-500 font-bold truncate">{update.source_name}</span>
                                )}
                                {update.isIran && (
                                    <span className="text-red-400 font-bold uppercase tracking-widest text-[9px] animate-pulse whitespace-nowrap hidden sm:inline-block">
                                        ⚠️ Tehran-Direct
                                    </span>
                                )}
                            </div>
                            <span className="text-zinc-500 text-[9px] text-right leading-tight whitespace-nowrap shrink-0">
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
                        <div className="text-zinc-300 leading-relaxed text-[11px] max-h-24 overflow-y-auto break-words custom-terminal-scroll pr-1 flex flex-col">
                            {update.translated_content}
                        </div>
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
