import { useState, useEffect } from 'react';

export default function useGyroscope() {
    const [orientation, setOrientation] = useState({ x: 0, y: 0 });
    const [permissionGranted, setPermissionGranted] = useState(false);
}
