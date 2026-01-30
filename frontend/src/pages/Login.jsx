import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import "../styles/Auth.css"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Authenticating...');
        
        const data = await apiRequest('/login', 'POST', { email, password });
        
        toast.dismiss(loadingToast);

        if (data.token && data.user) {
            login(data.user, data.token);
            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            toast.error(data.error || 'LOGIN FAILED. ACCESS DENIED.');
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
                        Login<span className="text-orange-600">.</span>
                    </h2>
                    <p className="auth-subtitle">
                        Secure Access to the Kitchen
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="field-group">
                        <label className="field-label">Email Identifier</label>
                        <input 
                            className="input-terminal"
                            type="email" 
                            placeholder="EMAIL@DOMAIN.COM" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="field-group">
                        <label className="field-label">Secret Key</label>
                        <input 
                            className="input-terminal"
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            className="btn-auth-primary"
                        >
                            Authorize Access
                            <span className="text-xl">→</span>
                        </button>
                    </div>
                </form>

                <div className="auth-footer-divider">
                    <p className="auth-footer-text">
                        New to the platform?{' '}
                        <Link to="/register" className="text-orange-600 hover:text-black transition-colors">
                            Initialize Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;