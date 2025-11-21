import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Group, AdditiveBlending, DoubleSide } from 'three';

interface ParallaxLayersProps {
    orientation: { x: number; y: number };
}

export default function ParallaxLayers({ orientation }: ParallaxLayersProps) {
    const groupRef = useRef<Group>(null);

    // Load textures
    const bgTexture = useTexture('/assets/layer_back.png');
    const midTexture = useTexture('/assets/layer_mid.png');
    const frontTexture = useTexture('/assets/layer_front.png');

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
            {/* Background Layer */}
            <mesh position={[0, 1, -8]}>
                <planeGeometry args={[16, 10]} />
                <meshBasicMaterial
                    map={bgTexture}
                    transparent
                    opacity={0.6}
                    blending={AdditiveBlending}
                    side={DoubleSide}
                />
            </mesh>

            {/* Midground Layer */}
            <mesh position={[0, 0, -4]}>
                <planeGeometry args={[12, 8]} />
                <meshBasicMaterial
                    map={midTexture}
                    transparent
                    opacity={0.8}
                    blending={AdditiveBlending}
                    side={DoubleSide}
                />
            </mesh>

            {/* Foreground Layer */}
            <mesh position={[0, -2, -1]}>
                <planeGeometry args={[8, 6]} />
                <meshBasicMaterial
                    map={frontTexture}
                    transparent
                    opacity={1}
                    blending={AdditiveBlending}
                    side={DoubleSide}
                />
            </mesh>
        </group>
    );
}
