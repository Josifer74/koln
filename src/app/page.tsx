'use client';

import { useState } from 'react';
import ARScene from '@/components/Scene/ARScene';
import Overlay from '@/components/UI/Overlay';

export default function Home() {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <main className="w-full h-screen overflow-hidden bg-black">
      <ARScene cameraEnabled={started} />
      <Overlay onStart={handleStart} started={started} />
    </main>
  );
}
