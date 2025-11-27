import { motion } from 'framer-motion';

interface OverlayProps {
    onStart: () => void;
    started: boolean;
}

export default function Overlay({ onStart, started }: OverlayProps) {
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50 flex flex-col justify-between p-6">
            {/* Instructions */}
            {!started && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-white text-center bg-black/50 p-4 rounded-xl backdrop-blur-md">
                        Tap "Enter AR" to start.<br />
                        Scan the floor and tap to place the Lion.
                    </p>
                </div>
            )}
        </div>
    );
}
