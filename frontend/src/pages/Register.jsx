import { useState } from 'react';
import { apiRequest } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('INITIALIZING ACCOUNT...');
        const data = await apiRequest('/register', 'POST', formData);
        toast.dismiss(loadingToast);
        
        if (!data.error) {
            toast.success("ACCOUNT CREATED! ACCESS GRANTED.");
            navigate('/login');
        } else {
            toast.error(data.error.toUpperCase());
        }
    };

return (
        <div className="auth-screen">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card-width"
            >
                <div className="auth-header-container">
                    <h2 className="auth-title">
                        Join<span className="text-orange-600">.</span>
                    </h2>
                    <p className="auth-subtitle">
                        Create your system credentials
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="field-group">
                        <label className="field-label">Full Identity</label>
                        <input 
                            type="text" 
                            placeholder="ABEBE BIKILA" 
                            className="input-terminal"
                            required 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label">Email Identifier</label>
                        <input 
                            type="email" 
                            placeholder="ABEBE@DOMAIN.COM" 
                            className="input-terminal"
                            required 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label">Secret Key</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="input-terminal"
                            required 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            className="btn-auth-primary"
                        >
                            Create Account
                            <span className="text-xl">+</span>
                        </button>
                    </div>
                </form>

                <div className="auth-footer-divider">
                    <p className="auth-footer-text">
                        Already have credentials?{' '}
                        <Link to="/login" className="text-orange-600 hover:text-black transition-colors">
                            Return to Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;