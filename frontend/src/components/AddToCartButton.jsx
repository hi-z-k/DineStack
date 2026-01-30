import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddToCartButton = ({ onAdd }) => {
    const [added, setAdded] = useState(false);

    const handleClick = (e) => {
        e.stopPropagation();
        onAdd();
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className={`mt-2 text-[10px] font-black uppercase border px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center min-w-[120px] ${
                added 
                ? "bg-green-500 border-green-500 text-white" 
                : "bg-transparent border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
            }`}
        >
            <AnimatePresence mode="wait">
                {added ? (
                    <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-1"
                    >
                        ADDED! ✓
                    </motion.span>
                ) : (
                    <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        + Add to Cart
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default AddToCartButton;