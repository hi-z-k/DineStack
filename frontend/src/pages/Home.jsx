import { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { apiRequest } from '../api';
import { io } from 'socket.io-client';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// Component Imports
import FloatingReceipt from '../components/FloatingReceipt';
import Hero from '../components/Hero';
import About from "../components/About";
import Testimonials from '../components/Testimonials';
import AddToCartButton from '../components/AddToCartButton';
import ProductModal from '../components/ProductModal';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isPinned, setIsPinned] = useState(false);
    
    const mobileControls = useAnimation();
    const viewportConstraintsRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; 

    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiRequest('/products');
                setProducts(data);
            } catch (error) { console.error("Fetch error:", error); } 
            finally { setLoading(false); }
        };
        fetchProducts();

        const socket = io('http://localhost:5000');
        socket.on('menuUpdated', fetchProducts);
        return () => socket.disconnect();
    }, []);

    const handleDragEnd = (event, info) => {
        if (info.offset.y > 100 || info.point.y > window.innerHeight - 150) {
            mobileControls.start({ y: "88%" });
        } else {
            mobileControls.start({ y: "15%" });
        }
    };

    const filteredProducts = useMemo(() => {
        setCurrentPage(1);
        return products.filter(product => {
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 product.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, searchQuery, selectedCategory]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
    };

    const categories = ["All", ...new Set(products.map(p => p.category))];
    const nextProduct = () => setSelectedIndex((prev) => (prev + 1) % filteredProducts.length);
    const prevProduct = () => setSelectedIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedIndex === null) return;
            if (e.key === "ArrowRight") nextProduct();
            if (e.key === "ArrowLeft") prevProduct();
            if (e.key === "Escape") setSelectedIndex(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, filteredProducts]);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center font-mono text-orange-500 animate-pulse uppercase tracking-[0.5em]">
            <span>Cooking...</span>
        </div>
    );

    return (
        <div className="bg-[#fafafa] min-h-screen relative overflow-x-hidden">
            <div ref={viewportConstraintsRef} className="fixed inset-0 pointer-events-none z-[50]" />
            <Hero />
            <About />
            
            <main id="menu" className="max-w-7xl mx-auto py-16 px-6">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h2 className="text-5xl font-black text-gray-900 mb-2 italic uppercase">The Menu</h2>
                        <div className="h-2 w-32 bg-orange-500 mb-6" />
                        <CategoryFilter 
                            categories={categories} 
                            selectedCategory={selectedCategory} 
                            setSelectedCategory={setSelectedCategory} 
                        />
                    </div>
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>

                <div className="lg:flex gap-12">
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {currentItems.length > 0 ? currentItems.map((product, index) => (
                                <div key={product._id} className="group relative flex gap-4 items-center cursor-pointer">
                                    <div onClick={() => setSelectedIndex(indexOfFirstItem + index)} className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100 shadow-lg group-hover:border-orange-500 transition-colors">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="flex-1 border-b border-gray-200 pb-2 group-hover:border-orange-200 transition-colors">
                                        <div onClick={() => setSelectedIndex(indexOfFirstItem + index)} className="flex justify-between items-end">
                                            <h4 className="font-bold text-gray-800 uppercase tracking-tighter">{product.name}</h4>
                                            <span className="font-mono text-orange-600 font-bold">{product.price} ETB</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic">{product.description}</p>
                                        <AddToCartButton onAdd={() => addToCart(product)} />
                                    </div>
                                </div>
                            )) : <p className="col-span-full py-20 text-center font-mono text-gray-400 italic">NO DISHES FOUND MATCHING YOUR CRAVING.</p>}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center items-center gap-4">
                                <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} className="p-2 text-gray-400 hover:text-orange-500 disabled:opacity-20 transition-colors font-black text-[10px]">PREV</button>
                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button key={i + 1} onClick={() => paginate(i + 1)} className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${currentPage === i + 1 ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-400 hover:border-orange-500"}`}>{i + 1}</button>
                                    ))}
                                </div>
                                <button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} className="p-2 text-gray-400 hover:text-orange-500 disabled:opacity-20 transition-colors font-black text-[10px]">NEXT</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Testimonials />

            {/* Desktop Receipt */}
            <div className="hidden lg:block">
                <motion.div drag={!isPinned} dragConstraints={viewportConstraintsRef} dragElastic={0} dragMomentum={false}
                    className={`fixed top-24 right-10 z-[60] transition-shadow duration-300 ${isPinned ? "shadow-2xl cursor-default" : "cursor-grab active:cursor-grabbing shadow-lg"}`}>
                    <button onClick={() => setIsPinned(!isPinned)} className={`absolute -top-4 -left-4 z-[70] w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${isPinned ? "bg-red-500 border-white text-white rotate-[30deg] scale-110" : "bg-white border-black text-black hover:bg-orange-500 hover:text-white"}`}>
                        <span className="text-xl">{isPinned ? "📍" : "📌"}</span>
                    </button>
                    <FloatingReceipt isPinned={isPinned} onCheckout={() => navigate("/checkout")} />
                </motion.div>
            </div>

            {/* Mobile Receipt */}
            <div className="lg:hidden fixed inset-x-0 bottom-0 z-[70] flex justify-center pointer-events-none">
                <motion.div drag="y" animate={mobileControls} onDragEnd={handleDragEnd} initial={{ y: "88%" }} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.1}
                    className="pointer-events-auto w-full max-w-[450px] bg-white rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.25)] border-t-4 border-orange-500">
                    <div className="flex flex-col items-center py-4 cursor-grab active:cursor-grabbing" onClick={() => mobileControls.start({ y: "15%" })}>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full mb-2" />
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-gray-900 tracking-[0.2em]">Your Scroll</span>
                            <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-orange-500 text-xs">▲</motion.span>
                        </div>
                    </div>
                    <div className="px-6 pb-20 overflow-y-auto max-h-[80vh]">
                        <FloatingReceipt onCheckout={() => navigate('/checkout')} />
                        <button onClick={() => mobileControls.start({ y: "88%" })} className="w-full mt-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-300 border-t border-gray-50 hover:text-orange-500 transition-colors">✕ Close Scroll</button>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence mode="wait">
                {selectedIndex !== null && (
                    <ProductModal product={filteredProducts[selectedIndex]} onClose={() => setSelectedIndex(null)} onNext={nextProduct} onPrev={prevProduct} onAdd={() => addToCart(filteredProducts[selectedIndex])} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;