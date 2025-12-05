import { AuthContext } from "../context/Auth";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, MessageSquare, Archive, Clock } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import OrderCard from "../components/OrderCard";
import NegotiationCard from "../components/NegotiationCard";

export default function Dashboard() {
  const Auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (["pending", "active", "history"].includes(activeTab)) {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.regain.pp.ua/sellerOrders", {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (result.status === "success") {
        setOrders(result.data);
      } else {
        console.error("Failed to fetch orders:", result.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    switch (activeTab) {
      case "pending":
        return orders.filter(o => o.status === "pending");
      case "active":
        return orders.filter(o => ["approved", "shipping"].includes(o.status));
      case "history":
        return orders.filter(o => ["delivered", "completed", "cancelled"].includes(o.status));
      default:
        return [];
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    if (status === "cancelled" && !confirm("Are you sure you want to reject this order?")) return;
    
    try {
      const response = await fetch("https://api.regain.pp.ua/updateOrderStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, status }),
      });
      const result = await response.json();
      if (result.status === "success") {
        alert(`Order marked as ${status}`);
        fetchOrders(); // Refresh list
      } else {
        alert(`Failed to update order: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("An error occurred");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("https://api.regain.pp.ua/logout", {
        method: "POST",
        credentials: "include",
      });
      
      const result = await response.json();
      
      if (result.status === "success") {
        Auth.userAuth = {};
        navigate("/home");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Network error. Please try again.");
    }
  };

  // Mock data for negotiations
  const mockNegotiations = [
    {
      id: "NEG-001",
      material: "Bricks",
      quantity: 1000,
      unit: "pcs",
      listedPrice: 15,
      offeredPrice: 12,
      buyer: "Site Gamma",
      date: "2024-01-16",
    },
    {
      id: "NEG-002",
      material: "Sand",
      quantity: 750,
      unit: "kg",
      listedPrice: 10,
      offeredPrice: 8,
      buyer: "Site Delta",
      date: "2024-01-15",
    },
  ];

  const handleRejectNeg = (negId) => alert(`Negotiation ${negId} rejected`);
  const handleAcceptNeg = (negId) => alert(`Negotiation ${negId} accepted`);

  const getHeaderInfo = () => {
    switch (activeTab) {
      case "pending": return { title: "Pending Requests", icon: Clock, desc: "Approve or reject incoming order requests." };
      case "active": return { title: "Active Orders", icon: Package, desc: "Manage approved orders. Mark as shipped or completed." };
      case "history": return { title: "Order History", icon: Archive, desc: "View past completed and cancelled orders." };
      case "negotiations": return { title: "Negotiations", icon: MessageSquare, desc: "Review price negotiation requests from buyers." };
      default: return { title: "Dashboard", icon: Package, desc: "" };
    }
  };

  const { title, icon: Icon, desc } = getHeaderInfo();

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-[#1a1a1a]">
      <DashboardSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={Auth.userAuth} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 p-5 md:p-10 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#f39c12] mb-3 flex items-center gap-3">
            <Icon size={32} />
            {title}
          </h1>
          <p className="text-base text-[#aaa] mb-8">{desc}</p>

          {activeTab === "negotiations" ? (
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-6">
              {mockNegotiations.map((neg) => (
                <NegotiationCard 
                  key={neg.id} 
                  neg={neg} 
                  onAccept={handleAcceptNeg} 
                  onReject={handleRejectNeg} 
                />
              ))}
            </div>
          ) : (
            <>
              {loading ? (
                <p className="text-[#aaa]">Loading orders...</p>
              ) : getFilteredOrders().length === 0 ? (
                <p className="text-[#aaa]">No orders found in this category.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-6">
                  {getFilteredOrders().map((order) => (
                    <OrderCard 
                      key={order._id} 
                      order={order} 
                      activeTab={activeTab} 
                      onUpdateStatus={updateOrderStatus} 
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}