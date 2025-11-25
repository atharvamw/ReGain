import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Rocket, Map, MapPin, Handshake, Recycle, DollarSign, Leaf, Zap, Lock, Search as SearchIcon } from "lucide-react";

export default function Home() {
    const shouldReduceMotion = useReducedMotion();

    const fadeInUp = useMemo(() => ({
        initial: { opacity: 0, y: shouldReduceMotion ? 0 : 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: shouldReduceMotion ? 0.3 : 0.6 }
    }), [shouldReduceMotion]);

    const staggerContainer = useMemo(() => ({
        animate: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0.1 : 0.2
            }
        }
    }), [shouldReduceMotion]);

    const scaleIn = useMemo(() => ({
        initial: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: shouldReduceMotion ? 0.2 : 0.4 }
    }), [shouldReduceMotion]);

    const fadeIn = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 }
    };

    return (
        <div style={{ width: "100%", overflow: "hidden", margin: 0, padding: 0 }}>
            {/* Hero Section */}
            <motion.section
                initial="initial"
                animate="animate"
                style={heroSectionStyle}
            >
                <div style={heroContentStyle}>
                    <motion.div {...fadeInUp}>
                        <motion.h1 
                            style={heroTitleStyle}
                            animate={shouldReduceMotion ? {} : { 
                                textShadow: [
                                    "0 0 20px rgba(243, 156, 18, 0.5)",
                                    "0 0 40px rgba(243, 156, 18, 0.8)",
                                    "0 0 20px rgba(243, 156, 18, 0.5)"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🧱 ReGain
                        </motion.h1>
                        <motion.p style={heroSubtitleStyle} {...fadeInUp} transition={{ delay: 0.2 }}>
                            Reduce Construction Waste. Connect. Reuse. Rebuild.
                        </motion.p>
                        <motion.p style={heroDescStyle} {...fadeInUp} transition={{ delay: 0.4 }}>
                            Join the sustainable construction revolution. Connect with nearby sites to share excess materials, 
                            reduce waste, and save costs.
                        </motion.p>
                    </motion.div>

                    <motion.div 
                        style={ctaContainerStyle}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <Link to="/graph" style={{ textDecoration: "none" }}>
                            <motion.button
                                style={primaryButtonStyle}
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(243, 156, 18, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Rocket size={20} style={{ marginRight: "8px" }} />
                                Get Started
                            </motion.button>
                        </Link>
                        <Link to="/search" style={{ textDecoration: "none" }}>
                            <motion.button
                                style={secondaryButtonStyle}
                                whileHover={{ scale: 1.05, backgroundColor: "#2a2a2a" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <SearchIcon size={20} style={{ marginRight: "8px" }} />
                                Search Materials
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                {/* Animated background elements - only on desktop */}
                {!shouldReduceMotion && (
                    <>
                        <motion.div
                            style={floatingElement1}
                            animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        />
                        <motion.div
                            style={floatingElement2}
                            animate={{ y: [20, -20, 20], rotate: [0, -5, 0] }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />
                    </>
                )}
            </motion.section>

            {/* How It Works Section */}
            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                style={sectionStyle}
            >
                <motion.h2 style={sectionTitleStyle} {...fadeInUp}>
                    How It Works
                </motion.h2>
                <div style={cardsContainerStyle}>
                    {[
                        { Icon: MapPin, title: "Locate", desc: "Find construction sites near you with excess materials" },
                        { Icon: Handshake, title: "Connect", desc: "Direct communication with site managers for transactions" },
                        { Icon: Recycle, title: "Reuse", desc: "Save costs and reduce environmental waste together" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            style={cardStyle}
                            variants={scaleIn}
                            whileHover={{ 
                                y: -10, 
                                boxShadow: "0 20px 40px rgba(243, 156, 18, 0.3)",
                                borderColor: "#f39c12"
                            }}
                        >
                            <div style={cardIconStyle}>
                                <item.Icon size={64} color="#f39c12" />
                            </div>
                            <h3 style={cardTitleStyle}>{item.title}</h3>
                            <p style={cardDescStyle}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Benefits Section */}
            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                style={{ ...sectionStyle, backgroundColor: "#1a1a1a" }}
            >
                <motion.h2 style={sectionTitleStyle} variants={fadeIn}>
                    Why Choose ReGain?
                </motion.h2>
                <motion.div 
                    style={benefitsGridStyle}
                    variants={staggerContainer}
                >
                    {[
                        { Icon: DollarSign, title: "Cost Savings", desc: "Save up to 40% on material costs" },
                        { Icon: Leaf, title: "Eco-Friendly", desc: "Reduce construction waste significantly" },
                        { Icon: Zap, title: "Quick Access", desc: "Find materials instantly nearby" },
                        { Icon: Lock, title: "Secure Deals", desc: "Verified listings and safe transactions" }
                    ].map((benefit, i) => (
                        <motion.div
                            key={i}
                            style={benefitCardStyle}
                            variants={scaleIn}
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 10px 30px rgba(243, 156, 18, 0.2)"
                            }}
                        >
                            <benefit.Icon size={48} color="#f39c12" style={{ marginBottom: "16px" }} />
                            <h4 style={{ color: "#f39c12", fontSize: "20px", marginBottom: "8px", margin: 0 }}>{benefit.title}</h4>
                            <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>{benefit.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>
        </div>
    );
}

// Styles
const heroSectionStyle = {
    minHeight: "90vh",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 50%, #1a1a1a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "80px 20px",
    width: "100%"
};

const heroContentStyle = {
    maxWidth: "900px",
    textAlign: "center",
    zIndex: 1,
    position: "relative"
};

const heroTitleStyle = {
    fontSize: "clamp(48px, 8vw, 96px)",
    fontWeight: "900",
    background: "linear-gradient(135deg, #f39c12, #f1c40f)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "24px",
    letterSpacing: "2px"
};

const heroSubtitleStyle = {
    fontSize: "clamp(20px, 3vw, 32px)",
    color: "#f39c12",
    marginBottom: "16px",
    fontWeight: "600"
};

const heroDescStyle = {
    fontSize: "clamp(14px, 2vw, 18px)",
    color: "#ccc",
    lineHeight: "1.8",
    marginBottom: "40px",
    maxWidth: "700px",
    margin: "0 auto 40px"
};

const ctaContainerStyle = {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap"
};

const primaryButtonStyle = {
    padding: "14px 36px",
    fontSize: "18px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #f39c12, #e67e22)",
    color: "#1a1a1a",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 8px 30px rgba(243, 156, 18, 0.4)",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
};

const secondaryButtonStyle = {
    padding: "14px 36px",
    fontSize: "18px",
    fontWeight: "700",
    background: "transparent",
    color: "#f39c12",
    border: "2px solid #f39c12",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
};

const floatingElement1 = {
    position: "absolute",
    top: "10%",
    right: "10%",
    width: "200px",
    height: "200px",
    background: "radial-gradient(circle, rgba(243, 156, 18, 0.1), transparent)",
    borderRadius: "50%",
    filter: "blur(40px)"
};

const floatingElement2 = {
    position: "absolute",
    bottom: "15%",
    left: "5%",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(241, 196, 15, 0.1), transparent)",
    borderRadius: "50%",
    filter: "blur(60px)"
};

const sectionStyle = {
    padding: "100px 40px",
    backgroundColor: "#242424",
    width: "100%"
};

const sectionTitleStyle = {
    fontSize: "clamp(32px, 5vw, 48px)",
    fontWeight: "800",
    color: "#f39c12",
    textAlign: "center",
    marginBottom: "60px"
};

const cardsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "32px",
    maxWidth: "1200px",
    margin: "0 auto"
};

const cardStyle = {
    background: "linear-gradient(135deg, #2a2a2a, #1f1f1f)",
    padding: "40px 32px",
    borderRadius: "16px",
    border: "2px solid #3a3a3a",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer"
};

const cardIconStyle = {
    fontSize: "64px",
    marginBottom: "24px"
};

const cardTitleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#f39c12",
    marginBottom: "12px"
};

const cardDescStyle = {
    fontSize: "15px",
    color: "#aaa",
    lineHeight: "1.6"
};

const benefitsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto"
};

const benefitCardStyle = {
    background: "#242424",
    padding: "40px 24px",
    borderRadius: "12px",
    border: "1px solid #3a3a3a",
    textAlign: "center",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start"
};