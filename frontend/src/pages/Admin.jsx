import { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../api';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// New Extracted Components
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
        const socket = io('http://localhost:5000');
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
        <div className="min-h-screen bg-[#fcfcfc] text-slate-900 p-6 md:p-10">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Command <span className="text-orange-500">Center</span></h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Live Node: Addis_Ababa_Main</p>
                </div>
                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 gap-1 mt-4 md:mt-0">
                    {['dashboard', 'products', 'users'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-orange-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}>{tab}</button>
                    ))}
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            {activeTab === 'dashboard' && <AdminDashboard stats={stats} orders={orders} updateStatus={updateStatus} deleteOrder={handleDeleteOrder} chartData={chartData} />}
                            {activeTab === 'products' && <ProductManager products={products} editingId={editingId} formData={formData} setFormData={setFormData} handleSubmitProduct={handleSubmitProduct} handleImageUpload={handleImageUpload} startEdit={startEdit} setEditingId={setEditingId} />}
                            {activeTab === 'users' && <UserManager usersList={usersList} handleDeleteUser={handleDeleteUser} />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="space-y-8">
                    <div className="bg-orange-500 p-8 rounded-[48px] text-white shadow-2xl shadow-orange-100">
                        <p className="text-[10px] font-black uppercase opacity-60 mb-2">System Health</p>
                        <h2 className="text-5xl font-black italic tracking-tighter mb-6">STABLE</h2>
                        <div className="pt-6 border-t border-white/20 flex justify-between items-center">
                            <span className="text-[10px] font-bold">Node_01</span>
                            <span className="flex items-center gap-2 text-[10px] font-black"><span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> ACTIVE</span>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Quick Insights</h4>
                        <div className="space-y-6">
                            <InsightRow label="Top Item" val={stats?.topItem || "..."} />
                            <InsightRow label="Peak Hour" val={stats?.peakHour || "07:00 PM"} />
                            <InsightRow label="Couriers" val={`${stats?.activeCouriers || 0} Active`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InsightRow = ({ label, val }) => (
    <div className="flex justify-between items-center border-b border-gray-50 pb-3">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-tighter">{label}</span>
        <span className="text-xs font-black uppercase">{val}</span>
    </div>
);

export default Admin;