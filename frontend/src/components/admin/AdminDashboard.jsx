import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import AdminOrders from '../AdminOrders';

const AdminDashboard = ({ stats, orders, updateStatus, deleteOrder, chartData }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon="💰" label="Total Revenue" value={`${stats?.summary?.totalRevenue?.toLocaleString() || 0} ETB`} color="text-green-500" />
                <StatCard icon="📦" label="Active Orders" value={orders.filter(o => o.status !== 'delivered').length} color="text-orange-500" />
                <StatCard icon="👥" label="System Users" value={stats?.summary?.totalUsers || 0} color="text-blue-500" />
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h3 className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-widest">Revenue Timeline (ETB)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                            <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={4} fill="url(#colorSales)" animationDuration={1500} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <AdminOrders orders={orders} updateStatus={updateStatus} deleteOrder={deleteOrder} />
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-start gap-4">
        <span className="text-2xl">{icon}</span>
        <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            <p className={`text-2xl font-black italic tracking-tighter ${color}`}>{value}</p>
        </div>
    </div>
);

export default AdminDashboard;