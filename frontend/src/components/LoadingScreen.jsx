import { motion } from 'framer-motion';
import "../styles/Hom.css"

const LoadingScreen = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-overlay"
        >
            <div className="loading-bg-line top-1/4" />
            <div className="loading-bg-line top-3/4" />
            
            <div className="flex flex-col items-center">
                <h1 className="cooking-text animate-stutter">
                    Cooking
                    <span className="flex gap-1">
                        <span className="cooking-dot" />
                        <span className="cooking-dot opacity-60" />
                        <span className="cooking-dot opacity-30" />
                    </span>
                </h1>
                <p className="loading-subtext">Preparing your culinary experience</p>
            </div>

            <div className="absolute bottom-10 font-mono text-[10px] text-gray-300 tracking-widest">
                STATUS: <span className="text-orange-500">HEATING_UP</span>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;