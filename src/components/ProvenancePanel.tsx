'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProvenancePanel({ verificationData, onClose }: { verificationData: any, onClose: () => void }) {
    return (
        <AnimatePresence>
            {verificationData && (
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute right-0 top-16 bottom-[88px] w-80 bg-[#0a0f12]/95 border-l border-cyan-500/30 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] z-50 p-4 backdrop-blur-md flex flex-col font-mono"
                >
                    <div className="flex justify-between items-center mb-4 border-b border-cyan-500/30 pb-2">
                        <h2 className="text-cyan-400 text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            Data Provenance
                        </h2>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg leadin-none">
                            ×
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-terminal-scroll pr-2 space-y-4">
                        <div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Verified Event ID</div>
                            <div className="text-white text-xs bg-zinc-900/50 p-2 border border-zinc-800 rounded break-all select-all">
                                #{verificationData.origin}-UNK-{new Date().getFullYear()}-{verificationData.id.toString().padStart(4, '0')}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Timestamped Log</div>
                            <div className="text-yellow-500/90 text-xs bg-yellow-900/10 p-2 border border-yellow-500/20 rounded font-mono">
                                <div className="mb-1">{`> [${verificationData.time}] LAUNCH DETECTED`}</div>
                                <div className="mb-1">{`> ORIGIN: ${verificationData.origin}`}</div>
                                <div className="mb-1">{`> PAYLOAD: ${verificationData.payload} CLASS`}</div>
                                <div>{`> STATUS: CONFIRMED IMPACT / INTERCEPT`}</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Coordinates (Lat/Lng)</div>
                            <div className="text-cyan-400 text-xs bg-cyan-900/10 p-2 border border-cyan-500/20 rounded flex justify-between">
                                <span>{verificationData.latOffset.toFixed(4)}° N</span>
                                <span>{verificationData.lngOffset.toFixed(4)}° E</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-800">
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Automated Verification Link</div>
                            <a
                                href={verificationData.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 px-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-center text-xs tracking-widest uppercase font-bold transition-all rounded"
                            >
                                [ VIEW RAW SOURCE ]
                            </a>
                            <p className="text-[9px] text-zinc-600 mt-2 text-center">
                                Links to public ACLED / MOD SAT registry.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
