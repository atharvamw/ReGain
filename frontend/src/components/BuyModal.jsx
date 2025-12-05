import { motion, AnimatePresence } from "framer-motion";

export default function BuyModal({ site, onClose, onSubmit }) {
  if (!site) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[2000]">
      <motion.div
        className="bg-[#242424] p-8 rounded-2xl w-[90%] max-w-[500px] border border-[#3a3a3a] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 className="text-[#f39c12] text-2xl mb-2 font-bold">Place Order</h2>
        <p className="text-[#aaa] mb-6">Ordering from {site.name}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const quantities = {};
            Object.keys(site.materials || {}).forEach((material) => {
              quantities[material] = formData.get(material);
            });
            onSubmit(quantities);
          }}
        >
          <div className="flex flex-col gap-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {Object.entries(site.materials || {}).map(([material, details]) => (
              <div
                key={material}
                className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="text-white font-semibold capitalize">
                    {material}
                  </span>
                  <span className="text-[#f39c12] text-xs">
                    ₹{typeof details === "object" ? details.price : "N/A"}
                  </span>
                </div>
                <input
                  type="number"
                  name={material}
                  min="0"
                  placeholder="Qty"
                  className="w-20 p-2 rounded-md border border-[#3a3a3a] bg-[#242424] text-white outline-none focus:border-[#f39c12]"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-transparent text-[#aaa] border border-[#3a3a3a] rounded-lg cursor-pointer hover:bg-[#3a3a3a] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#f39c12] text-[#1a1a1a] border-none rounded-lg font-semibold cursor-pointer hover:bg-[#e67e22] transition-colors"
            >
              Place Order
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
