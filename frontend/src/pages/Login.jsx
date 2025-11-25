import { Mail, Lock, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import { useContext, useMemo, useEffect } from "react";

export default function Login() {
  const Auth = useContext(AuthContext);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (Auth.userAuth.firstName) {
      navigate("/dashboard");
    }
  }, [Auth.userAuth.firstName, navigate]);

  // Animation variants - memoized for performance
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0.05 : 0.1,
        delayChildren: shouldReduceMotion ? 0.1 : 0.2,
      },
    },
  }), [shouldReduceMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: shouldReduceMotion ? 0.2 : 0.5, ease: "easeOut" },
    },
  }), [shouldReduceMotion]);

  // Handle login form submission
  async function handleLogin(formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (Auth.userAuth.firstName == null) {
      await Auth.login(email, password);

      if (Auth.userAuth.firstName != null) {
        navigate("/home");
      }
    } else {
      alert("You're Already Logged In!");
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] py-10 px-5 relative overflow-hidden">
      {/* Background decorative circles - only animate on desktop */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(243,156,18,0.15),transparent)] rounded-full blur-[80px] pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-[10%] -left-[5%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(241,196,15,0.1),transparent)] rounded-full blur-[100px] pointer-events-none"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </>
      )}

      {/* Login Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[440px] bg-[rgba(28,28,28,0.8)] backdrop-blur-xl rounded-3xl p-12 border border-[rgba(243,156,18,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <motion.div
            className="text-5xl mb-4 inline-block"
            animate={shouldReduceMotion ? {} : { rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            🧱
          </motion.div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#f39c12] to-[#f1c40f] bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-base text-[#aaa]">Sign in to continue to ReGain</p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          variants={containerVariants}
          action={handleLogin}
          className="flex flex-col gap-6"
        >
          {/* Email Field */}
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-[#ccc]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-[#888] pointer-events-none" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                className="w-full py-3.5 px-4 pl-12 text-sm bg-[rgba(42,42,42,0.6)] border border-[#3a3a3a] rounded-xl text-white outline-none transition-all duration-300 focus:border-[#f39c12]"
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-[#ccc]">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-[#888] pointer-events-none" size={20} />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full py-3.5 px-4 pl-12 text-sm bg-[rgba(42,42,42,0.6)] border border-[#3a3a3a] rounded-xl text-white outline-none transition-all duration-300 focus:border-[#f39c12]"
              />
            </div>
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div variants={itemVariants} className="flex justify-between items-center text-sm">
            <label className="flex items-center text-[#ccc] cursor-pointer">
              <input type="checkbox" className="w-4 h-4 cursor-pointer mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-[#f39c12] no-underline hover:underline transition-colors">
              Forgot password?
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            className="w-full py-4 text-base font-bold bg-gradient-to-r from-[#f39c12] to-[#e67e22] text-[#1a1a1a] border-none rounded-xl cursor-pointer flex items-center justify-center transition-all duration-300 shadow-[0_8px_24px_rgba(243,156,18,0.3)]"
            whileHover={shouldReduceMotion ? {} : { scale: 1.02, boxShadow: "0 10px 40px rgba(243, 156, 18, 0.4)" }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          >
            <span>Sign In</span>
            <ArrowRight size={20} className="ml-2" />
          </motion.button>

          {/* Sign Up Link */}
          <motion.p variants={itemVariants} className="text-center text-sm text-[#aaa] mt-2">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#f39c12] font-semibold no-underline hover:underline">
              Sign up
            </Link>
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  );
}