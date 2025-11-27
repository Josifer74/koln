import { useTexture } from '@react-three/drei';
import { DoubleSide, MeshBasicMaterial } from 'three';

interface LionObjectProps {
    scale?: number;
}

export default function LionObject({ scale = 1 }: LionObjectProps) {
    const texture = useTexture('/assets/lion.png');

    return (
        <group scale={[scale, scale, scale]}>
            {/* Billboarded Lion Plane */}
            {/* We rotate it to face the user initially, but for true billboarding we might need LookAt in useFrame. 
                However, the user asked for a "flat billboard plane". 
                Usually in AR, objects placed on the floor stand up. 
                So we rotate X by 0 (vertical) if the anchor is horizontal. 
                But wait, the anchor orientation depends on the hit test. 
                Usually hit test on floor gives Y-up. 
                So a plane with default geometry (XY plane) needs to be upright? 
                No, standard plane is XY. To stand on floor (XZ), we don't rotate if we want it flat on floor. 
                But we want a "Card" standing up. 
                So we need to rotate it. 
            */}
            <mesh position={[0, 0.5, 0]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial
                    map={texture}
                    transparent
                    side={DoubleSide}
                    alphaTest={0.5} // Cutout transparency
                />
            </mesh>

            {/* Shadow Plane (Optional) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <circleGeometry args={[0.4, 32]} />
                <meshBasicMaterial color="black" opacity={0.3} transparent />
            </mesh>
        </group>
    );
}
