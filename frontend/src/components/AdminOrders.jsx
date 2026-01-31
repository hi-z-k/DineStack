import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/AdminOrders.css";

const AdminOrders = ({ orders, updateStatus, deleteOrder }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all');
    const ordersPerPage = 5;

    // FIX/REINFORCE SORTING: 
    // This ensures b (newer) comes before a (older)
    const sortedOrders = [...orders].sort((a, b) => {
        const dateA = new Date(a.orderedAt || a.createdAt || 0);
        const dateB = new Date(b.orderedAt || b.createdAt || 0);
        return dateB - dateA; 
    });

    const filteredOrders = filter === 'all' 
        ? sortedOrders 
        : sortedOrders.filter(o => o.status === filter);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length * 1.0 / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDelete = (id) => {
        if (window.confirm("CRITICAL: Terminate this order record permanently?")) {
            deleteOrder(id);
        }
    };

    return (
        <div className="orders-container">
            <div className="orders-header-row">
                <div>
                    <h3 className="chart-header">Live Order Pipeline</h3>
                    <p className="stat-label">
                        PROCESSED: {filteredOrders.length} {filter !== 'all' ? filter : 'total'} units
                    </p>
                </div>

                <div className="filter-bar">
                    {['all', 'pending', 'preparing', 'delivered'].map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setCurrentPage(1); }}
                            className={`btn-filter ${filter === f ? 'btn-filter-active' : 'btn-filter-idle'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="orders-list-viewport">
                <AnimatePresence mode="popLayout">
                    {currentOrders.length > 0 ? (
                        currentOrders.map(order => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={order._id}
                                className="order-card group"
                            >
                                <button 
                                    onClick={() => handleDelete(order._id)}
                                    className="btn-order-delete"
                                >
                                    ✕
                                </button>

                                <div className="order-meta-row">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`status-indicator ${
                                                order.status === 'delivered' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 
                                                order.status === 'pending' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
                                            }`}></span>
                                            <span className="order-id-label">
                                                LOG_ID: {order._id.slice(-8).toUpperCase()} • {new Date(order.orderedAt || order.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <h4 className="order-address">📍 {order.deliveryAddress}</h4>
                                    </div>

                                    <div className="status-control-panel">
                                        {['pending', 'preparing', 'delivered'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => updateStatus(order._id, status)}
                                                className={`btn-status-toggle ${
                                                    order.status === status ? 'btn-status-active' : 'btn-status-idle'
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="order-breakdown">
                                    <p className="breakdown-title">MANIFEST</p>
                                    <div className="flex flex-wrap gap-3">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="item-pill">
                                                <span className="item-qty-badge">{item.quantity}</span>
                                                <span className="stat-label !text-black">{item.name || item.product?.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-footer">
                                         <p className="order-id-label uppercase">Total Value</p>
                                         <p className="total-price">{order.totalAmount} ETB</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20 italic">
                            <p className="order-id-label">No Active Transmissions Found</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="pagination-row">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => paginate(currentPage - 1)}
                        className="btn-pag-nav"
                    >
                        PREV
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`btn-pag-num ${currentPage === i + 1 ? 'bg-orange-500 text-black' : 'bg-zinc-900 text-gray-500'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => paginate(currentPage + 1)}
                        className="btn-pag-nav"
                    >
                        NEXT
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;