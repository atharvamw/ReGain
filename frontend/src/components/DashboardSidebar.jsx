import { motion } from "framer-motion";
import { Package, MessageSquare, User, TrendingUp, LogOut, Clock, Archive } from "lucide-react";

export default function DashboardSidebar({ activeTab, setActiveTab, user, onLogout }) {
  const navItems = [
    { id: "pending", label: "Pending Requests", icon: Clock },
    { id: "active", label: "Active Orders", icon: Package },
    { id: "history", label: "History", icon: Archive },
    { id: "negotiations", label: "Negotiations", icon: MessageSquare },
  ];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full md:w-[280px] bg-[#242424] border-b md:border-b-0 md:border-r border-[#3a3a3a] p-5 md:py-8 md:px-5 flex flex-row md:flex-col gap-4 md:gap-8 justify-between items-center md:items-stretch flex-wrap md:flex-nowrap"
    >
      <div className="border-b-2 border-[#f39c12] pb-5 w-full md:w-auto">
        <h2 className="text-2xl font-bold text-[#f39c12] mb-2 flex items-center gap-2">
          <TrendingUp size={24} />
          Dashboard
        </h2>
        <p className="text-sm text-[#aaa] m-0 flex items-center gap-1">
          <User size={16} />
          {user?.firstName || "User"}
        </p>
      </div>

      <nav className="flex flex-row md:flex-col gap-3 flex-1 w-full md:w-auto overflow-x-auto md:overflow-visible">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 p-3.5 px-5 bg-transparent border-l-4 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 text-left whitespace-nowrap ${
              activeTab === item.id
                ? "bg-[rgba(243,156,18,0.15)] text-[#f39c12] border-[#f39c12]"
                : "border-transparent text-[#ccc] hover:bg-[rgba(255,255,255,0.05)]"
            }`}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <motion.button
        onClick={onLogout}
        className="flex items-center gap-3 p-3.5 px-5 bg-[#e74c3c] border-none rounded-lg text-white text-base font-semibold cursor-pointer transition-all duration-300 mt-0 md:mt-auto whitespace-nowrap hover:bg-[#c0392b]"
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </motion.button>
    </motion.aside>
  );
}
