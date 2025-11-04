import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path || (path === '/home' && location.pathname === '/');
    };

    const navLinks = [
        { path: '/home', label: 'Home' },
        { path: '/graph', label: 'Graph Mode' },
        { path: '/map', label: 'Map Mode' },
        { path: '/login', label: 'Login' }
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={navStyle}
        >
            <div style={navContainerStyle}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: "none" }}>
                    <motion.div
                        style={logoStyle}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.span
                            animate={{ 
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                            style={{ display: "inline-block" }}
                        >
                            🧱
                        </motion.span>
                        <span style={logoTextStyle}>ReGain</span>
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <div style={desktopNavStyle}>
                    {navLinks.map((link, index) => (
                        <Link 
                            key={link.path} 
                            to={link.path} 
                            style={{ textDecoration: "none", position: "relative" }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                style={{
                                    ...navLinkStyle,
                                    color: isActive(link.path) ? "#f39c12" : "#ccc"
                                }}
                                whileHover={{ y: -2 }}
                            >
                                {link.label}
                                {isActive(link.path) && (
                                    <motion.div
                                        layoutId="activeTab"
                                        style={activeIndicatorStyle}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    style={mobileMenuButtonStyle}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    whileTap={{ scale: 0.9 }}
                >
                    <motion.div
                        animate={isMobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isMobileMenuOpen ? '✕' : '☰'}
                    </motion.div>
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <motion.div
                initial={false}
                animate={isMobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={mobileMenuStyle}
            >
                <div style={mobileMenuContentStyle}>
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path} 
                            style={{ textDecoration: "none" }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <motion.div
                                style={{
                                    ...mobileNavLinkStyle,
                                    backgroundColor: isActive(link.path) ? "rgba(243, 156, 18, 0.1)" : "transparent",
                                    borderLeft: isActive(link.path) ? "4px solid #f39c12" : "4px solid transparent",
                                    color: isActive(link.path) ? "#f39c12" : "#ccc"
                                }}
                                whileHover={{ x: 10, backgroundColor: "rgba(243, 156, 18, 0.05)" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {link.label}
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </motion.div>
        </motion.nav>
    );
}

// Styles
const navStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    background: "linear-gradient(180deg, rgba(28, 28, 28, 0.98) 0%, rgba(28, 28, 28, 0.95) 100%)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(243, 156, 18, 0.2)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
};

const navContainerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
};

const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "28px"
};

const logoTextStyle = {
    fontWeight: "900",
    fontSize: "clamp(20px, 3vw, 32px)",
    background: "linear-gradient(135deg, #f39c12, #f1c40f)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "1px"
};

const desktopNavStyle = {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    "@media (max-width: 768px)": {
        display: "none"
    }
};

const navLinkStyle = {
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    cursor: "pointer",
    borderRadius: "8px",
    display: "inline-flex",
    alignItems: "center",
    position: "relative",
    whiteSpace: "nowrap"
};

const activeIndicatorStyle = {
    position: "absolute",
    bottom: "0px",
    left: "20px",
    right: "20px",
    height: "3px",
    background: "linear-gradient(90deg, #f39c12, #f1c40f)",
    borderRadius: "2px 2px 0 0",
    boxShadow: "0 0 8px rgba(243, 156, 18, 0.5)"
};

const mobileMenuButtonStyle = {
    display: "none",
    fontSize: "28px",
    background: "transparent",
    border: "none",
    color: "#f39c12",
    cursor: "pointer",
    padding: "8px",
    "@media (max-width: 768px)": {
        display: "block"
    }
};

const mobileMenuStyle = {
    overflow: "hidden",
    background: "rgba(20, 20, 20, 0.98)",
    borderTop: "1px solid rgba(243, 156, 18, 0.1)"
};

const mobileMenuContentStyle = {
    padding: "16px 0",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
};

const mobileNavLinkStyle = {
    padding: "16px 32px",
    fontSize: "18px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease"
};

// Media query hack using window resize (for mobile menu button visibility)
if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            nav > div > div:nth-child(2) {
                display: none !important;
            }
            nav > div > button {
                display: block !important;
            }
        }
    `;
    document.head.appendChild(style);
}