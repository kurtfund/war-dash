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

    const [isAdding, setIsAdding] = useState(false);
    const [newSymbol, setNewSymbol] = useState('');

    const fetchTickerData = async (symbol: string) => {
        try {
            const cleanSymbol = symbol.toUpperCase().replace('$', '').trim();
            const targetUrl = encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${cleanSymbol}?interval=1d`);
            const res = await fetch(`https://api.allorigins.win/get?url=${targetUrl}`);
            const jsonRes = await res.json();

            if (!jsonRes || !jsonRes.contents) throw new Error('No data');
            const data = JSON.parse(jsonRes.contents);
            if (!data.chart || !data.chart.result) throw new Error('Invalid format');

            const meta = data.chart.result[0].meta;
            const price = meta.regularMarketPrice;
            const prevPrice = meta.chartPreviousClose || price;
            const percentChange = ((price - prevPrice) / prevPrice) * 100;

            return {
                symbol: `$${cleanSymbol}`,
                price: price.toFixed(2),
                change: (percentChange >= 0 ? '+' : '') + percentChange.toFixed(2) + '%',
                up: percentChange >= 0,
                category: 'Manual Watch',
                url: `https://finance.yahoo.com/quote/${cleanSymbol}`
            };
        } catch (err) {
            console.error('Fetch error:', err);
            return null;
        }
    };

    const handleAddTicker = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSymbol) return;

        const symbol = newSymbol.trim();
        setIsAdding(false);
        setNewSymbol('');

        // Add a temporary loading state item
        const loadingId = Math.random().toString();
        const loadingItem = {
            symbol: `$${symbol.toUpperCase()}`,
            price: 'Syncing...',
            change: '0.00%',
            up: true,
            category: 'Manual Watch',
            url: '#'
        };
        setPulseData(prev => [loadingItem, ...prev]);

        const realData = await fetchTickerData(symbol);
        if (realData) {
            setPulseData(prev => {
                const filtered = prev.filter(item => item.symbol !== `$${symbol.toUpperCase()}` || item.price !== 'Syncing...');
                return [realData, ...filtered];
            });
        } else {
            setPulseData(prev => prev.filter(item => item.symbol !== `$${symbol.toUpperCase()}` || item.price !== 'Syncing...'));
            alert(`Failed to fetch and sync data for ${symbol}. Check the symbol or connection.`);
        }
    };

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

                {isAdding ? (
                    <form onSubmit={handleAddTicker} className="mt-2 p-2 border border-zinc-800 bg-zinc-950 rounded flex flex-col gap-2">
                        <input
                            type="text"
                            value={newSymbol}
                            onChange={(e) => setNewSymbol(e.target.value)}
                            placeholder="SYMBOL (e.g. AAPL)"
                            className="bg-black border border-zinc-800 text-[10px] font-mono p-2 text-cyan-400 focus:outline-none focus:border-cyan-500/50"
                            autoFocus
                        />
                        <div className="flex gap-1">
                            <button type="submit" className="flex-1 bg-cyan-900/20 border border-cyan-500/30 text-[9px] text-cyan-400 py-1 hover:bg-cyan-500/20 uppercase font-bold tracking-tighter transition-all">Add Ticker</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="px-3 border border-zinc-800 text-[9px] text-zinc-500 py-1 hover:text-zinc-300 uppercase transition-all">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <button
                        className="mt-2 w-full py-3 border border-dashed border-zinc-800 rounded flex items-center justify-center gap-2 hover:bg-zinc-900 hover:border-zinc-700 transition-all group"
                        onClick={() => setIsAdding(true)}
                    >
                        <span className="text-zinc-500 group-hover:text-cyan-400 text-lg">+</span>
                        <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono group-hover:text-zinc-400">Add Watchlist Ticker</span>
                    </button>
                )}
            </div>
        </div>
    );
}
