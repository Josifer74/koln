import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Group, DoubleSide } from 'three';

interface ParallaxLayersProps {
    orientation: { x: number; y: number };
}

export default function ParallaxLayers({ orientation }: ParallaxLayersProps) {
    const groupRef = useRef<Group>(null);

    // Load textures
    // Load textures
    const kiteTexture = useTexture('/assets/kite.png');

    useFrame(() => {
        if (groupRef.current) {
            // High sensitivity for "Magic Window" feel
            // Inverting X rotation to make it feel like looking "through" a window
            groupRef.current.rotation.y = orientation.x * 1.5;
            groupRef.current.rotation.x = orientation.y * 0.8;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Kite Layer */}
            <mesh position={[0, 0, -5]}>
                <planeGeometry args={[5, 5]} /> {/* Adjust size as needed */}
                <meshBasicMaterial
                    map={kiteTexture}
                    transparent
                    opacity={1}
                    side={DoubleSide}
                />
            </mesh>
        </group>
    );
}
