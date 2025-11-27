'use client';

import { ARCanvas } from '@react-three/xr';
import LionPlacementManager from '../XR/LionPlacementManager';

interface ARSceneProps {
    cameraEnabled: boolean; // Kept for compatibility, but WebXR handles camera
}

export default function ARScene({ cameraEnabled }: ARSceneProps) {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* AR Canvas handles the WebXR session and camera feed */}
            <ARCanvas
                sessionInit={{ requiredFeatures: ['hit-test'] }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            >
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} />

                <LionPlacementManager />
            </ARCanvas>

            {/* Note: The Overlay UI needs to trigger the AR session start. 
                @react-three/xr provides a default button, but we can customize it.
                However, ARCanvas automatically adds a button if not managed manually.
                Let's see if we need to adjust Overlay.tsx to hide its own button and let ARCanvas handle it,
                or use a custom button to start the session.
            */}
        </div>
    );
}
