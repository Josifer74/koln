import { motion } from 'framer-motion';

interface OverlayProps {
    onStart: () => void;
    started: boolean;
}

export default function Overlay({ onStart, started }: OverlayProps) {
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50 flex flex-col justify-between p-6">
            {/* Header */}
            <div className="w-full flex justify-between items-start">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <h1 className="text-white font-bold text-xl">Cologne 2050</h1>
                    <p className="text-white/80 text-sm">Sustainable Future Vision</p>
                </div>
            </div>

            {/* Start Button / Info */}
            {!started ? (
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
            ) : (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 pointer-events-auto"
                >
                    <h2 className="text-white font-bold mb-2">Green Urban Spaces</h2>
                    <p className="text-white/90 text-sm">
                        By 2050, Cologne's streets will be transformed into living ecosystems.
                        Vertical gardens and roof parks reduce heat and improve air quality.
                    </p>
                </motion.div>
            )}
        </div>
    );
}
