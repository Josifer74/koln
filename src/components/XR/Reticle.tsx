import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface ReticleProps {
    visible: boolean;
    matrix: THREE.Matrix4;
}

export default function Reticle({ visible, matrix }: ReticleProps) {
    const meshRef = useRef<Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.visible = visible;
            if (visible && matrix) {
                meshRef.current.matrix.copy(matrix);
                // Ensure matrix auto-update is disabled so we can manually set the matrix
                meshRef.current.matrixAutoUpdate = false;
            }
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.15, 0.2, 32]} />
            <meshBasicMaterial color="white" />
        </mesh>
    );
}
