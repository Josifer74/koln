'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import ParallaxLayers from './ParallaxLayers';

interface ARSceneProps {
    orientation: { x: number; y: number; yaw?: number };
    cameraEnabled: boolean;
}

export default function ARScene({ orientation, cameraEnabled }: ARSceneProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [activeAsset, setActiveAsset] = useState<'kite' | 'station' | 'lion'>('kite');
    const [anchorOffset, setAnchorOffset] = useState(0);

    const handlePlaceLion = () => {
        // Anchor the lion to the current view direction
        // We want the lion to appear IN FRONT of the user (at 0 rotation relative to camera)
        // So we set the offset such that: -yaw + offset = 0  =>  offset = yaw
        setAnchorOffset(orientation.yaw || 0);
    };

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
                    <ParallaxLayers
                        orientation={orientation}
                        activeAsset={activeAsset}
                        anchorOffset={anchorOffset}
                    />
                </Canvas>
            </div>

            {/* UI Controls */}
            <div className="absolute bottom-10 left-0 w-full z-20 flex flex-col items-center gap-4">

                {/* Place Button for Lion */}
                {activeAsset === 'lion' && (
                    <button
                        onClick={handlePlaceLion}
                        className="mb-4 px-8 py-3 rounded-full font-bold bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse"
                    >
                        PLACE LION HERE
                    </button>
                )}

                <div className="flex justify-center gap-4">
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
                    <button
                        onClick={() => setActiveAsset('lion')}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${activeAsset === 'lion'
                                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-105'
                                : 'bg-black/50 text-white backdrop-blur-sm border border-white/30'
                            }`}
                    >
                        Lion
                    </button>
                </div>
            </div>
        </div>
    );
}
