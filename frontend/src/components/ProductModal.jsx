import { motion } from 'framer-motion';
import AddToCartButton from './AddToCartButton';
import "../styles/ProductModal.css";

const ProductModal = ({ product, onClose, onNext, onPrev, onAdd }) => (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
    >
        <div className="modal-wrapper">
            <button 
                onClick={(e) => { e.stopPropagation(); onPrev(); }} 
                className="btn-modal-nav"
            >
                ‹
            </button>

            <motion.div 
                key={product._id}
                initial={{ x: 50, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                exit={{ x: -50, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-image-box">
                    <img src={product.image} className="modal-image" alt={product.name} />
                    <div className="modal-badge">
                        {product.category}
                    </div>
                </div>
                
                <div className="modal-info-box">
                    <button onClick={onClose} className="btn-modal-close">
                        Close ✕
                    </button>
                    
                    <h2 className="modal-title">{product.name}</h2>
                    <p className="modal-price">{product.price} ETB</p>
                    
                    <p className="modal-desc">
                        "{product.description}"
                    </p>

                    <AddToCartButton onAdd={onAdd} />
                </div>
            </motion.div>
            <button 
                onClick={(e) => { e.stopPropagation(); onNext(); }} 
                className="btn-modal-nav"
            >
                ›
            </button>
        </div>
    </motion.div>
);

export default ProductModal;