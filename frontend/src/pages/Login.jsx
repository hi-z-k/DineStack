import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
            // toast.success(`WELCOME BACK, ${data.user.name.toUpperCase()}!`);
            
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
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                {/* BRANDING SECTION */}
                <div className="text-center mb-10">
                    <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        Login<span className="text-orange-600">.</span>
                    </h2>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-4">
                        Secure Access to the Kitchen
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Identifier</label>
                        <input 
                            className="w-full bg-gray-50 border-2 border-gray-100 px-5 py-4 rounded-[24px] focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                            type="email" 
                            placeholder="EMAIL@DOMAIN.COM" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secret Key</label>
                        <input 
                            className="w-full bg-gray-50 border-2 border-gray-100 px-5 py-4 rounded-[24px] focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
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
                            className="w-full py-5 bg-black hover:bg-orange-600 text-white font-black uppercase tracking-widest rounded-[24px] transition-all shadow-xl shadow-gray-200 active:scale-[0.97] flex items-center justify-center gap-2"
                        >
                            Authorize Access
                            <span className="text-xl">→</span>
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
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