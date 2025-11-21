'use client';

import { useState } from 'react';
import ARScene from '@/components/Scene/ARScene';
import Overlay from '@/components/UI/Overlay';
import useGyroscope from '@/hooks/useGyroscope';

export default function Home() {
  const { orientation, requestAccess, permissionGranted } = useGyroscope();
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    await requestAccess();
    setStarted(true);
  };

  return (
    <main className="w-full h-screen relative bg-gray-900">
      <ARScene orientation={orientation} cameraEnabled={started} />
      <Overlay onStart={handleStart} started={started} />
    </main>
  );
}
