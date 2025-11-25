import { Mail, Lock, User, ArrowRight, Building2, Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

export default function Register() {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Animation variants - memoized for performance
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0.05 : 0.08,
        delayChildren: shouldReduceMotion ? 0.1 : 0.15,
      },
    },
  }), [shouldReduceMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: shouldReduceMotion ? 0.2 : 0.4, ease: "easeOut" },
    },
  }), [shouldReduceMotion]);

  // Handle registration form submission
  async function handleRegister(e) {
    e.preventDefault();
    setFeedback({ type: "", message: "" });
    setIsLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const fullname = formData.get("fullname");
    const phone = formData.get("phone");

    // Basic validation
    if (password !== confirmPassword) {
      setFeedback({ type: "error", message: "Passwords do not match!" });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setFeedback({ type: "error", message: "Password must be at least 6 characters long!" });
      setIsLoading(false);
      return;
    }

    // Split fullname into firstName and lastName
    const nameParts = fullname.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    if (!firstName) {
      setFeedback({ type: "error", message: "Please enter your full name!" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.regain.pp.ua/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          phone
        })
      });

      const result = await response.json();
      console.log("Registration result:", result);

      if (result.status === "success") {
        setFeedback({ type: "success", message: "Account created successfully! Redirecting to login..." });
        
        // Use setTimeout to ensure the message is visible before redirect
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } else if (result.status === "error") {
        setFeedback({ type: "error", message: result.message || "Registration failed!" });
        setIsLoading(false);
      } else {
        setFeedback({ type: "error", message: "An unexpected error occurred!" });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setFeedback({ type: "error", message: "Network error. Please try again!" });
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] py-16 px-5 relative overflow-hidden">
      {/* Background decorative circles - only animate on desktop */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(243,156,18,0.15),transparent)] rounded-full blur-[80px] pointer-events-none"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-[10%] -left-[5%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(241,196,15,0.1),transparent)] rounded-full blur-[100px] pointer-events-none"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </>
      )}

      {/* Register Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[520px] bg-[rgba(28,28,28,0.8)] backdrop-blur-xl rounded-3xl p-12 border border-[rgba(243,156,18,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-9">
          <motion.div
            className="text-5xl mb-4 inline-block cursor-pointer"
            whileHover={shouldReduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            🧱
          </motion.div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#f39c12] to-[#f1c40f] bg-clip-text text-transparent mb-2">
            Join ReGain
          </h1>
          <p className="text-base text-[#aaa]">Create your account to get started</p>
        </motion.div>

        {/* Feedback Message */}
        {feedback.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl text-sm font-semibold ${
              feedback.type === "success"
                ? "bg-[rgba(46,204,113,0.2)] text-[#2ecc71] border border-[#2ecc71]"
                : "bg-[rgba(231,76,60,0.2)] text-[#e74c3c] border border-[#e74c3c]"
            }`}
          >
            {feedback.message}
          </motion.div>
        )}

        {/* Register Form */}
        <motion.form
          variants={containerVariants}
          onSubmit={handleRegister}
          className="flex flex-col gap-5"
        >
          {/* Full Name */}
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label htmlFor="fullname" className="text-sm font-semibold text-[#ccc]">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 text-[#888] pointer-events-none" size={20} />
              <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="John Doe"
                required
                className="w-full py-3.5 px-4 pl-12 text-sm bg-[rgba(42,42,42,0.6)] border border-[#3a3a3a] rounded-xl text-white outline-none transition-all duration-300 focus:border-[#f39c12]"
              />
            </div>
          </motion.div>

          {/* Company Name */}
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label htmlFor="company" className="text-sm font-semibold text-[#ccc]">
              Company Name <span className="text-[#666]">(Optional)</span>
            </label>
            <div className="relative flex items-center">
              <Building2 className="absolute left-4 text-[#888] pointer-events-none" size={20} />
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Your Construction Co."
                className="w-full py-3.5 px-4 pl-12 text-sm bg-[rgba(42,42,42,0.6)] border border-[#3a3a3a] rounded-xl text-white outline-none transition-all duration-300 focus:border-[#f39c12]"
              />
            </div>
          </motion.div>

          {/* Email */}
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

          {/* Phone */}
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-semibold text-[#ccc]">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-4 text-[#888] pointer-events-none" size={20} />
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+1 (555) 000-0000"
                required
                className="w-full py-3.5 px-4 pl-12 text-sm bg-[rgba(42,42,42,0.6)] border border-[#3a3a3a] rounded-xl text-white outline-none transition-all duration-300 focus:border-[#f39c12]"
              />
            </div>
          </motion.div>

          {/* Password */}
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
                minLength={6}
                className="w-full py-3.5 px-4 pl-12 text-sm bg-[rgba(42,42,42,0.6)] border border-[#3a3a3a] rounded-xl text-white outline-none transition-all duration-300 focus:border-[#f39c12]"
              />
            </div>
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#ccc]">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-[#888] pointer-events-none" size={20} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full py-3.5 px-4 pl-12 text-sm bg-[rgba(42,42,42,0.6)] border border-[#3a3a3a] rounded-xl text-white outline-none transition-all duration-300 focus:border-[#f39c12]"
              />
            </div>
          </motion.div>

          {/* Terms & Conditions */}
          <motion.div variants={itemVariants} className="mt-1">
            <label className="flex items-start text-[#ccc] cursor-pointer">
              <input type="checkbox" required className="w-4 h-4 cursor-pointer mt-0.5 flex-shrink-0" />
              <span className="ml-2 text-xs leading-relaxed">
                I agree to the{" "}
                <Link to="/terms" className="text-[#f39c12] no-underline hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[#f39c12] no-underline hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-2 text-base font-bold bg-gradient-to-r from-[#f39c12] to-[#e67e22] text-[#1a1a1a] border-none rounded-xl cursor-pointer flex items-center justify-center transition-all duration-300 shadow-[0_8px_24px_rgba(243,156,18,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={shouldReduceMotion || isLoading ? {} : { scale: 1.02, boxShadow: "0 10px 40px rgba(243, 156, 18, 0.4)" }}
            whileTap={shouldReduceMotion || isLoading ? {} : { scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={20} className="ml-2" />
              </>
            )}
          </motion.button>

          {/* Sign In Link */}
          <motion.p variants={itemVariants} className="text-center text-sm text-[#aaa] mt-1">
            Already have an account?{" "}
            <Link to="/login" className="text-[#f39c12] font-semibold no-underline hover:underline">
              Sign in
            </Link>
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  );
}
