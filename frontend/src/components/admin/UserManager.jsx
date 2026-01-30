const UserManager = ({ usersList, handleDeleteUser }) => {
    const admins = usersList.filter(u => u.role === 'admin');
    const customers = usersList.filter(u => u.role !== 'admin');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-orange-500 tracking-widest ml-4">Commanders (Admins) ({admins.length})</h3>
                {admins.map(user => <UserCard key={user._id} user={user} onDelete={handleDeleteUser} />)}
            </div>
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-4">Citizens (Customers) ({customers.length})</h3>
                {customers.map(user => <UserCard key={user._id} user={user} onDelete={handleDeleteUser} />)}
            </div>
        </div>
    );
};

const UserCard = ({ user, onDelete }) => (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex justify-between items-center group hover:border-orange-200 transition-all">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400 uppercase">{user.name[0]}</div>
            <div>
                <h4 className="font-black text-sm uppercase">{user.name}</h4>
                <p className="text-[10px] text-gray-400 font-mono">{user.email}</p>
            </div>
        </div>
        <button onClick={() => onDelete(user._id)} className="bg-red-50 text-red-500 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
            <span className="text-xs font-black px-2 uppercase">Purge</span>
        </button>
    </div>
);

export default UserManager;