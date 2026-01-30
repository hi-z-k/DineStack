import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminOrders = ({ orders, updateStatus, deleteOrder }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all');
    const ordersPerPage = 5;

    const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.orderedAt) - new Date(a.orderedAt)
    );

    const filteredOrders = filter === 'all' 
        ? sortedOrders 
        : sortedOrders.filter(o => o.status === filter);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDelete = (id) => {
        if (window.confirm("⚠️ Are you sure? This will remove the order permanently.")) {
            deleteOrder(id);
        }
    };

    return (
        <div className="space-y-6 mt-10">
            {/* HEADER & FILTERS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Live Order Pipeline</h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        Showing {filteredOrders.length} {filter !== 'all' ? filter : ''} orders
                    </p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 gap-1 overflow-x-auto">
                    {['all', 'pending', 'preparing', 'delivered'].map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setCurrentPage(1); }}
                            className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${
                                filter === f ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* ORDERS LIST */}
            <div className="grid grid-cols-1 gap-4 min-h-[450px]">
                <AnimatePresence mode="popLayout">
                    {currentOrders.length > 0 ? (
                        currentOrders.map(order => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={order._id}
                                className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-6 group hover:border-orange-200 transition-all relative"
                            >
                                {/* DELETE BUTTON */}
                                <button 
                                    onClick={() => handleDelete(order._id)}
                                    className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all text-lg"
                                >
                                    🗑️
                                </button>

                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                    {/* LEFT: INFO & ADDRESS */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full animate-pulse ${
                                                order.status === 'delivered' ? 'bg-green-500' : 
                                                order.status === 'pending' ? 'bg-red-500' : 'bg-orange-500'
                                            }`}></span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase font-mono tracking-widest">
                                                ID: {order._id.slice(-8).toUpperCase()} • {new Date(order.orderedAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <h4 className="font-black text-lg text-gray-800 leading-tight">
                                            📍 {order.deliveryAddress}
                                        </h4>
                                    </div>

                                    {/* RIGHT: STATUS CONTROLS */}
                                    <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1 border border-gray-100 w-full lg:w-auto overflow-x-auto">
                                        {['pending', 'preparing', 'out-for-delivery', 'delivered'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => updateStatus(order._id, status)}
                                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase whitespace-nowrap transition-all ${
                                                    order.status === status 
                                                        ? 'bg-orange-500 text-white shadow-lg' 
                                                        : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                                                }`}
                                            >
                                                {status.replace(/-/g, ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* --- THE FIX: ORDER BREAKDOWN SECTION --- */}
                                <div className="border-t border-dashed border-gray-100 pt-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Order Items</p>
                                    <div className="flex flex-wrap gap-3">
                                        {order.items && order.items.map((item, idx) => (
                                            <div key={idx} className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 flex items-center gap-2">
                                                <span className="bg-orange-100 text-orange-600 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-lg">
                                                    {item.quantity}
                                                </span>
                                                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">
                                                    {item.name || item.product?.name || "Item"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                         <p className="text-[10px] font-black text-gray-400 uppercase">Grand Total</p>
                                         <p className="text-xl font-black text-orange-600 font-mono">{order.totalAmount} ETB</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300 py-20">
                            <span className="text-4xl mb-4">🏜️</span>
                            <p className="text-[10px] font-black uppercase tracking-widest">No {filter} orders found</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => paginate(currentPage - 1)}
                        className="p-2 px-4 rounded-xl text-[10px] font-black uppercase bg-white border border-gray-100 disabled:opacity-30 hover:bg-black hover:text-white transition-colors"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${
                                currentPage === i + 1 
                                    ? 'bg-orange-500 text-white shadow-md' 
                                    : 'bg-white text-gray-400 border border-gray-100'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => paginate(currentPage + 1)}
                        className="p-2 px-4 rounded-xl text-[10px] font-black uppercase bg-white border border-gray-100 disabled:opacity-30 hover:bg-black hover:text-white transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;