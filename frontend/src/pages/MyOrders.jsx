import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, Phone, Loader, IndianRupee } from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://api.regain.pp.ua/myOrders", {
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

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={contentStyle}
      >
        <h1 style={pageHeaderStyle}>
          <Package size={32} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "12px" }} />
          My Orders
        </h1>
        <p style={pageDescStyle}>
          Track your purchased materials and order status.
        </p>

        {loading ? (
          <div style={loadingContainerStyle}>
            <Loader size={48} className="animate-spin" style={{ color: "#f39c12" }} />
          </div>
        ) : orders.length === 0 ? (
          <div style={noOrdersStyle}>
            <Package size={64} style={{ color: "#3a3a3a", marginBottom: "20px" }} />
            <h3 style={{ color: "#f39c12", fontSize: "24px", marginBottom: "10px" }}>No Orders Yet</h3>
            <p style={{ color: "#aaa" }}>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div style={ordersGridStyle}>
            {orders.map((order) => (
              <motion.div
                key={order._id}
                style={orderCardStyle}
                whileHover={{ y: -5, boxShadow: "0 8px 30px rgba(243, 156, 18, 0.3)" }}
              >
                <div style={cardHeaderStyle}>
                  <div>
                    <h3 style={siteNameStyle}>{order.siteName}</h3>
                    <span style={dateStyle}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span style={getStatusBadgeStyle(order.status)}>{order.status}</span>
                </div>

                <div style={orderDetailsStyle}>
                  <div style={detailRowStyle}>
                    <span style={labelStyle}>Order ID:</span>
                    <span style={valueStyle}>#{order._id.slice(-6)}</span>
                  </div>
                  
                  <div style={materialsListStyle}>
                    <span style={labelStyle}>Items:</span>
                    {Object.entries(order.materials || {}).map(([material, details]) => (
                      <div key={material} style={materialItemStyle}>
                        <span style={{ textTransform: 'capitalize' }}>{material}</span>
                        <span>{details.quantity} x ₹{details.price}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ ...detailRowStyle, ...totalRowStyle }}>
                    <span style={labelStyle}>Total Amount:</span>
                    <span style={totalValueStyle}>₹{order.totalAmount}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Styles
const containerStyle = {
  minHeight: "calc(100vh - 80px)",
  backgroundColor: "#1a1a1a",
  padding: "40px 20px",
};

const contentStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
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
  marginBottom: "40px",
};

const loadingContainerStyle = {
  display: "flex",
  justifyContent: "center",
  padding: "80px 0",
};

const noOrdersStyle = {
  textAlign: "center",
  padding: "80px 20px",
  backgroundColor: "#242424",
  borderRadius: "16px",
  border: "2px dashed #3a3a3a",
};

const ordersGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  gap: "24px",
};

const orderCardStyle = {
  backgroundColor: "#242424",
  border: "1px solid #3a3a3a",
  borderRadius: "12px",
  padding: "24px",
  transition: "all 0.3s ease",
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "20px",
  paddingBottom: "16px",
  borderBottom: "1px solid #3a3a3a",
};

const siteNameStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#fff",
  margin: "0 0 4px 0",
};

const dateStyle = {
  fontSize: "12px",
  color: "#888",
};

const getStatusBadgeStyle = (status) => {
  const baseStyle = {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  };

  switch (status) {
    case "pending":
      return { ...baseStyle, backgroundColor: "rgba(243, 156, 18, 0.2)", color: "#f39c12" };
    case "approved":
      return { ...baseStyle, backgroundColor: "rgba(52, 152, 219, 0.2)", color: "#3498db" };
    case "shipping":
      return { ...baseStyle, backgroundColor: "rgba(155, 89, 182, 0.2)", color: "#9b59b6" };
    case "delivered":
    case "completed":
      return { ...baseStyle, backgroundColor: "rgba(46, 204, 113, 0.2)", color: "#2ecc71" };
    case "cancelled":
      return { ...baseStyle, backgroundColor: "rgba(231, 76, 60, 0.2)", color: "#e74c3c" };
    default:
      return { ...baseStyle, backgroundColor: "rgba(149, 165, 166, 0.2)", color: "#95a5a6" };
  }
};

const orderDetailsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const detailRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const materialsListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  backgroundColor: "#1a1a1a",
  padding: "12px",
  borderRadius: "8px",
};

const materialItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  color: "#ccc",
  fontSize: "14px",
};

const labelStyle = {
  fontSize: "14px",
  color: "#aaa",
};

const valueStyle = {
  fontSize: "14px",
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
