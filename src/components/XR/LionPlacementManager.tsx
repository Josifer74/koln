import { useState, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useHitTest, useXR } from '@react-three/xr';
import { Matrix4, Vector3, Quaternion } from 'three';
import * as THREE from 'three';
import Reticle from './Reticle';
import LionObject from './LionObject';

// Helper to handle the "Select" event globally for the scene
export function XRInputHandler({ onSelect }: { onSelect: () => void }) {
    const { session } = useXR();

    useEffect(() => {
        if (!session) return;

        const handleSelect = (e: any) => { // Type 'any' to avoid TS issues with WebXR types if missing
            onSelect();
        };

        session.addEventListener('select', handleSelect);
        return () => session.removeEventListener('select', handleSelect);
    }, [session, onSelect]);

    return null;
}

export default function LionPlacementManager() {
    const [isPlaced, setIsPlaced] = useState(false);
    const [placementMatrix, setPlacementMatrix] = useState<Matrix4 | null>(null);
    const reticleRef = useRef<Matrix4>(new Matrix4());
    const [isReticleVisible, setIsReticleVisible] = useState(false);

    // Hit testing
    useHitTest((hitMatrix, hit) => {
        if (!isPlaced) {
            // Update reticle position
            reticleRef.current.copy(hitMatrix);
            setIsReticleVisible(true);
        } else {
            setIsReticleVisible(false);
        }
    });

    const handleSelect = () => {
        if (!isPlaced && isReticleVisible) {
            // Capture the current reticle matrix as the placement anchor
            const matrix = new Matrix4().copy(reticleRef.current);
            setPlacementMatrix(matrix);
            setIsPlaced(true);
        }
    };

    return (
        <>
            <XRInputHandler onSelect={handleSelect} />

            {/* Reticle */}
            {!isPlaced && (
                <Reticle visible={isReticleVisible} matrix={reticleRef.current} />
            )}

            {/* Placed Lion */}
            {isPlaced && placementMatrix && (
                <group>
                    <primitive object={new THREE.Group()}
                        ref={(node: THREE.Group) => {
                            if (node) {
                                node.matrixAutoUpdate = false;
                                node.matrix.copy(placementMatrix);
                            }
                        }}
                    >
                        <LionObject scale={1} />
                    </primitive>
                </group>
            )}
        </>
    );
}
