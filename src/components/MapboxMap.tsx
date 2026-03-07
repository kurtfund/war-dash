'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

export default function MapboxMap() {

    // Generate random missile tracking data mapping to actual lat/lngs in the Middle East
    const [dots] = useState<any[]>(() => {
        const generated = [];
        const origins = ['IRAN', 'YEMEN', 'USA (CENTCOM)'];
        const payloads = ['Ballistic', 'Cruise', 'Drone', 'Rocket'];
        for (let i = 0; i < 45; i++) {
            // Rough coordinates for ME bounds: Lng [30 to 60], Lat [15 to 35]
            const lng = Math.random() * 30 + 30;
            const lat = Math.random() * 20 + 15;
            const baseNewsEndpoints = [
                'https://www.reuters.com/world/middle-east/article-',
                'https://apnews.com/hub/middle-east/report-',
                'https://www.aljazeera.com/middle-east/update-'
            ];
            const mockUniqueId = Math.floor(Math.random() * 899999) + 100000;
            const endpoint = baseNewsEndpoints[Math.floor(Math.random() * baseNewsEndpoints.length)];

            generated.push({
                id: i,
                lat,
                lng,
                // Required by user spec:
                latOffset: lat,
                lngOffset: lng,
                type: 'live',
                origin: origins[Math.floor(Math.random() * origins.length)],
                payload: payloads[Math.floor(Math.random() * payloads.length)],
                time: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString('en-US', { hour12: false }),
                source_url: `${endpoint}${mockUniqueId}`
            });
        }
        return generated;
    });

    return (
        <div className="absolute inset-0 bg-[#0a0f14] overflow-hidden">
            {/* The Actual Real Map Container */}
            <div className="absolute inset-0">
                <MapContainer
                    center={[25.0, 45.0]}
                    zoom={5}
                    minZoom={4}
                    maxZoom={6}
                    dragging={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
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
                            key={dot.id}
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
                </MapContainer>
            </div>

            {/* Simulated Map Scanning Line (Overlaid) */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/50 shadow-[0_0_20px_theme('colors.cyan.500')] animate-[scan_4s_linear_infinite] pointer-events-none z-[1000]" />

            {/* Map Labels */}
            <div className="absolute top-4 left-4 text-xs font-mono text-cyan-500/80 tracking-widest uppercase z-[1000] pointer-events-none">
                GEO INTEL COMMAND // MIDDLE EAST FRONT
            </div>

            {/* Missile Tracking HUD per Country */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-[#0a0f12]/80 backdrop-blur-md border border-[#22c55e]/20 rounded p-3 w-72 shadow-[0_0_15px_rgba(0,0,0,0.8)] pointer-events-auto">
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
                        { country: 'IRAN', sent: 1847, stopped: 412, color: 'text-red-500' },
                        { country: 'YEMEN (HOUTHI)', sent: 423, stopped: 98, color: 'text-orange-500' },
                        { country: 'USA (CENTCOM)', sent: 245, stopped: 198, color: 'text-cyan-500' },
                        { country: 'SAUDI', sent: 145, stopped: 140, color: 'text-emerald-500' },
                        { country: 'QATAR', sent: 45, stopped: 45, color: 'text-emerald-400' },
                        { country: 'BAHRAIN', sent: 12, stopped: 12, color: 'text-emerald-400' },
                        { country: 'UAE', sent: 61, stopped: 58, color: 'text-emerald-300' },
                    ].map(stat => (
                        <div key={stat.country} className="flex items-center group hover:bg-[#22c55e]/5 p-0.5 -mx-0.5 rounded transition-colors cursor-default">
                            <span className={`w-16 font-bold ${stat.color} tracking-wider`}>{stat.country}</span>
                            <span className="flex-1 text-center text-zinc-300">{stat.sent.toLocaleString()}</span>
                            <span className="flex-1 text-right text-cyan-400 group-hover:text-cyan-300 transition-colors">{stat.stopped.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
