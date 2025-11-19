import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";



export default function Login() {

    const Auth = useContext(AuthContext);
    const navigate = useNavigate();

    if(Auth.userAuth.firstName)
    {
        navigate("/dashboard")
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const glowVariants = {
        animate: {
            boxShadow: [
                "0 0 20px rgba(243, 156, 18, 0.3)",
                "0 0 40px rgba(243, 156, 18, 0.5)",
                "0 0 20px rgba(243, 156, 18, 0.3)"
            ],
            transition: { duration: 2, repeat: Infinity }
        }
    };

    async function handleLogin(formData)
    {
        const email = formData.get("email")
        const password = formData.get("password")

        if(Auth.userAuth.firstName == null)
        {
            await Auth.login(email, password);

            if(Auth.userAuth.firstName!= null)
            {
                navigate("/home")
            }
        }
        else
        {
            alert("Your Already Logged In!");
        }
        

        console.log(email, pass)
    }

    return (
        <div style={pageStyle}>
            {/* Background decorative elements */}
            <motion.div
                style={bgCircle1}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                style={bgCircle2}
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity }}
            />

            <motion.div
                style={containerStyle}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div variants={itemVariants} style={headerStyle}>
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        style={{ fontSize: "48px", marginBottom: "16px" }}
                    >
                        🧱
                    </motion.div>
                    <h1 style={titleStyle}>Welcome Back</h1>
                    <p style={subtitleStyle}>Sign in to continue to ReGain</p>
                </motion.div>

                {/* Form */}
                <motion.form
                    style={formStyle}
                    variants={containerVariants}
                    action={handleLogin}
                >
                    {/* Email Field */}
                    <motion.div variants={itemVariants} style={inputGroupStyle}>
                        <label htmlFor="email" style={labelStyle}>
                            Email Address
                        </label>
                        <div style={inputWrapperStyle}>
                            <Mail style={iconStyle} size={20} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                style={inputStyle}
                                required
                            />
                        </div>
                    </motion.div>

                    {/* Password Field */}
                    <motion.div variants={itemVariants} style={inputGroupStyle}>
                        <label htmlFor="password" style={labelStyle}>
                            Password
                        </label>
                        <div style={inputWrapperStyle}>
                            <Lock style={iconStyle} size={20} />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                style={inputStyle}
                                required
                            />
                        </div>
                    </motion.div>

                    {/* Remember Me & Forgot Password */}
                    <motion.div variants={itemVariants} style={optionsStyle}>
                        <label style={checkboxLabelStyle}>
                            <input type="checkbox" style={checkboxStyle} />
                            <span style={{ marginLeft: "8px", fontSize: "14px" }}>Remember me</span>
                        </label>
                        <Link to="/forgot-password" style={linkStyle}>
                            Forgot password?
                        </Link>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                        variants={itemVariants}
                        style={buttonStyle}
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(243, 156, 18, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                    >
                        <span>Sign In</span>
                        <ArrowRight size={20} style={{ marginLeft: "8px" }} />
                    </motion.button>

                    {/* Sign Up Link */}
                    <motion.p variants={itemVariants} style={signupTextStyle}>
                        Don't have an account?{" "}
                        <Link to="/register" style={{ ...linkStyle, fontWeight: "600" }}>
                            Sign up
                        </Link>
                    </motion.p>
                </motion.form>
            </motion.div>
        </div>
    );
}

// Styles
const pageStyle = {
    minHeight: "calc(100vh - 80px)", // Subtract approximate navbar height
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 50%, #1a1a1a 100%)",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden"
};

const bgCircle1 = {
    position: "absolute",
    top: "-10%",
    right: "-5%",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(243, 156, 18, 0.15), transparent)",
    borderRadius: "50%",
    filter: "blur(80px)",
    pointerEvents: "none"
};

const bgCircle2 = {
    position: "absolute",
    bottom: "-10%",
    left: "-5%",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(241, 196, 15, 0.1), transparent)",
    borderRadius: "50%",
    filter: "blur(100px)",
    pointerEvents: "none"
};

const containerStyle = {
    width: "100%",
    maxWidth: "440px",
    background: "rgba(28, 28, 28, 0.8)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "48px 40px",
    border: "1px solid rgba(243, 156, 18, 0.2)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    zIndex: 1
};

const headerStyle = {
    textAlign: "center",
    marginBottom: "40px"
};

const titleStyle = {
    fontSize: "32px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #f39c12, #f1c40f)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px"
};

const subtitleStyle = {
    fontSize: "16px",
    color: "#aaa",
    margin: 0
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
};

const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
};

const labelStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#ccc"
};

const inputWrapperStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center"
};

const iconStyle = {
    position: "absolute",
    left: "16px",
    color: "#888",
    pointerEvents: "none"
};

const inputStyle = {
    width: "100%",
    padding: "14px 16px 14px 48px",
    fontSize: "15px",
    background: "rgba(42, 42, 42, 0.6)",
    border: "1px solid #3a3a3a",
    borderRadius: "12px",
    color: "#fff",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit"
};

const optionsStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px"
};

const checkboxLabelStyle = {
    display: "flex",
    alignItems: "center",
    color: "#ccc",
    cursor: "pointer"
};

const checkboxStyle = {
    width: "16px",
    height: "16px",
    cursor: "pointer"
};

const linkStyle = {
    color: "#f39c12",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.3s ease"
};

const buttonStyle = {
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #f39c12, #e67e22)",
    color: "#1a1a1a",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 24px rgba(243, 156, 18, 0.3)"
};

const dividerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    margin: "8px 0"
};

const dividerLineStyle = {
    flex: 1,
    height: "1px",
    background: "#3a3a3a"
};

const dividerTextStyle = {
    fontSize: "12px",
    color: "#666",
    fontWeight: "600"
};

const socialContainerStyle = {
    display: "flex",
    gap: "12px"
};

const socialButtonStyle = {
    flex: 1,
    padding: "14px",
    fontSize: "14px",
    fontWeight: "600",
    background: "rgba(42, 42, 42, 0.6)",
    color: "#ccc",
    border: "1px solid #3a3a3a",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s ease"
};

const signupTextStyle = {
    textAlign: "center",
    fontSize: "14px",
    color: "#aaa",
    margin: "8px 0 0 0"
};