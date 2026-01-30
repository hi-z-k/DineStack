import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiRequest, SOCKET_URL } from '../api';
import { downloadInvoice } from '../utils/invoiceGenerator';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast'; 
import "../styles/Orders.css"

const socket = io(SOCKET_URL);

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
        <div className="sync-screen">
            <div className="sync-spinner"></div>
            <p className="sync-text">Syncing with Kitchen...</p>
        </div>
    );

 return (
        <div className="orders-container">
            <div className="mb-10">
                <div className="orders-header-row">
                    <div>
                        <h1 className="orders-title">My Orders</h1>
                        <p className="text-gray-400 text-sm font-medium">Tracking your delicious journey in real-time</p>
                    </div>

                    <div className="tab-container">
                        {['all', 'active', 'delivered'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`tab-btn ${filter === tab ? 'tab-btn-active' : 'tab-btn-inactive'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Search by Order ID (e.g. 5F2A...)"
                        className="search-input-terminal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
                </div>
            </div>

            <div className="orders-grid">
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
                                className="order-card group"
                            >
                                {order.status === 'pending' && (
                                    <button
                                        onClick={() => handleCancelOrder(order._id)}
                                        className="btn-cancel-order"
                                    >
                                        CANCEL
                                    </button>
                                )}

                                <div className="order-card-body">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Live Tracking</span>
                                            <h3 className="text-xl font-bold text-gray-900 font-mono italic">#{order._id.slice(-8).toUpperCase()}</h3>
                                        </div>
                                        <div className={`status-badge ${order.status === 'delivered' ? 'status-delivered' : 'status-active'}`}>
                                            ● {order.status.replace(/-/g, ' ')}
                                        </div>
                                    </div>

                                    <div className="progress-track">
                                        <div className={`progress-step ${order.status !== 'pending' ? 'bg-orange-500' : 'bg-gray-100 animate-pulse'}`} />
                                        <div className={`progress-step ${['preparing', 'out-for-delivery', 'delivered'].includes(order.status) ? 'bg-orange-500' : 'bg-gray-100'}`} />
                                        <div className={`progress-step ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-100'}`} />
                                    </div>

                                    <div className="mb-6 space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Items</p>
                                        <div className="item-pill-container">
                                            {order.items && order.items.map((item, idx) => (
                                                <div key={idx} className="item-pill">
                                                    <span className="item-pill-qty">{item.quantity}x</span>
                                                    <span className="item-pill-name">
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
                                    className="btn-download-invoice"
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