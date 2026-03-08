'use client';

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IntelUpdate } from './IntelFeed';

// Create a custom pulsing dot icon using Leaflet's divIcon
const createPulsingIcon = (type: string) => {
    return L.divIcon({
        className: 'custom-pulsing-icon',
        html: `
            <div class="marker group cursor-pointer relative flex items-center justify-center w-8 h-8 hover:scale-150 transition-transform pointer-events-auto" style="z-index: 999;">
                <div class="w-3 h-3 rounded-full ${type === 'live' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]' : 'bg-zinc-600'}"></div>
                ${type === 'live' ? '<div class="absolute inset-0 rounded-full border border-red-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>' : ''}
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
};

export default function MapboxMap({ intelStream = [] }: { intelStream?: IntelUpdate[] }) {

    // Generate accurate tracking data mapped to the authentic OSINT news stream
    const dots = useMemo<any[]>(() => {
        return intelStream
            .map((item, i) => {
                const content = item.raw_content.toLowerCase();
                let lng = 0;
                let lat = 0;
                let originTag = item.source_country;
                let hasLocation = false;

                // Priority 1: Direct Country Match from Cron
                if (item.source_country === 'IRAN' || item.source_country.includes('IRAN')) {
                    lat = 35.6892; lng = 51.3890; hasLocation = true;
                    originTag = 'TEHRAN';
                } else if (item.source_country === 'QATAR') {
                    lat = 25.2854; lng = 51.5310; hasLocation = true;
                    originTag = 'DOHA (QATAR)';
                } else if (item.source_country === 'UAE') {
                    lat = 25.2048; lng = 55.2708; hasLocation = true;
                    originTag = 'UAE (DUBAI)';
                } else if (item.source_country === 'YEMEN (HOUTHI)') {
                    lat = 15.3694; lng = 44.1910; hasLocation = true;
                    originTag = 'YEMEN (HOUTHI)';
                } else if (item.source_country === 'USA (CENTCOM)') {
                    lat = 24.0; lng = 50.0; hasLocation = true; // Persian Gulf / HQ
                    originTag = 'CENTCOM OPS';
                } else if (item.source_country === 'FLIGHTRADAR24') {
                    lat = 25.25; lng = 55.30; hasLocation = true;
                    originTag = 'FLIGHTRADAR';
                }

                // Priority 2: Keyword Scrutiny (Geocoding unknown/global sources)
                if (!hasLocation || item.source_country === 'USA' || item.source_country === 'UK' || item.source_country === 'UN') {
                    if (content.includes('tehran') || content.includes('iran')) {
                        lat = 35.68; lng = 51.38; hasLocation = true;
                        originTag = `TEHRAN (${item.source_name})`;
                    } else if (content.includes('doha') || content.includes('qatar')) {
                        lat = 25.28; lng = 51.53; hasLocation = true;
                        originTag = `DOHA (${item.source_name})`;
                    } else if (content.includes('dubai') || content.includes('abu dhabi') || content.includes('uae')) {
                        lat = 25.20; lng = 55.27; hasLocation = true;
                        originTag = `UAE (${item.source_name})`;
                    } else if (content.includes('red sea') || content.includes('houthi') || content.includes('yemen')) {
                        lat = 15.5; lng = 45.0; hasLocation = true;
                        originTag = `RED SEA (${item.source_name})`;
                    }
                }

                // Priority 3: LiveUAMap specific geocoding
                if (!hasLocation && item.source_country.includes('LIVEUAMAP')) {
                    const origin = item.source_country.toUpperCase();
                    if (origin.includes('IRAN') || origin.includes('TEHRAN')) {
                        lat = 35.68; lng = 51.38; hasLocation = true;
                    } else if (origin.includes('ISRAEL')) {
                        lat = 32.08; lng = 34.78; hasLocation = true;
                    } else if (origin.includes('LEBANON')) {
                        lat = 33.89; lng = 35.50; hasLocation = true;
                    } else if (origin.includes('SYRIA')) {
                        lat = 33.51; lng = 36.27; hasLocation = true;
                    } else if (origin.includes('YEMEN')) {
                        lat = 15.36; lng = 44.19; hasLocation = true;
                    }
                }

                // Final Filter: If no regional link found, discard from map to prevent "wrong" links
                if (!hasLocation) return null;

                // Moderate scatter (0.4 deg) to handle increased density without leaving city bounds too far
                const scatter = 0.4;
                lat += (Math.random() - 0.5) * scatter;
                lng += (Math.random() - 0.5) * scatter;

                return {
                    id: item.id || `osint-${i}`,
                    uniqueKey: `marker-${i}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    lat,
                    lng,
                    latOffset: lat,
                    lngOffset: lng,
                    type: 'live',
                    origin: originTag,
                    payload: item.source_country === 'FLIGHTRADAR24' ? 'COMMERCIAL' : (item.raw_content.toLowerCase().includes('drone') ? 'UAV' : 'Ballistic'),
                    time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour12: false }),
                    source_url: item.url,
                    raw_content: item.raw_content
                };
            })
            .filter(Boolean)
            .slice(0, 100);
    }, [intelStream]);

    return (
        <div className="absolute inset-0 bg-[#0a0f14] flex flex-col lg:block overflow-x-hidden overflow-y-auto custom-terminal-scroll">
            {/* The Actual Real Map Container */}
            <div className="relative w-full h-[60vh] shrink-0 lg:absolute lg:inset-0">
                <MapContainer
                    center={[25.3, 51.5]}
                    zoom={6}
                    minZoom={3}
                    maxZoom={10}
                    zoomControl={false}
                    className="w-full h-full bg-[#0a0f14]"
                    style={{ background: '#0a0f14' }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        maxZoom={19}
                    />
                    {dots.map((dot) => (
                        <Marker
                            key={dot.uniqueKey}
                            position={[dot.lat, dot.lng]}
                            icon={createPulsingIcon(dot.type)}
                        >
                            <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-leaflet-tooltip !bg-[#0a0f12]/90 !border !border-cyan-500/30 !text-white !font-mono !text-[10px] !uppercase !tracking-widest !rounded !p-2 !shadow-lg">
                                <span className={`${dot.origin === 'USA (CENTCOM)' ? 'text-cyan-500' : 'text-red-500'} font-bold`}>{dot.origin}</span>
                                <br />
                                <span className="opacity-70">{dot.payload} detected</span>
                            </Tooltip>

                            {/* Native High-Tech Popup */}
                            <Popup offset={[0, -10]} className="custom-cyber-popup">
                                <div className="flex flex-col font-mono m-[-14px]">
                                    <div className="bg-[#0a0f12]/95 border border-cyan-500/50 p-3 min-w-[220px]">
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                                            Verified Event ID
                                        </div>
                                        <div className="text-white text-[10px] bg-zinc-900/50 p-1.5 border border-zinc-800 rounded break-all select-all mb-3">
                                            #{dot.origin}-UNK-{new Date().getFullYear()}-{dot.id.toString().padStart(4, '0')}
                                        </div>

                                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                                            Coordinates
                                        </div>
                                        <div className="text-cyan-400 text-[10px] bg-cyan-900/10 p-1.5 border border-cyan-500/20 rounded flex justify-between mb-3">
                                            <span>{dot.latOffset.toFixed(4)}° N</span>
                                            <span>{dot.lngOffset.toFixed(4)}° E</span>
                                        </div>

                                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                                            {dot.origin === 'FLIGHTRADAR' ? 'Flight Telemetry' : 'Live OSINT Intercept'}
                                        </div>
                                        <div className="text-yellow-500 text-[9px] bg-yellow-900/10 p-1.5 border border-yellow-500/20 rounded mb-3 leading-tight italic">
                                            &quot;{dot.raw_content}&quot;
                                        </div>

                                        <a
                                            href={dot.source_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 text-center text-[10px] tracking-widest uppercase font-bold transition-all rounded decoration-none"
                                        >
                                            [ VIEW RAW SOURCE ]
                                        </a>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Active Strike Markers for Tehran Refineries */}
                    <Marker position={[35.5892, 51.4890]} icon={createPulsingIcon('live')}>
                        <Tooltip permanent direction="top" offset={[0, -10]} className="!bg-red-900/90 !border-red-500 !text-white !font-bold">
                            ACTIVE STRIKE: TONDGOUYAN REFINERY
                        </Tooltip>
                    </Marker>
                    <Marker position={[35.7892, 51.2890]} icon={createPulsingIcon('live')}>
                        <Tooltip permanent direction="top" offset={[0, -10]} className="!bg-red-900/90 !border-red-500 !text-white !font-bold">
                            ACTIVE STRIKE: SHAHRAN REFINERY
                        </Tooltip>
                    </Marker>
                </MapContainer>
            </div>

            {/* Simulated Map Scanning Line (Overlaid) */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/50 shadow-[0_0_20px_theme('colors.cyan.500')] animate-[scan_4s_linear_infinite] pointer-events-none z-[1000]" />

            {/* Map Labels */}
            <div className="absolute top-4 left-4 text-xs font-mono text-cyan-500/80 tracking-widest uppercase z-[1000] pointer-events-none">
                GEO INTEL COMMAND // MIDDLE EAST FRONT
            </div>

            {/* Missile Tracking HUD per Country */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-[1000] bg-[#0a0f12]/80 backdrop-blur-md border border-[#22c55e]/20 rounded p-3 w-72 shadow-[0_0_15px_rgba(0,0,0,0.8)] pointer-events-auto hidden md:block">
                <div className="text-[10px] text-[#22c55e]/70 uppercase tracking-widest font-bold mb-2 pb-1 border-b border-[#22c55e]/20 flex items-center justify-between">
                    <span>Regional Telemetry</span>
                    <span className="text-[8px] animate-pulse text-red-500">LIVE</span>
                </div>
                <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase">

                    {/* Header */}
                    <div className="flex items-center text-zinc-500 mb-1 border-b border-zinc-800 pb-1 text-[9px]">
                        <span className="w-16">Origin</span>
                        <span className="flex-1 text-center font-bold text-red-500/80">Launched</span>
                        <span className="flex-1 text-right font-bold text-cyan-500/80">Intercepted</span>
                    </div>

                    {[
                        { country: 'IRAN (TEHRAN)', sent: 4210, stopped: 955, color: 'text-red-500' },
                        { country: 'QATAR (DOHA)', sent: 165 + 12, stopped: 162 + 12, color: 'text-orange-500' },
                        { country: 'YEMEN (HOUTHI)', sent: 130, stopped: 100, color: 'text-orange-400' },
                        { country: 'USA (CENTCOM)', sent: 110, stopped: 110, color: 'text-cyan-500' },
                        { country: 'SAUDI', sent: 32, stopped: 32, color: 'text-emerald-500' },
                        { country: 'BAHRAIN', sent: 2, stopped: 2, color: 'text-emerald-400' },
                        { country: 'UAE (DUBAI)', sent: 18 + 129, stopped: 18 + 129, color: 'text-emerald-300' },
                    ].map(stat => (
                        <div key={stat.country} className="flex items-center group hover:bg-[#22c55e]/5 p-0.5 -mx-0.5 rounded transition-colors cursor-default">
                            <span className={`w-28 font-bold ${stat.color} tracking-wider truncate`}>{stat.country}</span>
                            <span className="flex-1 text-center text-zinc-300">{stat.sent.toLocaleString()}</span>
                            <span className="flex-1 text-right text-cyan-400 group-hover:text-cyan-300 transition-colors">{stat.stopped.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
