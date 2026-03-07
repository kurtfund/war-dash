'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const WarHeart = dynamic(() => import('./WarHeart'), { ssr: false });

export default function WarHeartbeat({ score }: { score: number | string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isExploded, setIsExploded] = useState(false);

    // Logic for the Particle Blast
    const triggerExplosion = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsExploded(true);

        // Resize canvas to match container
        canvas.width = 256;
        canvas.height = 256;

        // Simple particle logic: Create 50 particles moving outward
        const particles = Array.from({ length: 80 }, () => ({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            life: 1.0,
            color: Math.random() > 0.5 ? '#06b6d4' : '#ffffff' // cyan and white
        }));

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
                ctx.fillStyle = `rgba(${p.color === '#06b6d4' ? '6, 182, 212' : '255, 255, 255'}, ${p.life})`;
                ctx.fillRect(p.x, p.y, Math.random() * 3 + 1, Math.random() * 3 + 1);
            });
            if (particles[0].life > 0) {
                requestAnimationFrame(animate);
            } else {
                // Reset explosion state after it finishes
                setTimeout(() => setIsExploded(false), 5000); // stay revealed for 5 sec
            }
        };

        animate();
    };

    return (
        <div
            className="relative flex items-center justify-center w-64 h-64 pointer-events-auto group"
            onMouseEnter={triggerExplosion}
            onClick={triggerExplosion}
            style={{ cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text y="24" font-size="24">🚀</text></svg>') 16 16, crosshair` }}
        >
            {/* The Interactive 3D Reactor */}
            <div className="absolute inset-0 z-0">
                <WarHeart />
            </div>

            <canvas
                ref={canvasRef}
                width={256}
                height={256}
                className="absolute z-10 pointer-events-none"
            />

            <div className="z-20 text-center flex flex-col items-center justify-center transition-opacity duration-300 backdrop-blur-sm bg-black/40 rounded-full w-40 h-40 border border-zinc-800/50">
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 mb-1">Conflict Score</span>
                <div className="text-6xl font-bold font-mono text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    {isExploded ? score : "??.?"}
                </div>
                {!isExploded && (
                    <span className="text-[8px] text-zinc-500 uppercase mt-2 font-mono group-hover:opacity-0 transition-opacity">
                        <span className="block sm:hidden">Tap to Reveal</span>
                        <span className="hidden sm:block">Hover to Reveal</span>
                    </span>
                )}
            </div>
        </div>
    );
}
