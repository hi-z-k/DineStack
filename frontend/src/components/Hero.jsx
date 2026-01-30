import { motion } from 'framer-motion';

const Hero = () => {
    // Smooth Scroll Function
    const scrollToMenu = () => {
        const menuSection = document.getElementById('menu');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Animated Background Image */}
            <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1.05, opacity: 0.4 }}
                transition={{ duration: 2, ease: "easeOut" }}
                src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=2000" 
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Hero Background"
            />

            {/* Dynamic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-orange-500/10 z-[1]" />

            <div className="relative z-10 text-center px-4">
                {/* Staggered Text Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h1 className="text-7xl md:text-[11rem] font-black text-white uppercase italic tracking-tighter leading-[0.8]">
                        Ethio <br className="md:hidden" /> 
                        <span className="text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]">Delight</span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="flex flex-col items-center mt-8"
                >
                    <p className="text-orange-400 font-mono tracking-[0.5em] uppercase text-[10px] md:text-sm mb-6">
                        Authentic Flavors • Fast Delivery
                    </p>

                    {/* Order Now Button with Scroll Trigger */}
                    <motion.button 
                        onClick={scrollToMenu} // Triggers the slide
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-orange-600 text-white px-10 py-4 rounded-full font-black uppercase italic tracking-widest text-xs hover:bg-orange-500 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                    >
                        Order Now
                    </motion.button>
                </motion.div>
            </div>

            {/* Scroll Indicator (Bottom) */}
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-orange-500 to-transparent" />
            </motion.div>
        </div>
    );
};

export default Hero;