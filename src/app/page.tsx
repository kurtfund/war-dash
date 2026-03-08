'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import IntelFeed, { IntelUpdate } from '@/components/IntelFeed';
import dynamic from 'next/dynamic';

const MapboxMap = dynamic(() => import('@/components/MapboxMap'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 border border-zinc-800 animate-pulse text-cyan-500 font-mono text-xs uppercase tracking-widest">Booting GEO INTEL MAPBOX...</div>
});
import MediaBoxCycle from '@/components/MediaBoxCycle';
import WarHeartbeat from '@/components/WarHeartbeat';
import MarketPulse from '@/components/MarketPulse';
import AIInsight from '@/components/AIInsight';

import { io } from 'socket.io-client';

export default function Home() {
  const [intelStream, setIntelStream] = useState<IntelUpdate[]>([]);
  const [currentScore, setCurrentScore] = useState<string>("75.4");

  useEffect(() => {
    // Connect to WebSocket using same domain (since we run Next + Socket out of server.js)
    const socket = io();

    socket.on('connect', () => {
      console.log('🔗 Connected to War Dash Real-time Intel Feed');
    });

    socket.on('score_update', (data) => {
      if (data && data.score) setCurrentScore(data.score.toString());
    });

    socket.on('new_intel', (newIntel: IntelUpdate) => {
      setIntelStream(prev => {
        // Prevent visually duplicating the same article in the feed
        const isDuplicate = prev.some(
          item => item.raw_content === newIntel.raw_content || (item.url && item.url === newIntel.url)
        );
        if (isDuplicate) return prev;

        // add uniqueness to id if missing
        newIntel.id = newIntel.id || new Date().toISOString() + Math.random();
        // Prepend the new intel via functional state update
        return [newIntel, ...prev].slice(0, 50); // keep last 50 unique items
      });
    });

    socket.on('intel_history', (history: IntelUpdate[]) => {
      setIntelStream(prev => {
        // Merge history with items already received in real-time
        const combined = [...prev, ...history];
        // Filter unique by content or URL
        const unique = combined.filter((v, i, a) =>
          a.findIndex(t => (t.raw_content === v.raw_content || (t.url && t.url === v.url))) === i
        );
        // Sort newest first based on timestamp
        return unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 50);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="flex flex-col min-h-screen w-full bg-black text-white relative">
      <Header />

      {/* Dynamic Background subtle grid */}
      <div className="absolute inset-0 z-0 bg-transparent overflow-hidden pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(100, 100, 100, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 100, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Layout Grid: 1/5 for side columns, 3/5 for center map */}
      <div className="grid grid-cols-1 lg:grid-cols-5 w-full gap-8 lg:gap-2 px-12 md:px-16 lg:px-2 py-4 relative z-10 flex-1 overflow-visible">

        {/* Column 1: Intel Feed (Narrower) */}
        <section className="col-span-1 lg:col-span-1 border border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex flex-col relative h-[400px] shrink-0 lg:h-full rounded shadow-xl overflow-hidden">
          <h2 className="p-3 border-b border-zinc-800 font-mono text-cyan-500 uppercase tracking-tighter text-sm flex items-center justify-between bg-zinc-950/80">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              Live Geopolitical Alert Feed
            </span>
            <span className="text-[10px] text-zinc-500">ONT 14:32:18</span>
          </h2>
          <div className="flex-1 overflow-hidden relative">
            <IntelFeed updates={intelStream} />
          </div>
        </section>

        {/* Columns 2, 3, 4: Map & Heartbeat (Wider) */}
        <section className="col-span-1 lg:col-span-3 flex flex-col gap-2 relative h-[85vh] lg:h-full min-h-[600px]">
          {/* Map Section */}
          <div className="relative border border-zinc-800 bg-zinc-900 flex-1 rounded shadow-xl overflow-hidden flex flex-col group">
            <div className="flex-1 relative">
              <MapboxMap intelStream={intelStream} />
            </div>

            {/* The War Heartbeat (Fixed to Bottom) */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none flex items-end justify-center z-[1000] pb-4 scale-[0.6] sm:scale-75 md:scale-90 origin-bottom">
              <div className="pointer-events-auto">
                <WarHeartbeat score={currentScore} />
              </div>
            </div>

            {/* AI Insight Box (Fixed to Bottom-Center) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] z-[1001] pointer-events-auto">
              <AIInsight />
            </div>
          </div>
        </section>

        {/* Column 4: Stock Watchlist */}
        <section className="col-span-1 lg:col-span-1 border border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex flex-col relative h-[400px] shrink-0 lg:h-full rounded shadow-xl overflow-hidden">
          <h2 className="p-3 border-b border-zinc-800 font-mono text-yellow-500 uppercase flex items-center justify-between text-sm bg-zinc-950/80">
            <span className="flex items-center gap-2">
              <span className="text-yellow-500">💹</span> Stock Watchlist
            </span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest bg-yellow-900/40 text-yellow-500 px-1 rounded">Live</span>
          </h2>
          <div className="flex-1 overflow-hidden relative">
            <MarketPulse />
          </div>
        </section>

      </div>
    </main>
  );
}
