import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../api';
import { downloadInvoice } from '../utils/invoiceGenerator';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast'; 

const socket = io('http://localhost:5000');

const Orders = () => {
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const { token, user } = useContext(AuthContext);

    const fetchOrders = async () => {
        setLoading(true);
        const data = await apiRequest('/orders', 'GET', null, token);
        setMyOrders(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            const res = await apiRequest(`/orders/${orderId}`, 'DELETE', null, token);
            if (!res.error) {
                setMyOrders(prev => prev.filter(o => o._id !== orderId));
                socket.emit('orderCancelled', orderId);
                toast.success("Order Cancelled");
            } else {
                alert("Could not cancel order: " + res.error);
            }
        }
    };

    useEffect(() => {
        if (token) fetchOrders();

        socket.on('statusUpdated', (updatedOrder) => {
            setMyOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
        });

        return () => socket.off('statusUpdated');
    }, [token]);

    useEffect(() => {
        if (myOrders.length > 0) {
            myOrders.forEach(order => socket.emit('joinOrder', order._id));
        }
    }, [myOrders]);

    const filteredOrders = myOrders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = filter === 'all'
            ? true
            : filter === 'active' ? order.status !== 'delivered' : order.status === 'delivered';
        return matchesSearch && matchesTab;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mb-4"></div>
            <p className="text-gray-400 font-mono tracking-widest uppercase text-xs">Syncing with Kitchen...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen">
            {/* Header & Controls */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                            My Orders
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">Tracking your delicious journey in real-time</p>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {['all', 'active', 'delivered'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by Order ID (e.g. 5F2A...)"
                        className="w-full bg-white border border-gray-200 px-12 py-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all font-mono text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
                </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence>
                    {filteredOrders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
                        >
                            <p className="text-gray-400 font-bold uppercase tracking-widest">No matching orders found</p>
                        </motion.div>
                    ) : (
                        filteredOrders.map(order => (
                            <motion.div
                                layout
                                key={order._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group relative"
                            >
                                {order.status === 'pending' && (
                                    <button
                                        onClick={() => handleCancelOrder(order._id)}
                                        className="absolute top-4 right-4 text-[10px] font-black bg-red-50 text-red-500 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-all z-10"
                                    >
                                        CANCEL
                                    </button>
                                )}

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Live Tracking</span>
                                            <h3 className="text-xl font-bold text-gray-900 font-mono italic">#{order._id.slice(-8).toUpperCase()}</h3>
                                        </div>
                                        <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${order.status === 'delivered'
                                            ? 'bg-green-50 text-green-600 border-green-100'
                                            : 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse'
                                            }`}>
                                            ● {order.status.replace(/-/g, ' ')}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="flex gap-1 mb-6">
                                        <div className={`h-1.5 flex-1 rounded-full ${order.status !== 'pending' ? 'bg-orange-500' : 'bg-gray-100 animate-pulse'}`} />
                                        <div className={`h-1.5 flex-1 rounded-full ${['preparing', 'out-for-delivery', 'delivered'].includes(order.status) ? 'bg-orange-500' : 'bg-gray-100'}`} />
                                        <div className={`h-1.5 flex-1 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-100'}`} />
                                    </div>

                                    {/* --- ADDED: FOOD ITEMS LIST --- */}
                                    <div className="mb-6 space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Items</p>
                                        <div className="flex flex-wrap gap-2">
                                            {order.items && order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
                                                    <span className="text-orange-600 font-bold text-xs">{item.quantity}x</span>
                                                    <span className="text-gray-700 text-xs font-bold uppercase tracking-tight">
                                                        {item.name || item.product?.name || "Delicious Food"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-50">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400 font-medium">Placed on</span>
                                            <span className="text-gray-700 font-bold">{new Date(order.orderedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400 font-medium">Destination</span>
                                            <span className="text-gray-700 font-bold truncate max-w-[200px]">{order.deliveryAddress}</span>
                                        </div>
                                        <div className="pt-3 flex justify-between items-center">
                                            <span className="text-lg font-black text-gray-900">Total Paid</span>
                                            <span className="text-2xl font-black text-orange-600 font-mono">{order.totalAmount} <small className="text-xs">ETB</small></span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => downloadInvoice(order)}
                                    className="w-full py-3 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] group-hover:bg-black group-hover:text-white transition-all border-t border-gray-100 flex items-center justify-center gap-2"
                                >
                                    Download Invoice
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Orders;