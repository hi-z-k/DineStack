import { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiRequest, SOCKET_URL } from '../api';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import "../styles/Admin.css"

import AdminDashboard from '../components/admin/AdminDashboard';
import ProductManager from '../components/admin/ProductManager';
import UserManager from '../components/admin/UserManager';

const Admin = () => {
    const { token } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', description: '', category: '', image: '' });

    const fetchEverything = async () => {
        if (!token) return;
        const [sData, oData, uData, pData] = await Promise.all([
            apiRequest('/admin/stats', 'GET', null, token),
            apiRequest('/orders', 'GET', null, token),
            apiRequest('/users', 'GET', null, token),
            apiRequest('/products', 'GET')
        ]);
        if (!sData.error) setStats(sData);
        if (!oData.error) setOrders(oData);
        if (!uData.error) setUsersList(uData);
        if (!pData.error) setProducts(pData);
    };

    useEffect(() => {
        const socket = io(SOCKET_URL);
        fetchEverything();

        socket.on('fetchAdminOrders', () => {
            toast.success('🔔 New Order Received!');
            fetchEverything();
        });

        socket.on('orderDeleted', (orderId) => {
            setOrders(prev => prev.filter(o => o._id !== orderId));
            toast.error(`Order #${orderId.slice(-4)} was cancelled by user`);
        });

        socket.on('menuUpdated', fetchEverything);
        return () => socket.disconnect();
    }, [token]);

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Permanently delete this order from records?")) {
            const res = await apiRequest(`/orders/${orderId}`, 'DELETE', null, token);
            if (!res.error) { toast.success("Order Deleted"); fetchEverything(); }
            else toast.error(res.error);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 1048576) return toast.error("File too large! Max 1MB.");
        const reader = new FileReader();
        reader.onloadend = () => setFormData({ ...formData, image: reader.result });
        reader.readAsDataURL(file);
    };

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        const endpoint = editingId ? `/products/update` : '/products';
        const method = editingId ? 'PUT' : 'POST';
        const payload = editingId ? { ...formData, id: editingId } : formData;

        const res = await apiRequest(endpoint, method, payload, token);
        if (!res.error) {
            toast.success(editingId ? "Product Updated" : "Product Synthesized");
            setFormData({ name: '', price: '', description: '', category: '', image: '' });
            setEditingId(null);
            fetchEverything();
        } else toast.error(res.error);
    };

    const startEdit = (product) => {
        setEditingId(product._id);
        setFormData({ name: product.name, price: product.price, description: product.description, category: product.category, image: product.image });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const updateStatus = async (orderId, newStatus) => {
        const res = await apiRequest('/orders/status', 'PUT', { orderId, status: newStatus }, token);
        if (!res.error) { toast.success(`Status: ${newStatus.toUpperCase()}`); fetchEverything(); }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Purge user from database?")) {
            const res = await apiRequest(`/users/delete/${id}`, 'DELETE', null, token);
            if (!res.error) { toast.success("User Purged"); fetchEverything(); }
        }
    };

    const chartData = useMemo(() => {
        const raw = stats?.dailySales?.length > 0 ? stats.dailySales.map(d => ({ name: d._id, sales: d.total })) : [];
        if (raw.length === 1) return [{ name: 'Start', sales: 0 }, ...raw];
        return raw.length === 0 ? [{ name: 'N/A', sales: 0 }] : raw;
    }, [stats]);

    return (
        <div className="admin-page-container">
            <div className="admin-header-card">
                <div>
                    <h1 className="admin-logo-title">
                        Command <span className="admin-logo-accent">Center</span>
                    </h1>
                    <p className="admin-node-status">Live Node: Addis_Ababa_Main</p>
                </div>

                <div className="admin-tab-container">
                    {['dashboard', 'products', 'users'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`admin-tab-btn ${activeTab === tab ? 'admin-tab-btn-active' : 'admin-tab-btn-inactive'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="admin-content-grid">
                <div className="admin-main-section">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'dashboard' && <AdminDashboard stats={stats} orders={orders} updateStatus={updateStatus} deleteOrder={handleDeleteOrder} chartData={chartData} />}
                            {activeTab === 'products' && <ProductManager products={products} editingId={editingId} formData={formData} setFormData={setFormData} handleSubmitProduct={handleSubmitProduct} handleImageUpload={handleImageUpload} startEdit={startEdit} setEditingId={setEditingId} />}
                            {activeTab === 'users' && <UserManager usersList={usersList} handleDeleteUser={handleDeleteUser} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};


export default Admin;