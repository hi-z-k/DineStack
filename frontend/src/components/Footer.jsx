import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTwitter, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                            Ethio <span className="text-orange-500">Delight</span>
                        </h2>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                            Premium flavors, lightning-fast delivery. We bring the best of the city straight to your doorstep.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-orange-500 transition-colors"><FaInstagram size={20} /></a>
                            <a href="#" className="hover:text-orange-500 transition-colors"><FaFacebook size={20} /></a>
                            <a href="#" className="hover:text-orange-500 transition-colors"><FaTwitter size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-orange-500">Quick Navigation</h4>
                        <ul className="space-y-3 text-sm font-bold uppercase italic">
                            <li><Link to="/" className="hover:translate-x-2 transition-transform inline-block">Home</Link></li>
                            <li><Link to="/orders" className="hover:translate-x-2 transition-transform inline-block">Track Orders</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-orange-500">Support Center</h4>
                        <ul className="space-y-3 text-sm font-bold uppercase italic">
                            <li><a href="#" className="hover:text-white text-gray-400">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white text-gray-400">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white text-gray-400">Refund Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-orange-500">Headquarters</h4>
                        <div className="space-y-4 text-sm font-bold">
                            <div className="flex items-center gap-3">
                                <FaPhoneAlt className="text-orange-500" />
                                <span>+251 900 000 000</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-orange-500" />
                                <span>support@ethiodelight.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center md:text-left">
                        © {new Date().getFullYear()} Ethio Delight — Crafted for the Hungry
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;