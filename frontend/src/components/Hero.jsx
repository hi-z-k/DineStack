import { motion } from 'framer-motion';
import "../styles/Hero.css";

const Hero = () => {
    const scrollToMenu = () => {
        const menuSection = document.getElementById('menu');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="hero-container">
            <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1.05, opacity: 0.4 }}
                transition={{ duration: 2, ease: "easeOut" }}
                src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=2000" 
                className="hero-bg-img" 
                alt="Hero Background"
            />

            <div className="hero-overlay" />

            <div className="hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h1 className="hero-title">
                        Ethio <br className="md:hidden" /> 
                        <span className="hero-title-accent">Delight</span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="flex flex-col items-center mt-8"
                >
                    <p className="hero-subtitle">
                        Authentic Flavors • Fast Delivery
                    </p>

                    <motion.button 
                        onClick={scrollToMenu}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-hero-order"
                    >
                        Order Now
                    </motion.button>
                </motion.div>
            </div>

            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="hero-scroll-indicator"
            >
                <div className="scroll-line" />
            </motion.div>
        </div>
    );
};

export default Hero;