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
                // We rotate the LION mesh itself, not the group, to avoid messing up other potential layers if we had them.
                // But here we only show one asset at a time.
                // Rotating the group is fine.
                groupRef.current.rotation.y = -yaw + anchorOffset;
                groupRef.current.rotation.x = orientation.y * 0.5;
            } else if (activeAsset === 'station') {
                // Station Logic
                // We want it to be huge and surrounding
                // Less movement for background feel
                groupRef.current.rotation.y = orientation.x * 0.2;
                groupRef.current.rotation.x = orientation.y * 0.1;
            } else {
                // Kite Logic (Screen Locked / Parallax)
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
                <mesh position={[0, 0, -10]}>
                    {/* Huge scale to fill screen */}
                    <planeGeometry args={[40, 25]} />
                    <meshBasicMaterial
                        map={stationTexture}
                        transparent
                        opacity={0.5} // Lower opacity to let person show through better
                        blending={AdditiveBlending}
                        side={DoubleSide}
                    />
                </mesh>
            )}

            {activeAsset === 'lion' && (
                <mesh position={[0, -2, -6]}>
                    {/* Lion standing on the ground */}
                    <planeGeometry args={[7, 7]} />
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
