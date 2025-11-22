import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function MySites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSite, setEditingSite] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch("https://api.regain.pp.ua/getMySites", {
        credentials: "include",
      });
      const result = await response.json();
      if (result.status === "success") {
        setSites(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch sites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (site) => {
    setEditingSite(site._id);
    setEditForm({
      name: site.name,
      phone: site.phone,
      isActive: site.isActive,
      materials: { ...site.materials },
    });
  };

  const handleSave = (siteId) => {
    console.log("Saving site:", siteId, editForm);
    setSites(
      sites.map((site) =>
        site._id === siteId ? { ...site, ...editForm } : site
      )
    );
    setEditingSite(null);
  };

  const handleCancel = () => {
    setEditingSite(null);
    setEditForm({});
  };

  const handleMaterialChange = (key, value) => {
    setEditForm({
      ...editForm,
      materials: {
        ...editForm.materials,
        [key]: parseInt(value) || 0,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] p-16 px-5">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#3a3a3a] border-t-[#f39c12] rounded-full animate-spin"></div>
          <p className="text-[#f39c12] mt-5">Loading your sites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] py-16 px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-[clamp(32px,5vw,48px)] font-extrabold text-[#f39c12] text-center mb-3">
          🏗️ My Construction Sites
        </h1>
        <p className="text-base text-[#aaa] text-center mb-16">
          Manage your sites and materials inventory
        </p>

        {sites.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center p-20 bg-[#242424] rounded-3xl border-2 border-dashed border-[#3a3a3a]"
          >
            <div className="text-8xl mb-6">📦</div>
            <h2 className="text-3xl text-[#f39c12] mb-4">No Sites Yet</h2>
            <p className="text-base text-[#aaa] leading-relaxed mb-8">
              You haven't registered any construction sites yet.
              <br />
              Start by adding your first site to begin selling materials!
            </p>
            <button className="py-4 px-8 text-base font-semibold text-white bg-[#f39c12] border-none rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#e67e22]">
              ➕ Add Your First Site
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
            {sites.map((site, index) => (
              <motion.div
                key={site._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-8 rounded-2xl border-2 border-[#3a3a3a] transition-all duration-300 hover:border-[#f39c12]"
              >
                {editingSite === site._id ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full p-3 mb-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm outline-none focus:border-[#f39c12]"
                      placeholder="Site Name"
                    />
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full p-3 mb-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm outline-none focus:border-[#f39c12]"
                      placeholder="Phone Number"
                    />

                    <div className="mb-5 p-3 bg-[#1a1a1a] rounded-lg">
                      <label className="text-[#aaa] text-sm cursor-pointer flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.isActive}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              isActive: e.target.checked,
                            })
                          }
                          className="mr-2 w-4 h-4 cursor-pointer"
                        />
                        Active Site
                      </label>
                    </div>

                    <h4 className="text-base text-[#f1c40f] mb-4 font-semibold">
                      📦 Materials
                    </h4>
                    {Object.entries(editForm.materials).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center mb-3 p-2 bg-[#1a1a1a] rounded-md"
                      >
                        <span className="text-[#f1c40f] capitalize">
                          {key.replace("_", " ")}:
                        </span>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) =>
                            handleMaterialChange(key, e.target.value)
                          }
                          className="w-20 p-2 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm text-center outline-none focus:border-[#f39c12]"
                        />
                      </div>
                    ))}

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => handleSave(site._id)}
                        className="flex-1 p-3 bg-[#2ecc71] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-[#27ae60]"
                      >
                        ✅ Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 p-3 bg-[#e74c3c] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-[#c0392b]"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-2xl font-bold text-[#f39c12] m-0">
                        {site.name}
                      </h3>
                      <span
                        className={`text-xs py-1 px-3 rounded-xl ${
                          site.isActive
                            ? "bg-[rgba(46,204,113,0.2)] text-[#2ecc71]"
                            : "bg-[rgba(231,76,60,0.2)] text-[#e74c3c]"
                        }`}
                      >
                        {site.isActive ? "🟢 Active" : "🔴 Inactive"}
                      </span>
                    </div>

                    <div className="flex justify-between mb-3 text-sm">
                      <span className="text-[#aaa]">📍 Location:</span>
                      <span className="text-white font-medium">
                        {site.location.coordinates[0]},{" "}
                        {site.location.coordinates[1]}
                      </span>
                    </div>

                    <div className="flex justify-between mb-3 text-sm">
                      <span className="text-[#aaa]">📞 Phone:</span>
                      <span className="text-white font-medium">
                        {site.phone}
                      </span>
                    </div>

                    <div className="h-px bg-[#3a3a3a] my-5"></div>

                    <h4 className="text-base text-[#f1c40f] mb-4 font-semibold">
                      📦 Available Materials
                    </h4>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 mb-6">
                      {Object.entries(site.materials).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-[#1a1a1a] p-3 rounded-lg flex flex-col gap-1.5 text-sm text-[#ccc] border border-[#3a3a3a]"
                        >
                          <span className="capitalize">
                            {key.replace("_", " ")}
                          </span>
                          <strong className="text-[#f39c12]">{value}</strong>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleEdit(site)}
                      className="w-full p-3 bg-[#f39c12] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-[#e67e22]"
                    >
                      ✏️ Edit Details
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
