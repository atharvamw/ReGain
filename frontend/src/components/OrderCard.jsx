import { motion } from "framer-motion";
import { X, CheckCircle, Truck } from "lucide-react";

export default function OrderCard({ order, activeTab, onUpdateStatus }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-[rgba(243,156,18,0.2)] text-[#f39c12]";
      case "approved": return "bg-[rgba(46,204,113,0.2)] text-[#2ecc71]";
      case "shipping": return "bg-[rgba(52,152,219,0.2)] text-[#3498db]";
      case "delivered": 
      case "completed": return "bg-[rgba(46,204,113,0.2)] text-[#2ecc71]";
      case "cancelled": return "bg-[rgba(231,76,60,0.2)] text-[#e74c3c]";
      default: return "bg-[rgba(149,165,166,0.2)] text-[#95a5a6]";
    }
  };

  return (
    <motion.div
      className="bg-[#242424] border border-[#3a3a3a] rounded-xl p-6 transition-all duration-300 hover:border-[#f39c12]"
      whileHover={{ y: -5, boxShadow: "0 8px 30px rgba(243, 156, 18, 0.3)" }}
    >
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#3a3a3a]">
        <h3 className="text-lg font-bold text-[#f39c12] m-0">Order #{order._id.slice(-6)}</h3>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#aaa]">Buyer:</span>
          <span className="text-[15px] text-white font-semibold">
            {order.buyerDetails?.firstName} {order.buyerDetails?.lastName}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#aaa]">Phone:</span>
          <span className="text-[15px] text-white font-semibold">{order.buyerDetails?.phone}</span>
        </div>
        
        <div className="mt-2.5 mb-1.5">
          <span className="text-sm text-[#aaa]">Materials:</span>
        </div>
        {Object.entries(order.materials || {}).map(([material, details]) => (
          <div key={material} className="flex justify-between items-center pl-2.5 border-l-2 border-[#3a3a3a]">
            <span className="text-[15px] text-white font-semibold capitalize">
              {material}
            </span>
            <span className="text-[15px] text-white font-semibold">
              {details.quantity} x ₹{details.price}
            </span>
          </div>
        ))}

        <div className="flex justify-between items-center pt-3 border-t border-[#3a3a3a] mt-2">
          <span className="text-sm text-[#aaa]">Total Amount:</span>
          <span className="text-lg text-[#f39c12] font-bold">₹{order.totalAmount}</span>
        </div>
      </div>

      <div className="flex gap-3">
        {activeTab === "pending" && (
          <>
            <motion.button
              onClick={() => onUpdateStatus(order._id, 'cancelled')}
              className="flex-1 p-3 bg-[#e74c3c] text-white border-none rounded-lg text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#c0392b]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={16} />
              Reject
            </motion.button>
            <motion.button
              onClick={() => onUpdateStatus(order._id, 'approved')}
              className="flex-1 p-3 bg-[#2ecc71] text-white border-none rounded-lg text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#27ae60]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle size={16} />
              Approve
            </motion.button>
          </>
        )}

        {activeTab === "active" && (
          <>
            {order.status === "approved" && (
              <motion.button
                onClick={() => onUpdateStatus(order._id, 'shipping')}
                className="flex-1 p-3 bg-[#3498db] text-white border-none rounded-lg text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#2980b9]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Truck size={16} />
                Mark Shipped
              </motion.button>
            )}
            {order.status === "shipping" && (
              <motion.button
                onClick={() => onUpdateStatus(order._id, 'delivered')}
                className="flex-1 p-3 bg-[#2ecc71] text-white border-none rounded-lg text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#27ae60]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle size={16} />
                Mark Delivered
              </motion.button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
