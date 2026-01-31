import { createPortal } from 'react-dom';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import "../styles/ProfileModal.css";

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
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="profile-backdrop" 
                        onClick={onClose} 
                    />

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="profile-modal-card"
                    >
                        <div className="profile-modal-header">
                            <div className="avatar-wrapper group">
                                <img 
                                    src={formData.profilePic || `https://ui-avatars.com/api/?name=${user?.name}&background=f97316&color=fff`} 
                                    className="avatar-img"
                                    alt="avatar"
                                />
                                <label className="avatar-edit-overlay">
                                    <span className="text-[8px] font-black text-white italic tracking-widest">EDIT</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                            <p className="user-badge-text">User</p>
                        </div>

                        <form onSubmit={handleUpdate} className="profile-form">
                            <div className="profile-input-group">
                                <label className="profile-label">Full Name</label>
                                <input 
                                    className="profile-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div className="profile-input-group">
                                <label className="profile-label">Email Access</label>
                                <input 
                                    className="profile-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="security-divider">
                                <p className="security-title">Security Override</p>
                                <div className="security-grid">
                                    <input 
                                        type="password"
                                        placeholder="New Pin"
                                        className="profile-input"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                    <input 
                                        type="password"
                                        placeholder="Confirm"
                                        className="profile-input"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-profile-submit">
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