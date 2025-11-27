import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Group, DoubleSide, AdditiveBlending } from 'three';

interface ParallaxLayersProps {
    orientation: { x: number; y: number };
    activeAsset: 'kite' | 'station';
}

export default function ParallaxLayers({ orientation, activeAsset }: ParallaxLayersProps) {
    const groupRef = useRef<Group>(null);

    // Load textures
    const kiteTexture = useTexture('/assets/kite.png');
    const stationTexture = useTexture('/assets/station.png');

    useFrame(() => {
        if (groupRef.current) {
            // Apply orientation to rotation
            // Invert X for "window" effect
            groupRef.current.rotation.y = orientation.x;
            groupRef.current.rotation.x = orientation.y;
        }
    });

    return (
        <group ref={groupRef}>
            {activeAsset === 'kite' && (
                <mesh position={[0, 0, -5]}>
                    <planeGeometry args={[5, 5]} />
                    <meshBasicMaterial
                        map={kiteTexture}
                        transparent
                        opacity={1}
                        side={DoubleSide}
                    />
                </mesh>
            )}

            {activeAsset === 'station' && (
                <mesh position={[0, 0, -8]}>
                    {/* Larger scale for the station to feel immersive */}
                    <planeGeometry args={[16, 9]} />
                    <meshBasicMaterial
                        map={stationTexture}
                        transparent
                        opacity={0.9}
                        blending={AdditiveBlending} // Glowing effect
                        side={DoubleSide}
                    />
                </mesh>
            )}
        </group>
    );
}
