'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ProvenancePanel from './ProvenancePanel';

// Public generic example Mapbox token for local dev rendering
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'PUT_YOUR_MAPBOX_TOKEN_HERE';

export default function MapboxMap() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [verificationData, setVerificationData] = useState<any>(null);

    // Generate random missile tracking data mapping to actual lat/lngs in the Middle East
    const [dots, setDots] = useState<any[]>(() => {
        const generated = [];
        const origins = ['IRAN', 'YEMEN', 'LEBANON'];
        const payloads = ['Ballistic', 'Cruise', 'Drone', 'Rocket'];
        for (let i = 0; i < 45; i++) {
            // Rough coordinates for ME bounds: Lng [30 to 60], Lat [15 to 35]
            const lng = Math.random() * 30 + 30;
            const lat = Math.random() * 20 + 15;
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
                source_url: 'https://acleddata.com/dashboard/#/dashboard'
            });
        }
        return generated;
    });

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Mapbox GL JS Configuration from user spec
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v12', // Real satellite + Labels
            center: [45.0, 25.0], // Middle East Focus
            zoom: 3.5,
            pitch: 45, // 3D Perspective
            bearing: 0,
            projection: 'globe', // Renders the map as a 3D globe at low zoom
        });

        mapRef.current = map;

        // Custom Layer to 'Dim' the satellite for the "War Room" aesthetic
        map.on('style.load', () => {
            map.setFog({
                color: 'rgb(10, 15, 20)',
                'high-color': 'rgb(0, 0, 0)',
                'space-color': 'rgb(0, 0, 0)'
            });
            map.setPaintProperty('satellite', 'raster-opacity', 0.6);
            map.setPaintProperty('satellite', 'raster-brightness-max', 0.7);

            // Ensure country-label text is neon-cyan for visibility
            try {
                map.setPaintProperty('country-label', 'text-color', '#00f2ff');
            } catch (e) { /* Ignore if layer doesn't exist yet */ }
        });

        // Add custom markers using standard DOM
        dots.forEach((dot) => {
            // Create DOM element for the marker
            const el = document.createElement('div');
            el.className = 'marker group cursor-pointer relative flex items-center justify-center w-6 h-6 hover:scale-150 transition-transform';

            // Define inner marker UI (pulsing red dot)
            el.innerHTML = `
                <div class="w-2 h-2 rounded-full ${dot.type === 'live' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]' : 'bg-zinc-600'}"></div>
                ${dot.type === 'live' ? '<div class="absolute inset-0 rounded-full border border-red-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>' : ''}
            `;

            // On Click => Dispatch Verification Data
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                setVerificationData(dot);
            });

            new mapboxgl.Marker({ element: el })
                .setLngLat([dot.lng, dot.lat])
                .addTo(map);
        });

        return () => {
            if (mapRef.current) mapRef.current.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div className="absolute inset-0 bg-[#0a0f14] overflow-hidden">
            {/* The Actual Real Map Container */}
            <div ref={mapContainerRef} className="absolute inset-0" />

            {/* Simulated Map Scanning Line (Overlaid) */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/50 shadow-[0_0_20px_theme('colors.cyan.500')] animate-[scan_4s_linear_infinite] pointer-events-none" />

            {/* Map Labels */}
            <div className="absolute top-4 left-4 text-xs font-mono text-cyan-500/80 tracking-widest uppercase z-40 pointer-events-none">
                GEO INTEL COMMAND // MIDDLE EAST FRONT
            </div>

            {/* Missile Tracking HUD per Country */}
            <div className="absolute bottom-4 left-4 z-40 bg-[#0a0f12]/80 backdrop-blur-md border border-[#22c55e]/20 rounded p-3 w-72 shadow-[0_0_15px_rgba(0,0,0,0.8)] pointer-events-auto">
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
                        { country: 'YEMEN', sent: 423, stopped: 98, color: 'text-orange-500' },
                        { country: 'LEBANON', sent: 892, stopped: 340, color: 'text-red-400' },
                        { country: 'SAUDI', sent: 145, stopped: 140, color: 'text-emerald-500' },
                        { country: 'QATAR', sent: 45, stopped: 45, color: 'text-emerald-400' },
                        { country: 'BAHRAIN', sent: 12, stopped: 12, color: 'text-emerald-400' },
                        { country: 'UAE (DUBAI)', sent: 24, stopped: 23, color: 'text-emerald-300' },
                        { country: 'ABU DHABI', sent: 37, stopped: 35, color: 'text-emerald-300' },
                    ].map(stat => (
                        <div key={stat.country} className="flex items-center group hover:bg-[#22c55e]/5 p-0.5 -mx-0.5 rounded transition-colors cursor-default">
                            <span className={`w-16 font-bold ${stat.color} tracking-wider`}>{stat.country}</span>
                            <span className="flex-1 text-center text-zinc-300">{stat.sent.toLocaleString()}</span>
                            <span className="flex-1 text-right text-cyan-400 group-hover:text-cyan-300 transition-colors">{stat.stopped.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* The Verification Pane Overlay passed to children from state */}
            <ProvenancePanel verificationData={verificationData} onClose={() => setVerificationData(null)} />
        </div>
    );
}
