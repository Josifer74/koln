'use client';

export default function ARScene({ cameraEnabled }: ARSceneProps) {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <XR store={store}>
                    <ambientLight intensity={1} />
                    <pointLight position={[10, 10, 10]} />
                    <LionPlacementManager />
                </XR>
            </Canvas>

            <div className="absolute bottom-10 left-0 w-full flex justify-center pointer-events-auto z-50">
                <button
                    onClick={() => {
                        console.log("Attempting to enter AR...");
                        try {
                            const result = store.enterAR();
                            console.log("enterAR called, result:", result);
                        } catch (e) {
                            console.error("Failed to enter AR:", e);
                            alert("Failed to enter AR: " + e);
                        }
                    }}
                    className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg shadow-lg"
                >
                    Enter AR
                </button>
            </div>
        </div>
    );
}
