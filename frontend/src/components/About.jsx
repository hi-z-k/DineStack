import { motion } from 'framer-motion';
import "../styles/About.css";

const About = () => {
    return (
        <section className="about-section">
            <div className="about-container">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="about-image-wrapper"
                >
                    <div className="about-image-accent" />
                    <div className="about-image-frame">
                        <img 
                            src="https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=1000" 
                            alt="Chef Craft" 
                            className="about-img"
                        />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="about-content"
                >
                    <span className="about-tagline">Our Story</span>
                    
                    <h2 className="about-heading">
                        Crafting Flavors <br /> 
                        <span className="about-heading-year">Since 2024</span>
                    </h2>

                    <p className="about-quote">
                        "From the busy streets of Addis to your doorstep. We combine traditional spices with modern speed to bring you the ultimate dining experience."
                    </p>
                    
                    <div className="about-stats-row">
                        <div className="stat-block">
                            <p className="stat-number">5k+</p>
                            <p className="stat-label">Happy Eaters</p>
                        </div>
                        <div className="stat-block">
                            <p className="stat-number">24/7</p>
                            <p className="stat-label">Kitchen Access</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;