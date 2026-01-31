import { motion } from 'framer-motion';
import "../styles/Components.css";

const Testimonials = () => {
    const feedback = [
        { name: "Abel T.", text: "The Kitfo is legendary. Packaging kept it perfectly warm.", tag: "Verified Foodie" },
        { name: "Meron K.", text: "Fastest delivery in the city. The app is so smooth to use!", tag: "Busy Professional" },
        { name: "Yonas S.", text: "Best pizza in Addis, hands down. That crust is magic.", tag: "Regular Customer" }
    ];

    return (
        <section className="testimonial-section">
            <div className="max-w-7xl mx-auto px-6">
                <div className="section-header">
                    <h2 className="section-title">
                        Voices of the <span className="title-accent">Community</span>
                    </h2>
                    <div className="title-underline" />
                </div>

                <div className="testimonial-grid">
                    {feedback.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="testimonial-card group"
                        >
                            <div className="star-row">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="star-icon">★</span>
                                ))}
                            </div>
                            <p className="testimonial-quote">"{item.text}"</p>
                            <div>
                                <h4 className="author-name">{item.name}</h4>
                                <span className="author-tag">{item.tag}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;