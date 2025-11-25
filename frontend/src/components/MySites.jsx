import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Package, CheckCircle, XCircle, IndianRupee, PackageSearch, MapPin } from "lucide-react";

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
    materials: {},
    location: { type: "Point", coordinates: [0, 0] },
  });
  
  const [customMaterials, setCustomMaterials] = useState([]);
  const [editCustomMaterials, setEditCustomMaterials] = useState([]);
  
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
    
    const materials = [];
    Object.entries(site.materials || {}).forEach(([key, value]) => {
      materials.push({ 
        name: key, 
        stock: value.stock || 0, 
        price: value.price || 0 
      });
    });
    
    setEditForm({
      name: site.name,
      phone: site.phone,
      isActive: site.isActive,
      location: { ...site.location },
    });
    
    setEditCustomMaterials(materials);
  };

  const handleSave = async (siteId) => {
    setEditFeedback("");
    
    const materialsMap = {};
    editCustomMaterials.forEach(mat => {
      if (mat.name.trim()) {
        const key = mat.name.toLowerCase().replace(/\s+/g, '_');
        materialsMap[key] = {
          stock: mat.stock || 0,
          price: mat.price || 0
        };
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
          materials: materialsMap,
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
    
    // Client-side validation
    if (!newSiteForm.name || newSiteForm.name.trim().length < 6) {
      setAddFeedback("error");
      alert("Site name must be at least 6 characters long!");
      return;
    }
    
    if (!newSiteForm.phone || newSiteForm.phone.trim().length === 0) {
      setAddFeedback("error");
      alert("Please enter a phone number!");
      return;
    }
    
    if (newSiteForm.location.coordinates[0] === 0 && newSiteForm.location.coordinates[1] === 0) {
      setAddFeedback("error");
      alert("Please set your location by clicking 'Get Current Location' button!");
      return;
    }
    
    if (customMaterials.length === 0) {
      setAddFeedback("error");
      alert("Please add at least one material!");
      return;
    }
    
    const materialsMap = {};
    customMaterials.forEach(mat => {
      if (mat.name.trim()) {
        const key = mat.name.toLowerCase().replace(/\s+/g, '_');
        materialsMap[key] = {
          stock: mat.stock || 0,
          price: mat.price || 0
        };
      }
    });
    
    const payload = {
      name: newSiteForm.name,
      phone: newSiteForm.phone,
      isActive: newSiteForm.isActive,
      materials: materialsMap,
      location: newSiteForm.location,
    };
    
    console.log("Sending payload:", JSON.stringify(payload, null, 2));
    
    try {
      const response = await fetch("https://api.regain.pp.ua/addMySite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Backend response:", result);

      if (result.status === "success") {
        setSites([...sites, result.data]);
        setAddFeedback("success");
        setTimeout(() => {
          setIsAddingNewSite(false);
          setNewSiteForm({
            name: "",
            phone: "",
            isActive: true,
            materials: {},
            location: { type: "Point", coordinates: [0, 0] },
          });
          setCustomMaterials([]);
          setAddFeedback("");
        }, 1500);
      } else {
        setAddFeedback("error");
        // Show the actual backend error message
        alert(`Backend Error: ${result.message || "Registration failed"}\n\nDetails: ${JSON.stringify(result, null, 2)}`);
        console.error("Backend validation failed:", result);
      }
    } catch (error) {
      console.error("Failed to add site:", error);
      setAddFeedback("error");
      alert(`Network error: ${error.message}`);
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
    <div className="min-h-screen bg-[#1a1a1a] pt-20 pb-10 px-4">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#f39c12] flex items-center gap-3">
            <Package size={36} />
            My Construction Sites
          </h1>
          <motion.button
            onClick={() => setIsAddingNewSite(true)}
            className="py-3 px-6 text-base font-semibold text-white bg-[#f39c12] border-none rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#e67e22] flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Add New Site
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
                className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-8 rounded-2xl border-2 border-[#f39c12] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#f39c12] flex items-center gap-2">
                    <Plus size={24} />
                    Add New Site
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <input
                    type="text"
                    value={newSiteForm.name}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, name: e.target.value })}
                    className="w-full p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm outline-none focus:border-[#f39c12]"
                    placeholder="Site Name (min 6 characters)"
                  />

                  <input
                    type="text"
                    value={newSiteForm.phone}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, phone: e.target.value })}
                    className="w-full p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white text-sm outline-none focus:border-[#f39c12]"
                    placeholder="Phone Number"
                  />
                </div>

                <button
                  onClick={handleGetLocation}
                  className="w-full p-3 mb-4 bg-[#3498db] text-white rounded-lg font-semibold hover:bg-[#2980b9] transition-all flex items-center justify-center gap-2"
                >
                  <MapPin size={18} />
                  Get Current Location
                </button>
                {newSiteForm.location.coordinates[0] !== 0 && (
                  <p className="text-xs text-[#2ecc71] mb-4 flex items-center gap-2">
                    <CheckCircle size={14} />
                    Location: {newSiteForm.location.coordinates[0].toFixed(4)}, {newSiteForm.location.coordinates[1].toFixed(4)}
                  </p>
                )}

                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg text-[#f1c40f] font-semibold flex items-center gap-2">
                    <PackageSearch size={20} />
                    Materials & Pricing
                  </h4>
                  <button
                    onClick={() => setCustomMaterials([...customMaterials, { name: "", stock: 0, price: 0 }])}
                    className="text-[#f39c12] font-bold hover:text-[#e67e22] flex items-center gap-1 bg-[#1a1a1a] px-3 py-2 rounded-lg border border-[#3a3a3a] hover:border-[#f39c12] transition-all"
                  >
                    <Plus size={20} />
                    Add Material
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  {customMaterials.map((material, index) => (
                    <div key={index} className="bg-[#1a1a1a] p-4 rounded-lg border border-[#3a3a3a] hover:border-[#f39c12] transition-all">
                      <div className="grid grid-cols-12 gap-3 items-center">
                        <input
                          type="text"
                          value={material.name}
                          onChange={(e) => {
                            const updated = [...customMaterials];
                            updated[index].name = e.target.value;
                            setCustomMaterials(updated);
                          }}
                          placeholder="Material name (e.g., Cement, Bricks)"
                          className="col-span-5 p-2 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm outline-none focus:border-[#f39c12]"
                        />
                        <div className="col-span-3 relative">
                          <input
                            type="number"
                            value={material.stock}
                            onChange={(e) => {
                              const updated = [...customMaterials];
                              updated[index].stock = parseInt(e.target.value) || 0;
                              setCustomMaterials(updated);
                            }}
                            placeholder="Stock"
                            className="w-full p-2 pl-8 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm text-center outline-none focus:border-[#f39c12]"
                          />
                          <Package size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#888]" />
                        </div>
                        <div className="col-span-3 relative">
                          <input
                            type="number"
                            value={material.price}
                            onChange={(e) => {
                              const updated = [...customMaterials];
                              updated[index].price = parseInt(e.target.value) || 0;
                              setCustomMaterials(updated);
                            }}
                            placeholder="Price"
                            className="w-full p-2 pl-8 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm text-center outline-none focus:border-[#f39c12]"
                          />
                          <IndianRupee size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#888]" />
                        </div>
                        <button
                          onClick={() => setCustomMaterials(customMaterials.filter((_, i) => i !== index))}
                          className="col-span-1 text-[#e74c3c] text-xl font-bold hover:text-[#c0392b] p-2 bg-[rgba(231,76,60,0.1)] rounded hover:bg-[rgba(231,76,60,0.2)] transition-all"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {customMaterials.length === 0 && (
                  <div className="text-center p-8 bg-[#1a1a1a] rounded-lg border-2 border-dashed border-[#3a3a3a] mb-4">
                    <PackageSearch size={48} className="mx-auto mb-3 text-[#666]" />
                    <p className="text-[#888] text-sm">No materials added yet. Click "Add Material" to get started.</p>
                  </div>
                )}

                {addFeedback === "success" && (
                  <p className="text-sm text-[#2ecc71] mb-3 flex items-center gap-2">
                    <CheckCircle size={16} />
                    Site added successfully!
                  </p>
                )}
                {addFeedback === "error" && (
                  <p className="text-sm text-[#e74c3c] mb-3 flex items-center gap-2">
                    <XCircle size={16} />
                    Please enter valid data
                  </p>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddNewSite}
                    className="flex-1 p-3 bg-[#2ecc71] text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#27ae60] flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Create Site
                  </button>
                  <button
                    onClick={() => { setIsAddingNewSite(false); setCustomMaterials([]); setAddFeedback(""); }}
                    className="flex-1 p-3 bg-[#e74c3c] text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#c0392b] flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
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
            <Package size={80} className="mx-auto mb-6 text-[#3a3a3a]" />
            <h2 className="text-3xl text-[#f39c12] mb-4">No Sites Yet</h2>
            <p className="text-base text-[#aaa] leading-relaxed mb-8">
              You haven't registered any construction sites yet.<br />Start by adding your first site!
            </p>
            <motion.button 
              onClick={() => setIsAddingNewSite(true)} 
              className="py-4 px-8 text-base font-semibold text-white bg-[#f39c12] border-none rounded-lg cursor-pointer hover:bg-[#e67e22] flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Add Your First Site
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
                      <h4 className="text-base text-[#f1c40f] font-semibold flex items-center gap-2">
                        <PackageSearch size={18} />
                        Materials
                      </h4>
                      <button onClick={() => setEditCustomMaterials([...editCustomMaterials, { name: "", stock: 0, price: 0 }])} className="text-[#f39c12] font-bold hover:text-[#e67e22] flex items-center gap-1 bg-[#242424] px-2 py-1 rounded border border-[#3a3a3a]">
                        <Plus size={18} />
                      </button>
                    </div>

                    <div className="space-y-3 mb-4">
                      {editCustomMaterials.map((material, index) => (
                        <div key={index} className="bg-[#1a1a1a] p-3 rounded-lg border border-[#3a3a3a]">
                          <div className="grid grid-cols-12 gap-2 items-center">
                            <input type="text" value={material.name} onChange={(e) => { const updated = [...editCustomMaterials]; updated[index].name = e.target.value; setEditCustomMaterials(updated); }} placeholder="Material" className="col-span-5 p-2 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm outline-none focus:border-[#f39c12]" />
                            <input type="number" value={material.stock} onChange={(e) => { const updated = [...editCustomMaterials]; updated[index].stock = parseInt(e.target.value) || 0; setEditCustomMaterials(updated); }} placeholder="Stock" className="col-span-3 p-2 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm text-center outline-none focus:border-[#f39c12]" />
                            <input type="number" value={material.price} onChange={(e) => { const updated = [...editCustomMaterials]; updated[index].price = parseInt(e.target.value) || 0; setEditCustomMaterials(updated); }} placeholder="Price" className="col-span-3 p-2 bg-[#242424] border border-[#3a3a3a] rounded text-white text-sm text-center outline-none focus:border-[#f39c12]" />
                            <button onClick={() => setEditCustomMaterials(editCustomMaterials.filter((_, i) => i !== index))} className="col-span-1 text-[#e74c3c] hover:text-[#c0392b]"><XCircle size={18} /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {editFeedback === "success" && <p className="text-sm text-[#2ecc71] mb-3 flex items-center gap-2"><CheckCircle size={16} />Updated successfully!</p>}
                    {editFeedback === "error" && <p className="text-sm text-[#e74c3c] mb-3 flex items-center gap-2"><XCircle size={16} />Please enter valid data</p>}

                    <div className="flex gap-3 mt-5">
                      <button onClick={() => handleSave(site._id)} className="flex-1 p-3 bg-[#2ecc71] text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#27ae60] flex items-center justify-center gap-2">
                        <CheckCircle size={18} />
                        Save
                      </button>
                      <button onClick={() => { setEditingSite(null); setEditForm({}); setEditCustomMaterials([]); setEditFeedback(""); }} className="flex-1 p-3 bg-[#e74c3c] text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#c0392b] flex items-center justify-center gap-2">
                        <XCircle size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-2xl font-bold text-[#f39c12] m-0">{site.name}</h3>
                      <span className={`text-xs py-1 px-3 rounded-xl flex items-center gap-1 ${site.isActive ? "bg-[rgba(46,204,113,0.2)] text-[#2ecc71]" : "bg-[rgba(231,76,60,0.2)] text-[#e74c3c]"}`}>
                        {site.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {site.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex justify-between mb-3 text-sm">
                      <span className="text-[#aaa]">Phone:</span>
                      <span className="text-white font-medium">{site.phone}</span>
                    </div>
                    <div className="h-px bg-[#3a3a3a] my-5"></div>
                    <h4 className="text-base text-[#f1c40f] mb-4 font-semibold flex items-center gap-2">
                      <PackageSearch size={18} />
                      Available Materials
                    </h4>
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      {Object.entries(site.materials || {}).map(([key, value]) => (
                        <div key={key} className="bg-[#1a1a1a] p-3 rounded-lg flex justify-between items-center border border-[#3a3a3a]">
                          <span className="capitalize text-[#ccc] font-medium">{key.replace("_", " ")}</span>
                          <div className="flex gap-3 items-center">
                            <span className="text-sm text-[#888] flex items-center gap-1">
                              <Package size={14} />
                              {value.stock}
                            </span>
                            <span className="text-sm text-[#f39c12] font-bold flex items-center gap-1">
                              <IndianRupee size={14} />
                              {value.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <motion.button 
                      onClick={() => handleEdit(site)} 
                      className="w-full p-3 bg-[#f39c12] text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#e67e22] flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Edit size={18} />
                      Edit Details
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
