import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MySites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSite, setEditingSite] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAddingNewSite, setIsAddingNewSite] = useState(false);
  const [newSiteForm, setNewSiteForm] = useState({
    name: "",
    phone: "",
    isActive: true,
    materials: { bricks: 0, cement: 0, steel: 0, wood: 0 },
    location: { type: "Point", coordinates: [0, 0] },
  });
  
  const [customMaterials, setCustomMaterials] = useState([]);
  const [editCustomMaterials, setEditCustomMaterials] = useState([]);
  
  // Feedback messages
  const [addFeedback, setAddFeedback] = useState("");
  const [editFeedback, setEditFeedback] = useState("");

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
    setEditFeedback("");
    
    const defaultMats = { bricks: 0, cement: 0, steel: 0, wood: 0 };
    const customMats = [];
    
    Object.entries(site.materials).forEach(([key, value]) => {
      if (key in defaultMats) {
        defaultMats[key] = value;
      } else {
        customMats.push({ name: key, quantity: value });
      }
    });
    
    setEditForm({
      name: site.name,
      phone: site.phone,
      isActive: site.isActive,
      materials: defaultMats,
      location: { ...site.location },
    });
    
    setEditCustomMaterials(customMats);
  };

  const handleSave = async (siteId) => {
    setEditFeedback("");
    
    const allMaterials = { ...editForm.materials };
    editCustomMaterials.forEach(mat => {
      if (mat.name.trim()) {
        allMaterials[mat.name.toLowerCase().replace(/\s+/g, '_')] = mat.quantity;
      }
    });
    
    try {
      const response = await fetch("https://api.regain.pp.ua/updateMySite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: siteId,
          name: editForm.name,
          phone: editForm.phone,
          isActive: editForm.isActive,
          materials: allMaterials,
          location: editForm.location,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setSites(sites.map((site) => site._id === siteId ? result.data : site));
        setEditFeedback("success");
        setTimeout(() => {
          setEditingSite(null);
          setEditCustomMaterials([]);
          setEditFeedback("");
        }, 1500);
      } else {
        setEditFeedback("error");
      }
    } catch (error) {
      console.error("Failed to update site:", error);
      setEditFeedback("error");
    }
  };

  const handleAddNewSite = async () => {
    setAddFeedback("");
    
    const allMaterials = { ...newSiteForm.materials };
    customMaterials.forEach(mat => {
      if (mat.name.trim()) {
        allMaterials[mat.name.toLowerCase().replace(/\s+/g, '_')] = mat.quantity;
      }
    });
    
    try {
      const response = await fetch("https://api.regain.pp.ua/registerSite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newSiteForm.name,
          phone: newSiteForm.phone,
          isActive: newSiteForm.isActive,
          materials: allMaterials,
          location: newSiteForm.location,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setSites([...sites, result.data]);
        setAddFeedback("success");
        setTimeout(() => {
          setIsAddingNewSite(false);
          setNewSiteForm({
            name: "",
            phone: "",
            isActive: true,
            materials: { bricks: 0, cement: 0, steel: 0, wood: 0 },
            location: { type: "Point", coordinates: [0, 0] },
          });
          setCustomMaterials([]);
          setAddFeedback("");
        }, 1500);
      } else {
        setAddFeedback("error");
      }
    } catch (error) {
      console.error("Failed to add site:", error);
      setAddFeedback("error");
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
        },
        (error) => console.error("Location error:", error)
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] p-16 px-5">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#3a3a3a] border-t-[#f39c12] rounded-full animate-spin"></div>
          <p className="text-[#f39c12] mt-5">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] py-16 px-5">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[clamp(32px,5vw,48px)] font-extrabold text-[#f39c12] text-center mb-3">
          🏗️ My Construction Sites
        </h1>
        <p className="text-base text-[#aaa] text-center mb-8">
          Manage your sites and materials inventory
        </p>

        {/* Add New Site Button */}
        <div className="flex justify-center mb-8">
          <motion.button
            onClick={() => setIsAddingNewSite(true)}
            className="py-3 px-6 text-base font-semibold text-white bg-[#f39c12] border-none rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#e67e22]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ➕ Add New Site
          </motion.button>
        </div>

        {/* Add New Site Modal */}
        <AnimatePresence>
          {isAddingNewSite && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" 
              onClick={() => setIsAddingNewSite(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-8 rounded-2xl border-2 border-[#f39c12] max-w-md w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
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

                <button
                  onClick={handleGetLocation}
                  className="w-full p-3 mb-2 bg-[#3498db] text-white rounded-lg font-semibold hover:bg-[#2980b9] transition-all"
                >
                  📍 Get Current Location
                </button>
                {newSiteForm.location.coordinates[0] !== 0 && (
                  <p className="text-xs text-[#2ecc71] mb-4">
                    ✓ Location: {newSiteForm.location.coordinates[0].toFixed(4)}, {newSiteForm.location.coordinates[1].toFixed(4)}
                  </p>
                )}

                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-base text-[#f1c40f] font-semibold">📦 Materials</h4>
                  <button
                    onClick={() => setCustomMaterials([...customMaterials, { name: "", quantity: 0 }])}
                    className="text-[#f39c12] text-2xl font-bold hover:text-[#e67e22]"
                  >
                    +
                  </button>
                </div>

                {Object.entries(newSiteForm.materials).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center mb-3 p-2 bg-[#1a1a1a] rounded-md">
                    <span className="text-[#f1c40f] capitalize">{key}:</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setNewSiteForm({ ...newSiteForm, materials: { ...newSiteForm.materials, [key]: parseInt(e.target.value) || 0 }})}
                      className="w-20 p-2 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm text-center outline-none focus:border-[#f39c12]"
                    />
                  </div>
                ))}

                {customMaterials.map((material, index) => (
                  <div key={index} className="flex gap-2 items-center mb-3 p-2 bg-[#1a1a1a] rounded-md">
                    <input
                      type="text"
                      value={material.name}
                      onChange={(e) => {
                        const updated = [...customMaterials];
                        updated[index].name = e.target.value;
                        setCustomMaterials(updated);
                      }}
                      placeholder="Material name"
                      className="flex-1 p-2 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm outline-none focus:border-[#f39c12]"
                    />
                    <input
                      type="number"
                      value={material.quantity}
                      onChange={(e) => {
                        const updated = [...customMaterials];
                        updated[index].quantity = parseInt(e.target.value) || 0;
                        setCustomMaterials(updated);
                      }}
                      placeholder="Qty"
                      className="w-20 p-2 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm text-center outline-none focus:border-[#f39c12]"
                    />
                    <button
                      onClick={() => setCustomMaterials(customMaterials.filter((_, i) => i !== index))}
                      className="text-[#e74c3c] text-xl font-bold hover:text-[#c0392b] px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {addFeedback === "success" && <p className="text-sm text-[#2ecc71] mb-3">✓ Site added successfully!</p>}
                {addFeedback === "error" && <p className="text-sm text-[#e74c3c] mb-3">✗ Please enter valid data</p>}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddNewSite}
                    className="flex-1 p-3 bg-[#2ecc71] text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#27ae60]"
                  >
                    Create Site
                  </button>
                  <button
                    onClick={() => { setIsAddingNewSite(false); setCustomMaterials([]); setAddFeedback(""); }}
                    className="flex-1 p-3 bg-[#e74c3c] text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#c0392b]"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {sites.length === 0 ? (
          <motion.div 
            className="text-center p-20 bg-[#242424] rounded-3xl border-2 border-dashed border-[#3a3a3a]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-8xl mb-6">📦</div>
            <h2 className="text-3xl text-[#f39c12] mb-4">No Sites Yet</h2>
            <p className="text-base text-[#aaa] leading-relaxed mb-8">
              You haven't registered any construction sites yet.<br />Start by adding your first site!
            </p>
            <motion.button 
              onClick={() => setIsAddingNewSite(true)} 
              className="py-4 px-8 text-base font-semibold text-white bg-[#f39c12] border-none rounded-lg cursor-pointer hover:bg-[#e67e22]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ➕ Add Your First Site
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {sites.map((site) => (
              <motion.div 
                key={site._id} 
                className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-8 rounded-2xl border-2 border-[#3a3a3a] hover:border-[#f39c12]"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {editingSite === site._id ? (
                  <div>
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full p-3 mb-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm outline-none focus:border-[#f39c12]" placeholder="Site Name" />
                    <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full p-3 mb-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm outline-none focus:border-[#f39c12]" placeholder="Phone" />

                    <div className="mb-5 p-3 bg-[#1a1a1a] rounded-lg">
                      <label className="text-[#aaa] text-sm cursor-pointer flex items-center">
                        <input type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} className="mr-2 w-4 h-4 cursor-pointer" />
                        Active Site
                      </label>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-base text-[#f1c40f] font-semibold">📦 Materials</h4>
                      <button onClick={() => setEditCustomMaterials([...editCustomMaterials, { name: "", quantity: 0 }])} className="text-[#f39c12] text-2xl font-bold hover:text-[#e67e22]">+</button>
                    </div>

                    {Object.entries(editForm.materials).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center mb-3 p-2 bg-[#1a1a1a] rounded-md">
                        <span className="text-[#f1c40f] capitalize">{key.replace("_", " ")}:</span>
                        <input type="number" value={value} onChange={(e) => setEditForm({ ...editForm, materials: { ...editForm.materials, [key]: parseInt(e.target.value) || 0 }})} className="w-20 p-2 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm text-center outline-none focus:border-[#f39c12]" />
                      </div>
                    ))}

                    {editCustomMaterials.map((material, index) => (
                      <div key={index} className="flex gap-2 items-center mb-3 p-2 bg-[#1a1a1a] rounded-md">
                        <input type="text" value={material.name} onChange={(e) => { const updated = [...editCustomMaterials]; updated[index].name = e.target.value; setEditCustomMaterials(updated); }} placeholder="Material name" className="flex-1 p-2 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm outline-none focus:border-[#f39c12]" />
                        <input type="number" value={material.quantity} onChange={(e) => { const updated = [...editCustomMaterials]; updated[index].quantity = parseInt(e.target.value) || 0; setEditCustomMaterials(updated); }} placeholder="Qty" className="w-20 p-2 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm text-center outline-none focus:border-[#f39c12]" />
                        <button onClick={() => setEditCustomMaterials(editCustomMaterials.filter((_, i) => i !== index))} className="text-[#e74c3c] text-xl font-bold hover:text-[#c0392b] px-2">×</button>
                      </div>
                    ))}

                    {editFeedback === "success" && <p className="text-sm text-[#2ecc71] mb-3">✓ Updated successfully!</p>}
                    {editFeedback === "error" && <p className="text-sm text-[#e74c3c] mb-3">✗ Please enter valid data</p>}

                    <div className="flex gap-3 mt-5">
                      <button onClick={() => handleSave(site._id)} className="flex-1 p-3 bg-[#2ecc71] text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#27ae60]">Save</button>
                      <button onClick={() => { setEditingSite(null); setEditForm({}); setEditCustomMaterials([]); setEditFeedback(""); }} className="flex-1 p-3 bg-[#e74c3c] text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#c0392b]">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-2xl font-bold text-[#f39c12] m-0">{site.name}</h3>
                      <span className={`text-xs py-1 px-3 rounded-xl ${site.isActive ? "bg-[rgba(46,204,113,0.2)] text-[#2ecc71]" : "bg-[rgba(231,76,60,0.2)] text-[#e74c3c]"}`}>
                        {site.isActive ? "🟢 Active" : "🔴 Inactive"}
                      </span>
                    </div>
                    <div className="flex justify-between mb-3 text-sm">
                      <span className="text-[#aaa]">📍 Location:</span>
                      <span className="text-white font-medium">{site.location.coordinates[0]}, {site.location.coordinates[1]}</span>
                    </div>
                    <div className="flex justify-between mb-3 text-sm">
                      <span className="text-[#aaa]">📞 Phone:</span>
                      <span className="text-white font-medium">{site.phone}</span>
                    </div>
                    <div className="h-px bg-[#3a3a3a] my-5"></div>
                    <h4 className="text-base text-[#f1c40f] mb-4 font-semibold">📦 Available Materials</h4>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 mb-6">
                      {Object.entries(site.materials).map(([key, value]) => (
                        <div key={key} className="bg-[#1a1a1a] p-3 rounded-lg flex flex-col gap-1.5 text-sm text-[#ccc] border border-[#3a3a3a]">
                          <span className="capitalize">{key.replace("_", " ")}</span>
                          <strong className="text-[#f39c12]">{value}</strong>
                        </div>
                      ))}
                    </div>
                    <motion.button 
                      onClick={() => handleEdit(site)} 
                      className="w-full p-3 bg-[#f39c12] text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#e67e22]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ✏️ Edit Details
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
