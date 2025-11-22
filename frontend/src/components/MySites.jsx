import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function MySites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSite, setEditingSite] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [notification, setNotification] = useState(null);
  const [isAddingNewSite, setIsAddingNewSite] = useState(false);
  const [newSiteForm, setNewSiteForm] = useState({
    name: "",
    phone: "",
    isActive: true,
    materials: { bricks: 0, cement: 0, steel: 0, wood: 0 },
    location: { type: "Point", coordinates: [0, 0] },
  });
  const shouldReduceMotion = useReducedMotion();

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

  const handleEdit = useCallback((site) => {
    setEditingSite(site._id);
    setEditForm({
      name: site.name,
      phone: site.phone,
      isActive: site.isActive,
      materials: { ...site.materials },
      location: { ...site.location },
    });
  }, []);

  const handleSave = async (siteId) => {
    const originalSite = sites.find(s => s._id === siteId);
    
    try {
      const response = await fetch("https://api.regain.pp.ua/updateMySite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: siteId,
          name: editForm.name,
          phone: editForm.phone,
          isActive: editForm.isActive,
          materials: editForm.materials,
          location: editForm.location,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setSites(
          sites.map((site) =>
            site._id === siteId ? result.data : site
          )
        );
        setEditingSite(null);
        showNotification("✅ Site updated successfully!", "success");
      } else {
        // Revert to original data on failure
        setEditForm({
          name: originalSite.name,
          phone: originalSite.phone,
          isActive: originalSite.isActive,
          materials: { ...originalSite.materials },
          location: { ...originalSite.location },
        });
        showNotification(
          `⚠️ ${result.message || "Failed to update site"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Failed to update site:", error);
      // Revert to original data on error
      setEditForm({
        name: originalSite.name,
        phone: originalSite.phone,
        isActive: originalSite.isActive,
        materials: { ...originalSite.materials },
        location: { ...originalSite.location },
      });
      showNotification("❌ Network error. Please try again.", "error");
    }
  };

  const handleAddNewSite = async () => {
    try {
      const response = await fetch("https://api.regain.pp.ua/registerSite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: newSiteForm.name,
          phone: newSiteForm.phone,
          isActive: newSiteForm.isActive,
          materials: newSiteForm.materials,
          location: newSiteForm.location,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setSites([...sites, result.data]);
        setIsAddingNewSite(false);
        setNewSiteForm({
          name: "",
          phone: "",
          isActive: true,
          materials: { bricks: 0, cement: 0, steel: 0, wood: 0 },
          location: { type: "Point", coordinates: [0, 0] },
        });
        showNotification("✅ New site added successfully!", "success");
      } else {
        showNotification(
          `⚠️ ${result.message || "Failed to add site"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Failed to add site:", error);
      showNotification("❌ Network error. Please try again.", "error");
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewSiteForm({
            ...newSiteForm,
            location: {
              type: "Point",
              coordinates: [position.coords.latitude, position.coords.longitude],
            },
          });
          showNotification("📍 Location captured!", "success");
        },
        (error) => {
          showNotification("❌ Failed to get location", "error");
        }
      );
    }
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

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
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
    <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] py-16 px-5 relative">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-0 left-1/2 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-[#2ecc71] text-white"
                : "bg-[#e74c3c] text-white"
            }`}
          >
            <span className="text-lg font-semibold">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-[clamp(32px,5vw,48px)] font-extrabold text-[#f39c12] text-center mb-3">
          🏗️ My Construction Sites
        </h1>
        <p className="text-base text-[#aaa] text-center mb-8">
          Manage your sites and materials inventory
        </p>

        {/* Add New Site Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsAddingNewSite(true)}
            className="py-3 px-6 text-base font-semibold text-white bg-[#f39c12] border-none rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#e67e22] flex items-center gap-2"
          >
            ➕ Add New Site
          </button>
        </div>

        {/* Add New Site Modal */}
        <AnimatePresence>
          {isAddingNewSite && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
              onClick={() => setIsAddingNewSite(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-8 rounded-2xl border-2 border-[#f39c12] max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-bold text-[#f39c12] mb-6">🏗️ Add New Site</h2>

                <input
                  type="text"
                  value={newSiteForm.name}
                  onChange={(e) => setNewSiteForm({ ...newSiteForm, name: e.target.value })}
                  className="w-full p-3 mb-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm outline-none focus:border-[#f39c12]"
                  placeholder="Site Name (min 6 characters)"
                />

                <input
                  type="text"
                  value={newSiteForm.phone}
                  onChange={(e) => setNewSiteForm({ ...newSiteForm, phone: e.target.value })}
                  className="w-full p-3 mb-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm outline-none focus:border-[#f39c12]"
                  placeholder="Phone Number"
                />

                <div className="mb-4">
                  <button
                    onClick={handleGetLocation}
                    className="w-full p-3 bg-[#3498db] text-white rounded-lg font-semibold hover:bg-[#2980b9] transition-all"
                  >
                    📍 Get Current Location
                  </button>
                  {newSiteForm.location.coordinates[0] !== 0 && (
                    <p className="text-xs text-[#2ecc71] mt-2">
                      ✓ Location: {newSiteForm.location.coordinates[0].toFixed(4)}, {newSiteForm.location.coordinates[1].toFixed(4)}
                    </p>
                  )}
                </div>

                <h4 className="text-base text-[#f1c40f] mb-4 font-semibold">📦 Materials</h4>
                {Object.entries(newSiteForm.materials).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center mb-3 p-2 bg-[#1a1a1a] rounded-md">
                    <span className="text-[#f1c40f] capitalize">{key}:</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setNewSiteForm({
                          ...newSiteForm,
                          materials: {
                            ...newSiteForm.materials,
                            [key]: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-20 p-2 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm text-center outline-none focus:border-[#f39c12]"
                    />
                  </div>
                ))}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddNewSite}
                    className="flex-1 p-3 bg-[#2ecc71] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-[#27ae60]"
                  >
                    ✅ Create Site
                  </button>
                  <button
                    onClick={() => setIsAddingNewSite(false)}
                    className="flex-1 p-3 bg-[#e74c3c] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-[#c0392b]"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
            <button
              onClick={() => setIsAddingNewSite(true)}
              className="py-4 px-8 text-base font-semibold text-white bg-[#f39c12] border-none rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#e67e22]"
            >
              ➕ Add Your First Site
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
            {sites.map((site, index) => (
              <motion.div
                key={site._id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
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
