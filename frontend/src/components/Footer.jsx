import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTwitter, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import "../styles/Footer.css";

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-brand-stack">
                        <h2 className="footer-logo">
                            Ethio <span className="footer-logo-highlight">Delight</span>
                        </h2>
                        <p className="footer-description">
                            Premium flavors, lightning-fast delivery. We bring the best of the city straight to your doorstep.
                        </p>
                        <div className="footer-social-row">
                            <a href="#" className="social-icon-link"><FaInstagram size={20} /></a>
                            <a href="#" className="social-icon-link"><FaFacebook size={20} /></a>
                            <a href="#" className="social-icon-link"><FaTwitter size={20} /></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="footer-column-title">Quick Navigation</h4>
                        <ul className="footer-link-list">
                            <li><Link to="/" className="footer-nav-link">Home</Link></li>
                            <li><Link to="/orders" className="footer-nav-link">Track Orders</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="footer-column-title">Support Center</h4>
                        <ul className="footer-link-list">
                            <li><a href="#" className="footer-static-link">Privacy Policy</a></li>
                            <li><a href="#" className="footer-static-link">Terms of Service</a></li>
                            <li><a href="#" className="footer-static-link">Refund Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-column-title">Headquarters</h4>
                        <div className="footer-contact-stack">
                            <div className="contact-item">
                                <FaPhoneAlt className="contact-icon" />
                                <span>+251 900 000 000</span>
                            </div>
                            <div className="contact-item">
                                <FaEnvelope className="contact-icon" />
                                <span>support@ethiodelight.com</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom-bar">
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} Ethio Delight — Crafted for the Hungry
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;