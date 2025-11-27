import { motion } from 'framer-motion';

interface OverlayProps {
    onStart: () => void;
    started: boolean;
}

export default function Overlay({ onStart, started }: OverlayProps) {
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50 flex flex-col justify-between p-6">
            {/* Start Button */}
            {!started && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStart}
                        className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg shadow-lg"
                    >
                        Start Experience
                    </motion.button>
                </div>
            )}
        </div>
    );
}
