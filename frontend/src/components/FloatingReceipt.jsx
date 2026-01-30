import { useContext, useState, useEffect, useRef } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../api';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// --- LEAFLET IMPORTS ---
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Added isPinned prop from Home.jsx
const FloatingReceipt = ({ isPinned }) => {
    const { cartItems, totalPrice, clearCart, removeFromCart } = useContext(CartContext);
    const { token, user } = useContext(AuthContext);
    const [address, setAddress] = useState('');
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [socket, setSocket] = useState(null);

    // Visibility & Timer
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef(null);

    // --- MAP STATES ---
    const [coords, setCoords] = useState([9.0227, 38.7460]); // Addis Ababa
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, []);

    useEffect(() => {
        if (cartItems.length > 0 || isPinned) {
            setIsVisible(true);
            if (timerRef.current) clearTimeout(timerRef.current);
        } else if (cartItems.length === 0 && !isCheckingOut && !isPinned) {
            // Only auto-close if NOT pinned
            timerRef.current = setTimeout(() => {
                setIsVisible(false);
            }, 5000);
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [cartItems.length, isCheckingOut, isPinned]);

    // --- MAP HELPERS ---
    const fetchAddress = async (lat, lon) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            const shortAddress = data.display_name.split(',').slice(0, 3).join(',');
            setAddress(shortAddress || "Custom Pin Dropped");
        } catch (err) {
            toast.error("Address lookup failed.");
        }
    };

    const handleAutoLocate = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setCoords([latitude, longitude]);
                fetchAddress(latitude, longitude);
                setIsLocating(false);
                toast.success("Location Pinpointed!");
            },
            () => {
                setIsLocating(false);
                toast.error("Location access denied.");
            }
        );
    };

    function RecenterMap({ position }) {
        const map = useMap();
        useEffect(() => {
            map.setView(position);
        }, [position, map]);
        return null;
    }

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setCoords([e.latlng.lat, e.latlng.lng]);
                fetchAddress(e.latlng.lat, e.latlng.lng);
            },
        });
        return <Marker position={coords} />;
    }

    const handlePlaceOrder = async () => {
        if (!user) return toast.error("Log in to place orders!");
        if (!address) return toast.error("Pin your delivery spot!");

        const orderData = {
            items: cartItems.map(item => ({ product: item._id, quantity: item.quantity })),
            deliveryAddress: address,
            coordinates: coords
        };

        const response = await apiRequest('/orders', 'POST', orderData, token);

        if (!response.error) {
            if (socket) socket.emit('newOrderPlaced', response);
            toast.success("Order Received! 🔥", { duration: 4000 });
            clearCart();
            setIsCheckingOut(false);
            setAddress('');
        } else {
            toast.error(response.error);
        }
    };

    const isEmpty = cartItems.length === 0;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
                    className={`w-full xl:w-96 transition-all duration-500 ${isPinned ? "drop-shadow-[0_25px_25px_rgba(0,0,0,0.2)]" : "shadow-[-20px_20px_60px_rgba(0,0,0,0.1)]"}`}
                >
                    <div className="bg-[#f9f9f9] relative p-8 font-mono text-gray-800 border-t-[12px] border-orange-500 shadow-inner overflow-hidden rounded-t-3xl xl:rounded-t-none">

                        {/* --- THE PIERCED HOLE --- */}
                        <AnimatePresence>
                            {isPinned && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute top-4 left-4 w-5 h-5 rounded-full z-20 shadow-inner"
                                    style={{
                                        background: 'radial-gradient(circle, #333 30%, #555 60%, transparent 90%)',
                                        boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)'
                                    }}
                                />
                            )}
                        </AnimatePresence>

                        {/* Header */}
                        <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">EthioDelight</h2>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Addis Ababa • Digital Receipt</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {isEmpty && !isCheckingOut ? (
                                <motion.div key="empty" className="py-12 flex flex-col items-center text-center">
                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-5xl mb-4 grayscale">🍽️</motion.div>
                                    <h3 className="text-gray-400 font-black uppercase text-sm">Empty Receipt</h3>
                                    <p className="text-[8px] text-gray-300 uppercase mt-2">
                                        {isPinned ? "Pinned to board" : "Auto-closing..."}
                                    </p>
                                </motion.div>
                            ) : !isCheckingOut ? (
                                <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="space-y-2 h-[140px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-orange-200">
                                        {cartItems.map((item) => (
                                            <div
                                                key={item._id}
                                                className="flex justify-between items-start text-[11px]"
                                            >
                                                <div className="flex flex-col max-w-[70%]">
                                                    <span className="font-bold uppercase leading-none mb-0.5 truncate">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        QTY: {item.quantity} × {item.price}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-gray-600 text-xs whitespace-nowrap">
                                                        {item.price * item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="text-red-400 hover:text-red-600 transition-colors leading-none"
                                                        aria-label="Remove item"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t-2 border-double border-gray-300 mt-6 pt-4">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Total Payable</span>
                                            <span className="text-2xl font-black text-orange-600">{totalPrice} ETB</span>
                                        </div>
                                        <button onClick={() => setIsCheckingOut(true)} className="w-full bg-black text-white py-4 font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all">
                                            Proceed to Delivery
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <button onClick={() => setIsCheckingOut(false)} className="text-[9px] font-black text-gray-400 hover:text-black transition-colors uppercase">← Back to Menu</button>

                                    <div className="h-44 w-full rounded-xl overflow-hidden border border-gray-200 relative">
                                        <MapContainer center={coords} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <RecenterMap position={coords} />
                                            <LocationMarker />
                                        </MapContainer>

                                        <button
                                            onClick={handleAutoLocate}
                                            className="absolute top-2 right-2 z-[1000] bg-white p-2 rounded-lg shadow-lg hover:bg-orange-500 hover:text-white transition-all"
                                        >
                                            {isLocating ? "..." : "📍"}
                                        </button>
                                    </div>

                                    <div className="bg-white p-3 border border-gray-200 rounded-sm">
                                        <label className="text-[8px] font-black text-gray-400 uppercase block mb-1">Delivery Address</label>
                                        <textarea
                                            className="w-full bg-transparent border-none outline-none text-[10px] font-bold h-10 leading-tight resize-none"
                                            value={address}
                                            readOnly
                                            placeholder="Pin location on map..."
                                        />
                                    </div>

                                    <button onClick={handlePlaceOrder} className="w-full bg-green-600 text-white py-4 font-black uppercase text-xs tracking-widest hover:bg-green-700 transition-all shadow-lg">
                                        Confirm Order 🚀
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Torn Bottom Edge Effect */}
                        <div className="absolute -bottom-3 left-0 w-full flex overflow-hidden leading-[0]">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="min-w-[24px] h-6 bg-[#f9f9f9] rotate-45 transform origin-top-left -translate-y-3"></div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingReceipt;