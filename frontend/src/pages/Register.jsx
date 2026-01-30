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
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                {/* BRANDING SECTION */}
                <div className="text-center mb-10">
                    <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        Join<span className="text-orange-600">.</span>
                    </h2>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-4">
                        Create your system credentials
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* FULL NAME */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
                        <input 
                            type="text" 
                            placeholder="ABEBE BIKILA" 
                            className="w-full bg-gray-50 border-2 border-gray-100 px-5 py-4 rounded-[24px] focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                            required 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Identifier</label>
                        <input 
                            type="email" 
                            placeholder="ABEBE@DOMAIN.COM" 
                            className="w-full bg-gray-50 border-2 border-gray-100 px-5 py-4 rounded-[24px] focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                            required 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secret Key</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full bg-gray-50 border-2 border-gray-100 px-5 py-4 rounded-[24px] focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                            required 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            className="w-full py-5 bg-black hover:bg-orange-600 text-white font-black uppercase tracking-widest rounded-[24px] transition-all shadow-xl shadow-gray-200 active:scale-[0.97] flex items-center justify-center gap-2"
                        >
                            Create Account
                            <span className="text-xl">+</span>
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
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