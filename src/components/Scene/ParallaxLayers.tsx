import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import { Group } from 'three';

interface ParallaxLayersProps {
    orientation: { x: number; y: number };
}

export default function ParallaxLayers({ orientation }: ParallaxLayersProps) {
    const groupRef = useRef<Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            // Smooth interpolation could be added here using lerp
            // For now, direct mapping
            groupRef.current.rotation.y = orientation.x * 0.2; // Rotate slightly based on tilt
            groupRef.current.rotation.x = orientation.y * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Background Layer - Furthest away, moves least */}
            <Image
                url="/assets/layer_back.png"
                scale={[12, 8]}
                position={[0, 0, -5]}
                transparent
                opacity={1}
            />

            {/* Midground Layer */}
            <Image
                url="/assets/layer_mid.png"
                scale={[10, 7]}
                position={[0, -1, -2]}
                transparent
                opacity={1}
            />

            {/* Foreground Layer - Closest, moves most (relative to camera) */}
            <Image
                url="/assets/layer_front.png"
                scale={[8, 6]}
                position={[0, -1.5, 0]}
                transparent
                opacity={1}
            />
        </group>
    );
}
