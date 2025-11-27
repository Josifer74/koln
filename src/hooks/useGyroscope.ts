import { useState, useEffect, useRef } from 'react';

export default function useGyroscope() {
    const [orientation, setOrientation] = useState({ x: 0, y: 0, yaw: 0 });
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Refs for continuous tracking to avoid re-binding listeners
    const lastAlphaRef = useRef<number | null>(null);
    const cumulativeAlphaRef = useRef<number>(0);

    const requestAccess = async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && (DeviceOrientationEvent as any).requestPermission) {
            try {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === 'granted') {
                    setPermissionGranted(true);
                } else {
                    alert('Permission denied');
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            setPermissionGranted(true);
        }
    };

    useEffect(() => {
        if (!permissionGranted) return;

        const handleOrientation = (event: DeviceOrientationEvent) => {
            const gamma = event.gamma || 0; // Tilt Left/Right
            const beta = event.beta || 0;   // Tilt Front/Back
            const currentAlpha = event.alpha || 0; // Compass direction

            // Continuous Alpha Tracking (Fixes 0-360 jump)
            let deltaAlpha = 0;
            if (lastAlphaRef.current !== null) {
                deltaAlpha = currentAlpha - lastAlphaRef.current;
                // Handle wrap-around
                if (deltaAlpha > 180) deltaAlpha -= 360;
                if (deltaAlpha < -180) deltaAlpha += 360;
            }
            lastAlphaRef.current = currentAlpha;
            cumulativeAlphaRef.current += deltaAlpha;

            // Sensitivity for Parallax (Tilt)
            const sensitivity = 150;

            // X/Y for Parallax (Screen-locked effects like Kite)
            const x = gamma / sensitivity;
            const y = (beta - 45) / sensitivity;

            // Yaw for World Locking (Lion)
            // Convert degrees to radians for Three.js
            const yaw = (cumulativeAlphaRef.current * Math.PI) / 180;

            setOrientation({ x, y, yaw });
        };

        window.addEventListener('deviceorientation', handleOrientation);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, [permissionGranted]);

    useEffect(() => {
        if (typeof window !== 'undefined' && !('ontouchstart' in window)) {
            const handleMouseMove = (e: MouseEvent) => {
                const x = (e.clientX / window.innerWidth) * 2 - 1;
                const y = (e.clientY / window.innerHeight) * 2 - 1;
                // Simulate yaw with mouse X for testing
                const yaw = x * Math.PI;
                setOrientation({ x, y, yaw });
            };
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    return { orientation, requestAccess, permissionGranted };
}
