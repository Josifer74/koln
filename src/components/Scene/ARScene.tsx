'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import ParallaxLayers from './ParallaxLayers';

interface ARSceneProps {
    orientation: { x: number; y: number };
    cameraEnabled: boolean;
}

export default function ARScene({ orientation, cameraEnabled }: ARSceneProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [activeAsset, setActiveAsset] = useState<'kite' | 'station'>('kite');

    useEffect(() => {
        if (cameraEnabled && videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((err) => console.error("Camera access denied:", err));
        }
    }, [cameraEnabled]);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* Camera Feed Background */}
            {cameraEnabled && (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-100" // Full opacity for AR
                />
            )}

            {/* 3D Scene */}
            <div className="absolute top-0 left-0 w-full h-full z-10">
                <Canvas>
                    <ambientLight intensity={1} />
                    <ParallaxLayers orientation={orientation} activeAsset={activeAsset} />
                </Canvas>
            </div>

            {/* UI Controls */}
            <div className="absolute bottom-10 left-0 w-full z-20 flex justify-center gap-4">
                <button
                    onClick={() => setActiveAsset('kite')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${activeAsset === 'kite'
                        ? 'bg-white text-black shadow-lg scale-105'
                        : 'bg-black/50 text-white backdrop-blur-sm border border-white/30'
                        }`}
                >
                    Kite
                </button>
                <button
                    onClick={() => setActiveAsset('station')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${activeAsset === 'station'
                        ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.6)] scale-105'
                        : 'bg-black/50 text-white backdrop-blur-sm border border-white/30'
                        }`}
                >
                    Station
                </button>
            </div>
        </div>
    );
}
