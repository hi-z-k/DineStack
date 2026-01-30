import { motion } from 'framer-motion';
import AddToCartButton from './AddToCartButton';

const ProductModal = ({ product, onClose, onNext, onPrev, onAdd }) => (
    <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
    >
        <div className="relative w-full max-w-4xl flex items-center gap-4">
            <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="text-white text-4xl hover:text-orange-500 transition-colors p-2">‹</button>

            <motion.div 
                key={product._id}
                initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
                className="bg-white rounded-[40px] overflow-hidden flex flex-col md:flex-row w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="md:w-1/2 h-[300px] md:h-auto relative">
                    <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                    <div className="absolute top-6 left-6 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {product.category}
                    </div>
                </div>
                
                <div className="md:w-1/2 p-10 flex flex-col justify-center">
                    <button onClick={onClose} className="self-end text-gray-300 hover:text-black mb-4 uppercase text-[10px] font-black tracking-widest">Close ✕</button>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">{product.name}</h2>
                    <p className="text-2xl font-mono text-orange-600 font-bold mb-6">{product.price} ETB</p>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 italic">"{product.description}"</p>
                    <AddToCartButton onAdd={onAdd} />
                </div>
            </motion.div>

            <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="text-white text-4xl hover:text-orange-500 transition-colors p-2">›</button>
        </div>
    </motion.div>
);

export default ProductModal;