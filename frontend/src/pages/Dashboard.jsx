import { AuthContext } from "../context/Auth";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, MessageSquare, User, X, CheckCircle, XCircle, TrendingUp, LogOut, Truck, Archive, Clock } from "lucide-react";

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
      // We'll fetch all seller orders and filter on the frontend for simplicity
      // In a real app with pagination, you'd want specific endpoints
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

  const handleReject = (negId) => {
    alert(`Negotiation ${negId} rejected`);
  };

  const handleAccept = (negId) => {
    alert(`Negotiation ${negId} accepted`);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("https://api.regain.pp.ua/logout", {
        method: "POST",
        credentials: "include",
      });
      
      const result = await response.json();
      
      if (result.status === "success") {
        // Clear auth context
        Auth.userAuth = {};
        // Redirect to home
        navigate("/home");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={sidebarStyle}
      >
        <div style={sidebarHeaderStyle}>
          <h2 style={sidebarTitleStyle}>
            <TrendingUp size={24} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "8px" }} />
            Dashboard
          </h2>
          <p style={userNameStyle}>
            <User size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
            {Auth.userAuth.firstName}
          </p>
        </div>

        <nav style={navStyle}>
          <motion.button
            onClick={() => setActiveTab("pending")}
            style={{
              ...navButtonStyle,
              ...(activeTab === "pending" ? activeNavButtonStyle : {}),
            }}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Clock size={20} />
            <span>Pending Requests</span>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("active")}
            style={{
              ...navButtonStyle,
              ...(activeTab === "active" ? activeNavButtonStyle : {}),
            }}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Package size={20} />
            <span>Active Orders</span>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("history")}
            style={{
              ...navButtonStyle,
              ...(activeTab === "history" ? activeNavButtonStyle : {}),
            }}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Archive size={20} />
            <span>History</span>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("negotiations")}
            style={{
              ...navButtonStyle,
              ...(activeTab === "negotiations" ? activeNavButtonStyle : {}),
            }}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageSquare size={20} />
            <span>Negotiations</span>
          </motion.button>
        </nav>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          style={logoutButtonStyle}
          whileHover={{ x: 5, backgroundColor: "#c0392b" }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <main style={mainContentStyle}>
        {["pending", "active", "history"].includes(activeTab) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={activeTab} // Force re-render on tab change for animation
          >
            <h1 style={pageHeaderStyle}>
              {activeTab === "pending" && <Clock size={32} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "12px" }} />}
              {activeTab === "active" && <Package size={32} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "12px" }} />}
              {activeTab === "history" && <Archive size={32} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "12px" }} />}
              
              {activeTab === "pending" && "Pending Requests"}
              {activeTab === "active" && "Active Orders"}
              {activeTab === "history" && "Order History"}
            </h1>
            <p style={pageDescStyle}>
              {activeTab === "pending" && "Approve or reject incoming order requests."}
              {activeTab === "active" && "Manage approved orders. Mark as shipped or completed."}
              {activeTab === "history" && "View past completed and cancelled orders."}
            </p>

            {loading ? (
              <p style={{color: '#aaa'}}>Loading orders...</p>
            ) : getFilteredOrders().length === 0 ? (
              <p style={{color: '#aaa'}}>No orders found in this category.</p>
            ) : (
              <div style={cardsContainerStyle}>
                {getFilteredOrders().map((order) => (
                  <motion.div
                    key={order._id}
                    style={orderCardStyle}
                    whileHover={{ y: -5, boxShadow: "0 8px 30px rgba(243, 156, 18, 0.3)" }}
                  >
                    <div style={cardHeaderStyle}>
                      <h3 style={orderIdStyle}>Order #{order._id.slice(-6)}</h3>
                      <span style={statusBadgeStyle}>{order.status}</span>
                    </div>

                    <div style={orderDetailsStyle}>
                      <div style={detailRowStyle}>
                        <span style={labelStyle}>Buyer:</span>
                        <span style={valueStyle}>
                          {order.buyerDetails?.firstName} {order.buyerDetails?.lastName}
                        </span>
                      </div>
                      <div style={detailRowStyle}>
                        <span style={labelStyle}>Phone:</span>
                        <span style={valueStyle}>{order.buyerDetails?.phone}</span>
                      </div>
                      
                      <div style={{marginTop: '10px', marginBottom: '5px'}}>
                        <span style={labelStyle}>Materials:</span>
                      </div>
                      {Object.entries(order.materials || {}).map(([material, details]) => (
                        <div key={material} style={detailRowStyle}>
                          <span style={{...valueStyle, textTransform: 'capitalize', marginLeft: '10px'}}>
                            - {material}
                          </span>
                          <span style={valueStyle}>
                            {details.quantity} x ₹{details.price}
                          </span>
                        </div>
                      ))}

                      <div style={{ ...detailRowStyle, ...totalRowStyle }}>
                        <span style={labelStyle}>Total Amount:</span>
                        <span style={totalValueStyle}>₹{order.totalAmount}</span>
                      </div>
                    </div>

                    <div style={actionButtonsStyle}>
                      {activeTab === "pending" && (
                        <>
                          <motion.button
                            onClick={() => updateOrderStatus(order._id, 'cancelled')}
                            style={cancelButtonStyle}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X size={16} style={{ marginRight: "6px" }} />
                            Reject
                          </motion.button>
                          <motion.button
                            onClick={() => updateOrderStatus(order._id, 'approved')}
                            style={shippedButtonStyle}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <CheckCircle size={16} style={{ marginRight: "6px" }} />
                            Approve
                          </motion.button>
                        </>
                      )}

                      {activeTab === "active" && (
                        <>
                          {order.status === "approved" && (
                            <motion.button
                              onClick={() => updateOrderStatus(order._id, 'shipping')}
                              style={shippedButtonStyle}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Truck size={16} style={{ marginRight: "6px" }} />
                              Mark Shipped
                            </motion.button>
                          )}
                          {order.status === "shipping" && (
                            <motion.button
                              onClick={() => updateOrderStatus(order._id, 'completed')}
                              style={shippedButtonStyle}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <CheckCircle size={16} style={{ marginRight: "6px" }} />
                              Complete
                            </motion.button>
                          )}
                        </>
                      )}
                      
                      {/* No actions for history tab */}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "negotiations" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 style={pageHeaderStyle}>
              <MessageSquare size={32} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "12px" }} />
              Negotiations
            </h1>
            <p style={pageDescStyle}>
              Review price negotiation requests from buyers.
            </p>

            <div style={cardsContainerStyle}>
              {mockNegotiations.map((neg) => (
                <motion.div
                  key={neg.id}
                  style={negotiationCardStyle}
                  whileHover={{ y: -5, boxShadow: "0 8px 30px rgba(243, 156, 18, 0.3)" }}
                >
                  <div style={cardHeaderStyle}>
                    <h3 style={orderIdStyle}>{neg.id}</h3>
                    <span style={dateStyle}>{neg.date}</span>
                  </div>

                  <div style={orderDetailsStyle}>
                    <div style={detailRowStyle}>
                      <span style={labelStyle}>Material:</span>
                      <span style={valueStyle}>{neg.material}</span>
                    </div>
                    <div style={detailRowStyle}>
                      <span style={labelStyle}>Quantity:</span>
                      <span style={valueStyle}>
                        {neg.quantity} {neg.unit}
                      </span>
                    </div>
                    <div style={detailRowStyle}>
                      <span style={labelStyle}>Buyer:</span>
                      <span style={valueStyle}>{neg.buyer}</span>
                    </div>
                  </div>

                  <div style={priceComparisonStyle}>
                    <div style={priceBoxStyle}>
                      <span style={priceLabel}>Your Price</span>
                      <span style={listedPriceStyle}>₹{neg.listedPrice}</span>
                    </div>
                    <span style={arrowStyle}>→</span>
                    <div style={priceBoxStyle}>
                      <span style={priceLabel}>Offer</span>
                      <span style={offeredPriceStyle}>₹{neg.offeredPrice}</span>
                    </div>
                  </div>

                  <div style={actionButtonsStyle}>
                    <motion.button
                      onClick={() => handleReject(neg.id)}
                      style={rejectButtonStyle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <XCircle size={16} style={{ marginRight: "6px" }} />
                      Reject
                    </motion.button>
                    <motion.button
                      onClick={() => handleAccept(neg.id)}
                      style={acceptButtonStyle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CheckCircle size={16} style={{ marginRight: "6px" }} />
                      Accept
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

// ============ Styles ============

const containerStyle = {
  display: "flex",
  flexDirection: window.innerWidth <= 768 ? "column" : "row",
  minHeight: "calc(100vh - 80px)",
  backgroundColor: "#1a1a1a",
};

const sidebarStyle = {
  width: window.innerWidth <= 768 ? "100%" : "280px",
  backgroundColor: "#242424",
  borderRight: window.innerWidth <= 768 ? "none" : "1px solid #3a3a3a",
  borderBottom: window.innerWidth <= 768 ? "1px solid #3a3a3a" : "none",
  padding: window.innerWidth <= 768 ? "20px" : "32px 20px",
  display: "flex",
  flexDirection: window.innerWidth <= 768 ? "row" : "column",
  gap: window.innerWidth <= 768 ? "16px" : "32px",
  justifyContent: "space-between",
  alignItems: window.innerWidth <= 768 ? "center" : "stretch",
  flexWrap: window.innerWidth <= 768 ? "wrap" : "nowrap",
};

const sidebarHeaderStyle = {
  borderBottom: "2px solid #f39c12",
  paddingBottom: "20px",
};

const sidebarTitleStyle = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#f39c12",
  margin: "0 0 8px 0",
};

const userNameStyle = {
  fontSize: "14px",
  color: "#aaa",
  margin: 0,
};

const navStyle = {
  display: "flex",
  flexDirection: window.innerWidth <= 768 ? "row" : "column",
  gap: "12px",
  flex: window.innerWidth <= 768 ? "1" : "auto",
};

const navButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 20px",
  backgroundColor: "transparent",
  borderTopWidth: "0px",
  borderRightWidth: "0px",
  borderBottomWidth: "0px",
  borderLeftWidth: "0px",
  borderStyle: "solid",
  borderTopColor: "transparent",
  borderRightColor: "transparent",
  borderBottomColor: "transparent",
  borderLeftColor: "transparent",
  borderRadius: "8px",
  color: "#ccc",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textAlign: "left",
};

const activeNavButtonStyle = {
  backgroundColor: "rgba(243, 156, 18, 0.15)",
  color: "#f39c12",
  borderLeftWidth: "4px",
  borderLeftColor: "#f39c12",
};

const iconStyle = {
  fontSize: "20px",
};

const mainContentStyle = {
  flex: 1,
  padding: window.innerWidth <= 768 ? "20px" : "40px",
  overflowY: "auto",
};

const pageHeaderStyle = {
  fontSize: "clamp(28px, 4vw, 36px)",
  fontWeight: "700",
  color: "#f39c12",
  margin: "0 0 12px 0",
};

const pageDescStyle = {
  fontSize: "16px",
  color: "#aaa",
  marginBottom: "32px",
};

const cardsContainerStyle = {
  display: "grid",
  gridTemplateColumns: window.innerWidth <= 768 
    ? "1fr" 
    : "repeat(auto-fill, minmax(380px, 1fr))",
  gap: "24px",
};

const orderCardStyle = {
  backgroundColor: "#242424",
  border: "1px solid #3a3a3a",
  borderRadius: "12px",
  padding: "24px",
  transition: "all 0.3s ease",
};

const negotiationCardStyle = {
  backgroundColor: "#242424",
  border: "1px solid #3a3a3a",
  borderRadius: "12px",
  padding: "24px",
  transition: "all 0.3s ease",
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  paddingBottom: "16px",
  borderBottom: "1px solid #3a3a3a",
};

const orderIdStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#f39c12",
  margin: 0,
};

const statusBadgeStyle = {
  padding: "6px 12px",
  backgroundColor: "rgba(46, 204, 113, 0.2)",
  color: "#2ecc71",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "capitalize",
};

const dateStyle = {
  fontSize: "13px",
  color: "#888",
};

const orderDetailsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginBottom: "20px",
};

const detailRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const labelStyle = {
  fontSize: "14px",
  color: "#aaa",
};

const valueStyle = {
  fontSize: "15px",
  color: "#fff",
  fontWeight: "600",
};

const totalRowStyle = {
  paddingTop: "12px",
  borderTop: "1px solid #3a3a3a",
  marginTop: "8px",
};

const totalValueStyle = {
  fontSize: "18px",
  color: "#f39c12",
  fontWeight: "700",
};

const priceComparisonStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px",
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  marginBottom: "20px",
};

const priceBoxStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
};

const priceLabel = {
  fontSize: "12px",
  color: "#888",
  textTransform: "uppercase",
};

const listedPriceStyle = {
  fontSize: "20px",
  color: "#ccc",
  fontWeight: "700",
};

const offeredPriceStyle = {
  fontSize: "20px",
  color: "#f39c12",
  fontWeight: "700",
};

const arrowStyle = {
  fontSize: "24px",
  color: "#666",
};

const actionButtonsStyle = {
  display: "flex",
  gap: "12px",
};

const cancelButtonStyle = {
  flex: 1,
  padding: "12px",
  backgroundColor: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const shippedButtonStyle = {
  flex: 1,
  padding: "12px",
  backgroundColor: "#2ecc71",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const rejectButtonStyle = {
  flex: 1,
  padding: "12px",
  backgroundColor: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const acceptButtonStyle = {
  flex: 1,
  padding: "12px",
  backgroundColor: "#2ecc71",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const logoutButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 20px",
  backgroundColor: "#e74c3c",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginTop: window.innerWidth <= 768 ? "0" : "auto",
  whiteSpace: "nowrap",
};