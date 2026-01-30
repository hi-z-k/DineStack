import "../../styles/UserManager.css";

const UserManager = ({ usersList, handleDeleteUser }) => {
    const admins = usersList.filter(u => u.role === 'admin');
    const customers = usersList.filter(u => u.role !== 'admin');

    return (
        <div className="user-manager-grid">
            <div className="user-section-stack">
                <h3 className="user-section-title title-commander">
                    Commanders (Admins) ({admins.length})
                </h3>
                {admins.map(user => (
                    <UserCard key={user._id} user={user} onDelete={handleDeleteUser} />
                ))}
            </div>

            <div className="user-section-stack">
                <h3 className="user-section-title title-citizen">
                    Citizens (Customers) ({customers.length})
                </h3>
                {customers.map(user => (
                    <UserCard key={user._id} user={user} onDelete={handleDeleteUser} />
                ))}
            </div>
        </div>
    );
};

const UserCard = ({ user, onDelete }) => (
    <div className="user-card-base group">
        <div className="user-info-cluster">
            <div className="user-avatar-placeholder">
                {user.name[0]}
            </div>
            <div>
                <h4 className="user-display-name">{user.name}</h4>
                <p className="user-identifier-email">{user.email}</p>
            </div>
        </div>
        
        <button 
            onClick={() => onDelete(user._id)} 
            className="btn-purge"
        >
            <span className="btn-purge-text">Purge</span>
        </button>
    </div>
);

export default UserManager;