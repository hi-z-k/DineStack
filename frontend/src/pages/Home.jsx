import { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { apiRequest, SOCKET_URL } from '../api';
import { io } from 'socket.io-client';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import "../styles/Hom.css"


import FloatingReceipt from '../components/FloatingReceipt';
import Hero from '../components/Hero';
import About from "../components/About";
import Testimonials from '../components/Testimonials';
import LoadingScreen from '../components/LoadingScreen';
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

        const socket = io(SOCKET_URL);
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

    if (loading) return <LoadingScreen />;

return (
        <div className="page-container bg-soft-white">
            <div ref={viewportConstraintsRef} className="viewport-layer" />
            <Hero />
            <About />
            
            <main id="menu" className="section-padding">
                <div className="flex-between-end mb-12">
                    <div>
                        <h2 className="title-hero mb-2">The Menu</h2>
                        <div className="orange-line-divider" />
                        <CategoryFilter 
                            categories={categories} 
                            selectedCategory={selectedCategory} 
                            setSelectedCategory={setSelectedCategory} 
                        />
                    </div>
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>

                <div className="grid-layout">
                    {currentItems.length > 0 ? currentItems.map((product, index) => (
                        <div key={product._id} className="card-interactive group">
                            <div 
                                onClick={() => setSelectedIndex(indexOfFirstItem + index)} 
                                className="img-circle-container border-hover-orange"
                            >
                                <img src={product.image} alt={product.name} className="img-hover-zoom" />
                            </div>
                            <div className="content-underlined">
                                <div onClick={() => setSelectedIndex(indexOfFirstItem + index)} className="flex justify-between items-end">
                                    <h4 className="product-name">{product.name}</h4>
                                    <span className="font-mono-bold text-orange-600">{product.price} ETB</span>
                                </div>
                                <p className="product-description">{product.description}</p>
                                <AddToCartButton onAdd={() => addToCart(product)} />
                            </div>
                        </div>
                    )) : <p className="no-products">NO DISHES FOUND MATCHING YOUR CRAVING.</p>}
                </div>

                {totalPages > 1 && (
                    <div className="pagination-container">
                        <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} className="btn-nav-text">PREV</button>
                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i + 1} 
                                    onClick={() => paginate(i + 1)} 
                                    className={`page-box ${currentPage === i + 1 ? "page-box-active" : "page-box-inactive"}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} className="btn-nav-text">NEXT</button>
                    </div>
                )}
            </main>

            <Testimonials />

            <div className="hidden lg:block">
                <motion.div 
                    drag={!isPinned} 
                    dragConstraints={viewportConstraintsRef} 
                    className={`receipt-fixed-pos ${isPinned ? "receipt-shadow-active" : "receipt-shadow-idle"}`}
                >
                    <button onClick={() => setIsPinned(!isPinned)} className={`pin-circle ${isPinned ? "pin-style-on" : "pin-style-off"}`}>
                        <span className="text-xl">{isPinned ? "📍" : "📌"}</span>
                    </button>
                    <FloatingReceipt isPinned={isPinned} onCheckout={() => navigate("/checkout")} />
                </motion.div>
            </div>

            <div className="mobile-bottom-tray">
                <motion.div drag="y" animate={mobileControls} onDragEnd={handleDragEnd} initial={{ y: "88%" }} className="scroll-sheet">
                    <div className="drag-handle-area" onClick={() => mobileControls.start({ y: "15%" })}>
                        <div className="mobile-scroll-bar" />
                        <div className="flex items-center gap-2">
                            <span className="mobile-scroll-text">Your Scroll</span>
                            <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-accent-orange text-xs">▲</motion.span>
                        </div>
                    </div>
                    <div className="mobile-receipt-content">
                        <FloatingReceipt onCheckout={() => navigate('/checkout')} />
                        <button onClick={() => mobileControls.start({ y: "88%" })} className="close-btn-layout close-btn-typo">✕ Close Scroll</button>
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