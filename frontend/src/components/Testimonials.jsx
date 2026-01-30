// components/Testimonials.jsx
import { motion } from 'framer-motion';

const Testimonials = () => {
    const feedback = [
        { name: "Abel T.", text: "The Kitfo is legendary. Packaging kept it perfectly warm.", tag: "Verified Foodie" },
        { name: "Meron K.", text: "Fastest delivery in the city. The app is so smooth to use!", tag: "Busy Professional" },
        { name: "Yonas S.", text: "Best pizza in Addis, hands down. That crust is magic.", tag: "Regular Customer" }
    ];

    return (
        <section className="py-24 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-white text-4xl font-black uppercase italic tracking-widest">
                        Voices of the <span className="text-orange-500">Community</span>
                    </h2>
                    <div className="h-1 w-20 bg-orange-500 mx-auto mt-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {feedback.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-orange-500/50 transition-all group"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-orange-500 text-xs">★</span>
                                ))}
                            </div>
                            <p className="text-gray-400 italic mb-6 leading-relaxed">"{item.text}"</p>
                            <div>
                                <h4 className="text-white font-bold uppercase tracking-tighter">{item.name}</h4>
                                <span className="text-[9px] text-orange-500 font-black uppercase tracking-widest">{item.tag}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;