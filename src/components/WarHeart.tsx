'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function HeartScene({ isRevealed }: { isRevealed: boolean }) {
    const heartRef = useRef<THREE.Mesh>(null);
    const smokeRef = useRef<THREE.Mesh>(null);

    // Create a 3D heart shape using Three.js Shape API
    const heartShape = useMemo(() => {
        const x = 0, y = 0;
        const shape = new THREE.Shape();

        shape.moveTo(x + 5, y + 5);
        shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
        shape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
        shape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
        shape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
        shape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
        shape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

        return shape;
    }, []);

    const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

    // The "Beating" Animation
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (heartRef.current) {
            const scale = 0.05 + Math.sin(t * 4) * 0.005; // Rhythmic pulse (scaled down for the 10x10 shape)
            heartRef.current.scale.set(scale, scale, scale);
            // Center the extruded heart by offsetting its position
            heartRef.current.position.set(-0.25, 0.45, 0);
            // Rotate the shape 180 degrees so it points down
            heartRef.current.rotation.z = Math.PI;
        }
        if (smokeRef.current && !isRevealed) {
            smokeRef.current.rotation.y += 0.01; // Swirling fog
            smokeRef.current.rotation.x += 0.005;
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} color="#00f2ff" />
            <pointLight position={[-10, -10, -10]} color={isRevealed ? "#ff0033" : "#00f2ff"} intensity={0.5} />

            {/* The Volumetric Smoke (Visible until click) */}
            {!isRevealed && (
                <mesh ref={smokeRef}>
                    <sphereGeometry args={[2.5, 32, 32]} />
                    <MeshDistortMaterial color="#1a1a2e" speed={2} distort={0.6} transparent opacity={0.8} roughness={0.9} />
                </mesh>
            )}

            {/* The Arc Reactor Heart */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={heartRef}>
                    <extrudeGeometry args={[heartShape, extrudeSettings]} />
                    <meshStandardMaterial
                        color={isRevealed ? "#ff0033" : "#111"}
                        emissive={isRevealed ? "#ff0033" : "#111"}
                        emissiveIntensity={isRevealed ? 2 : 0.2}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </mesh>
            </Float>
        </>
    );
}

const WarHeart = () => {
    const [isRevealed, setRevealed] = useState(false);

    return (
        <div className="absolute inset-0 z-0 cursor-crosshair" onClick={() => setRevealed(true)}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <HeartScene isRevealed={isRevealed} />
            </Canvas>
        </div>
    );
};

export default WarHeart;
