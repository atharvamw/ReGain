import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search as SearchIcon,
  MapPin,
  Package,
  IndianRupee,
  Phone,
  Loader,
  Map as MapIcon,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import BuyModal from "../components/BuyModal";

// Custom marker icons
const userIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div style="position: relative;">
      <div style="
        width: 20px;
        height: 20px;
        background-color: #3498db;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(52, 152, 219, 0.8);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
      "></div>
      <div style="
        width: 40px;
        height: 40px;
        background-color: rgba(52, 152, 219, 0.3);
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: pulse 2s ease-out infinite;
      "></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const siteIcon = L.icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f39c12" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(10);
  const [selectedSite, setSelectedSite] = useState(null);
  const [locationAttempted, setLocationAttempted] = useState(false);

  // Automatically get user location on component mount (only once)
  useEffect(() => {
    if (!locationAttempted) {
      getUserLocation(true);
    }
  }, []);

  const handleSearchQueryChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setSearched(false);
      setResults([]);
    }
  };

  const handleSearch = async (materialQuery = null) => {
    if (!userLocation) {
      alert("Please allow location access to search nearby sites");
      getUserLocation();
      return;
    }
    setLoading(true);
    setSearched(true);
    
    const queryToUse = materialQuery || searchQuery;
    
    try {
      const response = await fetch("https://api.regain.pp.ua/getNearestSites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          radius: radius,
          userCords: [userLocation.lat, userLocation.lng],
        }),
      });
      const result = await response.json();
      
      if (result.status === "success") {
        let filteredResults = result.data || [];
        if (queryToUse.trim()) {
          filteredResults = filteredResults.filter((site) =>
            Object.keys(site.materials || {}).some((material) =>
              material.toLowerCase().includes(queryToUse.toLowerCase())
            )
          );
        }
        setResults(filteredResults);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = (isAutoAttempt = false) => {
    if (navigator.geolocation) {
      setLocationAttempted(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location error:", error);
          // Only show alert if user manually clicks the button (not auto-attempt)
          if (!isAutoAttempt) {
            if (error.code === error.PERMISSION_DENIED) {
              alert("Location access denied. Please enable location permissions in your browser settings.");
            } else {
              alert("Unable to get your location. Please try again.");
            }
          }
        }
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const submitOrder = async (quantities) => {
    if (!selectedSite) return;

    // Filter out materials with 0 quantity
    const materialsToOrder = {};
    let totalAmount = 0;
    let hasItems = false;

    Object.entries(quantities).forEach(([material, qty]) => {
      if (qty > 0) {
        const price = typeof selectedSite.materials[material] === 'object' 
          ? selectedSite.materials[material].price 
          : 0; // Fallback if price structure is different
        
        materialsToOrder[material] = {
          quantity: parseInt(qty),
          price: price
        };
        totalAmount += price * parseInt(qty);
        hasItems = true;
      }
    });

    if (!hasItems) {
      alert("Please enter a quantity for at least one material.");
      return;
    }

    try {
      const response = await fetch("https://api.regain.pp.ua/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          siteId: selectedSite._id,
          siteName: selectedSite.name,
          sellerEmail: selectedSite.email, // Assuming site object has email
          materials: materialsToOrder,
          totalAmount: totalAmount,
          shippingAddress: {
            coordinates: [userLocation.lat, userLocation.lng]
          }
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Order placed successfully!");
        setSelectedSite(null);
      } else {
        alert("Failed to place order: " + result.message);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("An error occurred while placing the order.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#1a1a1a] py-10 px-5">
      <motion.div
        className="max-w-[1400px] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 flex items-center justify-center">
            <SearchIcon
              size={48}
              className="mr-4 text-[#f39c12]"
            />
            Find Construction Materials
          </h1>
          <p className="text-base md:text-xl text-[#aaa] mb-10">
            Search for materials from nearby construction sites and reduce waste
          </p>
          <div className="flex justify-center mb-5">
            <div className="flex items-center bg-[#242424] border-2 border-[#3a3a3a] rounded-full p-2 pl-6 max-w-[900px] w-full shadow-lg gap-3 transition-all duration-300">
              <SearchIcon size={24} className="text-[#888] mr-3" />
              <input
                type="text"
                placeholder="Search for materials (e.g., cement, bricks, steel...)"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent border-none outline-none text-white text-base py-3"
              />
              <div className="flex items-center gap-1 bg-[#1a1a1a] py-2 px-3 rounded-3xl">
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value) || 10)}
                  min="1"
                  max="100"
                  className="w-[50px] bg-transparent border-none outline-none text-white text-sm text-center"
                  placeholder="Radius"
                />
                <span className="text-[#888] text-sm">km</span>
              </div>
              <motion.button
                onClick={() => handleSearch()}
                className="bg-[#f39c12] text-[#1a1a1a] border-none rounded-full py-3 px-8 text-base font-bold cursor-pointer transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  "Search"
                )}
              </motion.button>
            </div>
          </div>
          {!userLocation && (
            <motion.button
              onClick={() => getUserLocation()}
              className="bg-[#3498db] text-white border-none rounded-full py-3 px-6 text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center mt-2.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MapPin size={20} className="mr-2" />
              Enable Location Access
            </motion.button>
          )}
        </motion.div>

        {searched && userLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 px-5">
                <Loader
                  size={48}
                  className="animate-spin text-[#f39c12]"
                />
                <p className="text-[#aaa] mt-5">
                  Searching nearby sites...
                </p>
              </div>
            ) : results.length > 0 ? (
              <>
                <h2 className="text-2xl text-[#f39c12] mb-5 font-semibold flex items-center">
                  <MapIcon size={24} className="mr-3" />
                  Found {results.length} site{results.length !== 1 ? "s" : ""}{" "}
                  within {radius} km
                </h2>
                <div className="rounded-2xl overflow-hidden border-2 border-[#3a3a3a] shadow-2xl">
                  <MapContainer
                    center={[userLocation.lat, userLocation.lng]}
                    zoom={12}
                    className="h-[600px] w-full"
                    zoomControl={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[userLocation.lat, userLocation.lng]}
                      icon={userIcon}
                    >
                      <Popup>
                        <div className="p-1">
                          <strong className="text-[#3498db] text-base">
                            Your Location
                          </strong>
                        </div>
                      </Popup>
                    </Marker>
                    {results.map((site, index) => (
                      <Marker
                        key={site._id || index}
                        position={[
                          site.location.coordinates[0],
                          site.location.coordinates[1],
                        ]}
                        icon={siteIcon}
                      >
                        <Popup maxWidth={300}>
                          <div className="p-2 min-w-[250px]">
                            <h3 className="text-lg font-bold text-[#f39c12] m-0 mb-3">{site.name}</h3>
                            <div className="mb-3">
                              <div className="flex items-center gap-1.5 text-[#333] text-[13px] mb-1">
                                <MapPin size={14} className="text-[#888]" />
                                <span>
                                  {site.location.coordinates[0].toFixed(4)},{" "}
                                  {site.location.coordinates[1].toFixed(4)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[#333] text-[13px] mb-1">
                                <Phone size={14} className="text-[#888]" />
                                <span>{site.phone}</span>
                              </div>
                            </div>
                            <div className="mb-3">
                              <h4 className="flex items-center gap-1.5 text-[#333] text-sm font-semibold mb-2">
                                <Package size={14} />
                                Available Materials
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(site.materials || {}).map(
                                  ([material, details]) => (
                                    <div
                                      key={material}
                                      className="bg-[#f8f9fa] p-2 rounded-md border border-[#dee2e6]"
                                    >
                                      <span className="block text-[#333] text-xs font-semibold mb-1 capitalize">
                                        {material.replace("_", " ")}
                                      </span>
                                      <div className="flex justify-between items-center">
                                        {typeof details === "object" ? (
                                          <>
                                            <span className="flex items-center gap-1 text-[#666] text-[11px]">
                                              <Package size={10} />
                                              {details.stock}
                                            </span>
                                            <span className="flex items-center gap-1 text-[#f39c12] text-[11px] font-bold">
                                              <IndianRupee size={10} />
                                              {details.price}
                                            </span>
                                          </>
                                        ) : (
                                          <span className="flex items-center gap-1 text-[#666] text-[11px]">
                                            <Package size={10} />
                                            {details}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                            <motion.button
                              onClick={() => setSelectedSite(site)}
                              className="w-full p-2.5 bg-[#f39c12] text-white border-none rounded-md text-[13px] font-bold cursor-pointer transition-all duration-300 flex items-center justify-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Phone size={14} className="mr-1.5" />
                              Contact to Buy
                            </motion.button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </>
            ) : (
              <div className="text-center py-20 px-5 bg-[#242424] rounded-2xl border-2 border-dashed border-[#3a3a3a]">
                <Package
                  size={64}
                  className="text-[#3a3a3a] mb-5 mx-auto"
                />
                <h3 className="text-[#f39c12] text-2xl mb-2.5">
                  No Results Found
                </h3>
                <p className="text-[#aaa] text-base">
                  No construction sites found within {radius} km.
                  <br />
                  Try increasing the search radius or searching for different
                  materials.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {!searched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-[60px] text-center"
          >
            <h3 className="text-[#f39c12] text-xl mb-5">
              Popular Materials
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {["Cement", "Bricks", "Steel", "Sand", "Wood", "Gravel"].map(
                (material) => (
                  <motion.button
                    key={material}
                    className="py-2.5 px-5 bg-[#242424] text-[#f39c12] border-2 border-[#3a3a3a] rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-[#f39c12] hover:text-[#1a1a1a]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery(material);
                      if (userLocation) {
                        handleSearch(material);
                      } else {
                        getUserLocation();
                      }
                    }}
                  >
                    {material}
                  </motion.button>
                )
              )}
            </div>
          </motion.div>
        )}

        <BuyModal
          site={selectedSite}
          onClose={() => setSelectedSite(null)}
          onSubmit={submitOrder}
        />
      </motion.div>
    </div>
  );
}
