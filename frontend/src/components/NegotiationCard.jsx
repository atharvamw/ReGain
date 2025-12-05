import { motion } from "framer-motion";
import { XCircle, CheckCircle } from "lucide-react";

export default function NegotiationCard({ neg, onAccept, onReject }) {
  return (
    <motion.div
      className="bg-[#242424] border border-[#3a3a3a] rounded-xl p-6 transition-all duration-300 hover:border-[#f39c12]"
      whileHover={{ y: -5, boxShadow: "0 8px 30px rgba(243, 156, 18, 0.3)" }}
    >
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#3a3a3a]">
        <h3 className="text-lg font-bold text-[#f39c12] m-0">{neg.id}</h3>
        <span className="text-[13px] text-[#888]">{neg.date}</span>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#aaa]">Material:</span>
          <span className="text-[15px] text-white font-semibold">{neg.material}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#aaa]">Quantity:</span>
          <span className="text-[15px] text-white font-semibold">
            {neg.quantity} {neg.unit}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#aaa]">Buyer:</span>
          <span className="text-[15px] text-white font-semibold">{neg.buyer}</span>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 bg-[#1a1a1a] rounded-lg mb-5">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-[#888] uppercase">Your Price</span>
          <span className="text-xl text-[#ccc] font-bold">₹{neg.listedPrice}</span>
        </div>
        <span className="text-2xl text-[#666]">→</span>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-[#888] uppercase">Offer</span>
          <span className="text-xl text-[#f39c12] font-bold">₹{neg.offeredPrice}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          onClick={() => onReject(neg.id)}
          className="flex-1 p-3 bg-[#e74c3c] text-white border-none rounded-lg text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#c0392b]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <XCircle size={16} />
          Reject
        </motion.button>
        <motion.button
          onClick={() => onAccept(neg.id)}
          className="flex-1 p-3 bg-[#2ecc71] text-white border-none rounded-lg text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#27ae60]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CheckCircle size={16} />
          Accept
        </motion.button>
      </div>
    </motion.div>
  );
}
