'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import ParallaxLayers from './ParallaxLayers';

interface ARSceneProps {
    orientation: { x: number; y: number };
    cameraEnabled: boolean;
}

export default function ARScene({ orientation, cameraEnabled }: ARSceneProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

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
                    <ParallaxLayers orientation={orientation} />
                </Canvas>
            </div>
        </div>
    );
}
