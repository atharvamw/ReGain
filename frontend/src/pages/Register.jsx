import { motion } from "framer-motion";

export default function Register() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        width: 100,
        height: 100,
        backgroundColor: "skyblue",
        borderRadius: 20,
      }}
    />
  );
}
