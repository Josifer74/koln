import { useState, useEffect } from 'react';

export default function useGyroscope() {
    const [orientation, setOrientation] = useState({ x: 0, y: 0 });
    const [permissionGranted, setPermissionGranted] = useState(false);

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
        };

        useEffect(() => {
            if (!permissionGranted) return;

            const handleOrientation = (event: DeviceOrientationEvent) => {
                // Gamma: Left/Right tilt (-90 to 90)
                // Beta: Front/Back tilt (-180 to 180)
                // Increased multipliers for more noticeable movement
                const x = event.gamma ? (event.gamma / 45) : 0;
                const y = event.beta ? ((event.beta - 45) / 45) : 0;

                setOrientation({ x, y });
            };

            window.addEventListener('deviceorientation', handleOrientation);
            return () => window.removeEventListener('deviceorientation', handleOrientation);
        }, [permissionGranted]);

        useEffect(() => {
            if (typeof window !== 'undefined' && !('ontouchstart' in window)) {
                const handleMouseMove = (e: MouseEvent) => {
                    const x = (e.clientX / window.innerWidth) * 2 - 1;
                    const y = (e.clientY / window.innerHeight) * 2 - 1;
                    setOrientation({ x, y });
                };
                window.addEventListener('mousemove', handleMouseMove);
                return () => window.removeEventListener('mousemove', handleMouseMove);
            }
        }, []);

        return { orientation, requestAccess, permissionGranted };
    }
