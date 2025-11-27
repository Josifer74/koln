import { useState, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Matrix4 } from 'three';
import * as THREE from 'three';
import Reticle from './Reticle';
import LionObject from './LionObject';

export default function LionPlacementManager() {
    const [isPlaced, setIsPlaced] = useState(false);
    const [placementMatrix, setPlacementMatrix] = useState<Matrix4 | null>(null);
    const reticleRef = useRef<Matrix4>(new Matrix4());
    const [isReticleVisible, setIsReticleVisible] = useState(false);
    const hitTestSourceRequested = useRef(false);
    const hitTestSource = useRef<any>(null);

    const { gl } = useThree();

    useFrame((state, delta, frame: any) => {
        if (isPlaced) return;

        const session = gl.xr.getSession();
        if (!session) return;

        if (!hitTestSourceRequested.current) {
            session.requestReferenceSpace('viewer').then((referenceSpace: any) => {
                session.requestHitTestSource({ space: referenceSpace }).then((source: any) => {
                    hitTestSource.current = source;
                });
            });
            session.addEventListener('end', () => {
                hitTestSourceRequested.current = false;
                hitTestSource.current = null;
            });
            hitTestSourceRequested.current = true;
        }

        if (hitTestSource.current && frame) {
            const referenceSpace = gl.xr.getReferenceSpace();
            if (referenceSpace) {
                const hitTestResults = frame.getHitTestResults(hitTestSource.current);
                if (hitTestResults.length > 0) {
                    const hit = hitTestResults[0];
                    const pose = hit.getPose(referenceSpace);
                    if (pose) {
                        setIsReticleVisible(true);
                        reticleRef.current.fromArray(pose.transform.matrix);
                    }
                } else {
                    setIsReticleVisible(false);
                }
            }
        }
    });

    // Handle Tap
    useEffect(() => {
        const session = gl.xr.getSession();
        if (!session) return;

        const handleSelect = () => {
            if (!isPlaced && isReticleVisible) {
                const matrix = new Matrix4().copy(reticleRef.current);
                setPlacementMatrix(matrix);
                setIsPlaced(true);
            }
        };

        session.addEventListener('select', handleSelect);
        return () => session.removeEventListener('select', handleSelect);
    }, [gl.xr, isPlaced, isReticleVisible]);

    return (
        <>
            {!isPlaced && (
                <Reticle visible={isReticleVisible} matrix={reticleRef.current} />
            )}

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
