import { motion } from 'framer-motion';

const About = () => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="md:w-1/2 relative"
                    >
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-orange-500/10 rounded-full z-0" />
                        <div className="relative z-10 border-[12px] border-gray-50 rounded-2xl overflow-hidden shadow-2xl">
                            <img 
                                src="https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=1000" 
                                alt="Chef Craft" 
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </motion.div>


                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="md:w-1/2"
                    >
                        <span className="text-orange-600 font-mono font-bold tracking-[0.3em] uppercase text-xs">Our Story</span>
                        <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-tight mt-4 mb-6">
                            Crafting Flavors <br /> 
                            <span className="text-gray-400 font-normal not-italic">Since 2024</span>
                        </h2>
                        <p className="text-gray-600 text-lg italic leading-relaxed mb-8 border-l-4 border-orange-500 pl-6">
                            "From the busy streets of Addis to your doorstep. We combine traditional spices with modern speed to bring you the ultimate dining experience."
                        </p>
                        
                        <div className="flex gap-8 border-t border-gray-100 pt-8">
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Happy Eaters</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-gray-900">24/7</p>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Kitchen Access</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;