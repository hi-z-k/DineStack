import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/About.css"; 

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
            className={`btn-cart-base ${added ? "btn-cart-success" : "btn-cart-idle"}`}
        >
            <AnimatePresence mode="wait">
                {added ? (
                    <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="btn-cart-content"
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