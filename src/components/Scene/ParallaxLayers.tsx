import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Group, DoubleSide, AdditiveBlending } from 'three';

interface ParallaxLayersProps {
    orientation: { x: number; y: number; yaw?: number };
    activeAsset: 'kite' | 'station' | 'lion';
    anchorOffset?: number;
}

export default function ParallaxLayers({ orientation, activeAsset, anchorOffset = 0 }: ParallaxLayersProps) {
    const groupRef = useRef<Group>(null);

    // Load textures
    const kiteTexture = useTexture('/assets/kite.png');
    const stationTexture = useTexture('/assets/station.png');
    const lionTexture = useTexture('/assets/lion.png');

    useFrame(() => {
        if (groupRef.current) {
            if (activeAsset === 'lion') {
                // World Locking Logic
                // We rotate the group opposite to the camera yaw to keep it stable in the world
                // Then we add the anchorOffset to place it where the user clicked
                const yaw = orientation.yaw || 0;
                groupRef.current.rotation.y = -yaw + anchorOffset;
                groupRef.current.rotation.x = orientation.y * 0.5; // Slight tilt allowed
            } else {
                // Screen Locking Logic (Parallax)
                // Invert X for "window" effect
                groupRef.current.rotation.y = orientation.x;
                groupRef.current.rotation.x = orientation.y;
            }
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
                    <planeGeometry args={[16, 9]} />
                    <meshBasicMaterial
                        map={stationTexture}
                        transparent
                        opacity={0.9}
                        blending={AdditiveBlending}
                        side={DoubleSide}
                    />
                </mesh>
            )}

            {activeAsset === 'lion' && (
                <mesh position={[0, -1, -6]}>
                    {/* Lion standing on the ground */}
                    <planeGeometry args={[6, 6]} />
                    <meshBasicMaterial
                        map={lionTexture}
                        transparent
                        opacity={1}
                        blending={AdditiveBlending}
                        side={DoubleSide}
                    />
                </mesh>
            )}
        </group>
    );
}
