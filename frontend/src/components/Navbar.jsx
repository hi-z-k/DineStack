import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react'; // Added useEffect
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileModal from './ProfileModal';

const Navbar = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false); // Added scroll state
    const navigate = useNavigate();

    // Scroll listener logic
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
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

    // Helper to get initials or avatar
    const renderAvatar = (size = "h-10 w-10") => {
        if (user?.profilePic) {
            return <img src={user.profilePic} alt="Profile" className={`${size} rounded-full object-cover border-2 border-orange-500`} />;
        }
        return (
            <div className={`${size} rounded-full bg-orange-600 flex items-center justify-center font-black text-white text-xs border-2 border-orange-500/20`}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
        );
    };

    return (
        <nav className={`sticky top-0 z-[100] transition-all duration-300 border-b shadow-2xl ${scrolled
                ? 'bg-black border-white/10'
                : 'bg-zinc-950 border-transparent'
            } text-white`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

                <Link to="/" onClick={closeMenu} className="text-xl font-black italic tracking-tighter uppercase leading-none">
                    <span className="text-orange-500 text-3xl">🍕</span>  Ethio <span className="text-orange-500">Delight</span>
                </Link>

                {/* DESKTOP LINKS */}
                <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Link to="/" className="hover:text-orange-500 transition-colors">Menu</Link>

                    {user && user.role !== 'admin' && (
                        <Link to="/orders" className="hover:text-orange-500 transition-colors">My Orders</Link>
                    )}

                    {user?.role === 'admin' && (
                        <Link to="/admin" className="text-orange-500 border-2 border-orange-500/20 px-4 py-1.5 rounded-full hover:bg-orange-500 hover:text-black transition-all">
                            Command Center
                        </Link>
                    )}

                    {!loading && (
                        <div className="flex items-center border-l border-white/10 pl-8 gap-6">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsProfileOpen(true)}
                                        className="flex items-center gap-3 group hover:opacity-80 transition-all bg-white/5 py-1.5 pl-4 pr-1.5 rounded-full border border-white/10"
                                    >
                                        <div className="text-right hidden lg:block">
                                            <p className="text-[10px] text-orange-500 font-black tracking-tight">
                                                {user.name?.split(' ')[0].toUpperCase()}
                                            </p>
                                        </div>
                                        {renderAvatar("h-8 w-8")}
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="text-[10px] font-black uppercase text-gray-500 hover:text-red-500 transition-colors tracking-widest"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="hover:text-orange-500 transition-colors">Login</Link>
                                    <Link to="/register" className="bg-orange-500 text-black px-5 py-2.5 rounded-xl font-black">Join</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* MOBILE BUTTON */}
                <button onClick={toggleMenu} className="md:hidden flex flex-col gap-1.5 p-2">
                    <span className={`h-0.5 w-6 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`h-0.5 w-6 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`} />
                    <span className={`h-0.5 w-6 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {/* MOBILE DROPDOWN */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-black border-t border-white/5 overflow-hidden">
                        <div className="flex flex-col p-6 gap-6 text-sm font-black uppercase tracking-widest">
                            {user && (
                                <button
                                    onClick={() => { setIsProfileOpen(true); closeMenu(); }}
                                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10"
                                >
                                    {renderAvatar("h-12 w-12")}
                                    <div className="text-left">
                                        <p className="text-white">{user.name}</p>
                                        <p className="text-[10px] text-orange-500">EDIT PROFILE →</p>
                                    </div>
                                </button>
                            )}
                            <Link to="/" onClick={closeMenu} className="py-2 border-b border-white/5">Menu</Link>
                            <div className="pt-4 flex flex-col gap-4">
                                {user ? (
                                    <button onClick={handleLogout} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase">Terminate Session</button>
                                ) : (
                                    <Link to="/register" onClick={closeMenu} className="w-full text-center py-4 bg-orange-500 text-black rounded-2xl font-black">Initialize Account</Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </nav>
    );
};

export default Navbar;