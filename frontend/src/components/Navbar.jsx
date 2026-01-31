import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileModal from './ProfileModal';
import "../styles/Navbar.css";

const Navbar = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        closeMenu();
    };

    const renderAvatar = (customClass = "h-10 w-10") => {
        const baseStyle = `${customClass} rounded-full object-cover border-2 border-orange-500`;
        if (user?.profilePic) {
            return <img src={user.profilePic} alt="Profile" className={baseStyle} />;
        }
        return (
            <div className={`${customClass} rounded-full bg-orange-600 flex items-center justify-center font-black text-white text-xs border-2 border-orange-500/20`}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
        );
    };

    return (
        <nav className={`nav-wrapper ${scrolled ? 'nav-scrolled' : 'nav-top'}`}>
            <div className="nav-container">
                <Link to="/" onClick={closeMenu} className="nav-logo">
                    <span className="nav-logo-icon">🍕</span> Ethio <span className="nav-logo-accent">Delight</span>
                </Link>
                <div className="nav-desktop-menu">
                    <Link to="/" className="nav-link">Menu</Link>

                    {user && user.role !== 'admin' && (
                        <Link to="/orders" className="nav-link">My Orders</Link>
                    )}

                    {user?.role === 'admin' && (
                        <Link to="/admin" className="nav-admin-link">Command Center</Link>
                    )}

                    {!loading && (
                        <div className="nav-auth-group">
                            {user ? (
                                <>
                                    <button onClick={() => setIsProfileOpen(true)} className="group btn-profile-trigger">
                                        <div className="hidden lg:block text-right">
                                            <p className="nav-user-name">{user.name?.split(' ')[0]}</p>
                                        </div>
                                        {renderAvatar("h-8 w-8")}
                                    </button>
                                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="nav-link">Login</Link>
                                    <Link to="/register" className="btn-join">Join</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <button onClick={toggleMenu} className="mobile-toggle">
                    <span className={`toggle-line ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`toggle-line ${isOpen ? 'opacity-0' : ''}`} />
                    <span className={`toggle-line ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }} 
                        className="mobile-drawer"
                    >
                        <div className="mobile-drawer-content">
                            {user && (
                                <button
                                    onClick={() => { setIsProfileOpen(true); closeMenu(); }}
                                    className="mobile-profile-card"
                                >
                                    {renderAvatar("h-12 w-12")}
                                    <div>
                                        <p className="text-white">{user.name}</p>
                                        <p className="nav-user-name">EDIT PROFILE →</p>
                                    </div>
                                </button>
                            )}
                            <Link to="/" onClick={closeMenu} className="py-2 border-b border-white/5">Menu</Link>
                            <div className="pt-4">
                                {user ? (
                                    <button onClick={handleLogout} className="btn-mobile-terminate">Terminate Session</button>
                                ) : (
                                    <Link to="/register" onClick={closeMenu} className="btn-mobile-init">Initialize Account</Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </nav>
    );
};

export default Navbar;