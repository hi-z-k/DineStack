import { createPortal } from 'react-dom';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../api';
import { motion, AnimatePresence } from 'framer-motion'; // Re-added for the "pop"
import toast from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, setUser, token } = useContext(AuthContext);
    const [formData, setFormData] = useState({ 
        name: '', email: '', profilePic: '', password: '', confirmPassword: '' 
    });

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                profilePic: user.profilePic || '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [user, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, profilePic: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        const load = toast.loading("Syncing...");
        try {
            const data = await apiRequest(`/users/${user._id || user.id}`, 'PUT', formData, token);
            if (!data.error) {
                setUser(data);
                toast.success("Identity Updated");
                onClose();
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error("Server Error");
        } finally {
            toast.dismiss(load);
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px]" 
                        onClick={onClose} 
                    />

                    {/* Compact Card - Nudged to right-12 */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-24 right-12 w-80 bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-[2.5rem] z-[9999] overflow-hidden"
                    >
                        
                        <div className="bg-black p-6 text-center">
                            <div className="relative inline-block group">
                                <img 
                                    src={formData.profilePic || `https://ui-avatars.com/api/?name=${user?.name}&background=f97316&color=fff`} 
                                    className="w-16 h-16 rounded-full object-cover border-2 border-orange-500 mx-auto"
                                    alt="avatar"
                                />
                                <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                                    <span className="text-[8px] font-black text-white italic tracking-widest">EDIT</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                            <p className="text-orange-500 text-[8px] font-black tracking-[0.3em] mt-2 uppercase">User</p>
                        </div>

                        <form onSubmit={handleUpdate} className="p-5 space-y-3">
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-gray-400 uppercase ml-2 tracking-widest">Full Name</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-xs outline-none focus:border-orange-500 transition-all font-bold text-black"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-gray-400 uppercase ml-2 tracking-widest">Email Access</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-xs outline-none focus:border-orange-500 transition-all font-bold text-black"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="border-t border-gray-100 my-2 pt-2">
                                <p className="text-[8px] font-black text-orange-600 uppercase ml-2 mb-2 tracking-widest text-center">Security Override</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <input 
                                        type="password"
                                        placeholder="New Pin"
                                        className="w-full bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-[10px] outline-none focus:border-orange-500 font-bold text-black"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                    <input 
                                        type="password"
                                        placeholder="Confirm"
                                        className="w-full bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-[10px] outline-none focus:border-orange-500 font-bold text-black"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-orange-500 text-black py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-400 transition-all active:scale-95 shadow-lg shadow-orange-500/20">
                                Commit Changes
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ProfileModal;