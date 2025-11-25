import { useState } from "react";
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
  const [radius, setRadius] = useState(10); // Default 10 km radius
  const [selectedSite, setSelectedSite] = useState(null);

  // Handle search query changes and reset if cleared
  const handleSearchQueryChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Reset to initial state if search bar is completely cleared
    if (value.trim() === "") {
      setSearched(false);
      setResults([]);
    }
  };

  const handleSearch = async () => {
    if (!userLocation) {
      alert("Please allow location access to search nearby sites");
      getUserLocation();
      return;
    }

    setLoading(true);
    setSearched(true);

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
      console.log(result, userLocation.lat, userLocation.lng, radius);

      if (result.status === "success") {
        // Filter results by material if searchQuery is provided
        let filteredResults = result.data || [];
        if (searchQuery.trim()) {
          filteredResults = filteredResults.filter((site) =>
            Object.keys(site.materials || {}).some((material) =>
              material.toLowerCase().includes(searchQuery.toLowerCase())
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

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location error:", error);
          alert(
            "Unable to get your location. Please enable location services."
          );
        }
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleBuy = (site) => {
    setSelectedSite(site);
  };

  return (
    <div style={containerStyle}>
      <motion.div
        style={contentStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Search Section */}
        <motion.div
          style={heroSectionStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 style={titleStyle}>
            <SearchIcon
              size={48}
              style={{ marginRight: "16px", color: "#f39c12" }}
            />
            Find Construction Materials
          </h1>
          <p style={subtitleStyle}>
            Search for materials from nearby construction sites and reduce waste
          </p>

          {/* Search Bar */}
          <div style={searchBarContainerStyle}>
            <div style={searchBarStyle}>
              <SearchIcon size={24} style={searchIconStyle} />
              <input
                type="text"
                placeholder="Search for materials (e.g., cement, bricks, steel...)"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                onKeyPress={handleKeyPress}
                style={searchInputStyle}
              />
              <div style={radiusInputContainer}>
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value) || 10)}
                  min="1"
                  max="100"
                  style={radiusInputStyle}
                  placeholder="Radius"
                />
                <span style={radiusLabelStyle}>km</span>
              </div>
              <motion.button
                onClick={handleSearch}
                style={searchButtonStyle}
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
              onClick={getUserLocation}
              style={locationButtonStyle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MapPin size={20} style={{ marginRight: "8px" }} />
              Enable Location Access
            </motion.button>
          )}
        </motion.div>

        {/* Map Section */}
        {searched && userLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={mapContainerStyle}
          >
            {loading ? (
              <div style={loadingContainerStyle}>
                <Loader
                  size={48}
                  className="animate-spin"
                  style={{ color: "#f39c12" }}
                />
                <p style={{ color: "#aaa", marginTop: "20px" }}>
                  Searching nearby sites...
                </p>
              </div>
            ) : results.length > 0 ? (
              <>
                <h2 style={resultsHeaderStyle}>
                  <MapIcon size={24} style={{ marginRight: "12px" }} />
                  Found {results.length} site{results.length !== 1 ? "s" : ""}{" "}
                  within {radius} km
                </h2>
                <div style={mapWrapperStyle}>
                  <MapContainer
                    center={[userLocation.lat, userLocation.lng]}
                    zoom={12}
                    style={mapStyle}
                    zoomControl={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* User Location Marker */}
                    <Marker
                      position={[userLocation.lat, userLocation.lng]}
                      icon={userIcon}
                    >
                      <Popup>
                        <div style={popupStyle}>
                          <strong
                            style={{ color: "#3498db", fontSize: "16px" }}
                          >
                            Your Location
                          </strong>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Site Markers */}
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
                          <div style={popupContentStyle}>
                            <h3 style={popupTitleStyle}>{site.name}</h3>
                            <div style={popupDetailsStyle}>
                              <div style={popupRowStyle}>
                                <Phone size={14} style={{ color: "#888" }} />
                                <span>{site.phone}</span>
                              </div>
                            </div>
                            <div style={popupMaterialsStyle}>
                              <h4 style={popupMaterialsTitleStyle}>
                                <Package size={14} />
                                Available Materials
                              </h4>
                              <div style={popupMaterialsGridStyle}>
                                {Object.entries(site.materials || {}).map(
                                  ([material, details]) => (
                                    <div
                                      key={material}
                                      style={popupMaterialCardStyle}
                                    >
                                      <span style={popupMaterialNameStyle}>
                                        {material.replace("_", " ")}
                                      </span>
                                      <div style={popupMaterialInfoStyle}>
                                        {typeof details === "object" ? (
                                          <>
                                            <span style={popupStockStyle}>
                                              <Package size={10} />
                                              {details.stock}
                                            </span>
                                            <span style={popupPriceStyle}>
                                              <IndianRupee size={10} />
                                              {details.price}
                                            </span>
                                          </>
                                        ) : (
                                          <span style={popupStockStyle}>
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
                              onClick={() => handleBuy(site)}
                              style={popupBuyButtonStyle}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Phone size={14} style={{ marginRight: "6px" }} />
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
              <div style={noResultsStyle}>
                <Package
                  size={64}
                  style={{ color: "#3a3a3a", marginBottom: "20px" }}
                />
                <h3
                  style={{
                    color: "#f39c12",
                    fontSize: "24px",
                    marginBottom: "10px",
                  }}
                >
                  No Results Found
                </h3>
                <p style={{ color: "#aaa", fontSize: "16px" }}>
                  No construction sites found within {radius} km.
                  <br />
                  Try increasing the search radius or searching for different
                  materials.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Suggestions (when not searched) */}
        {!searched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={suggestionsStyle}
          >
            <h3
              style={{
                color: "#f39c12",
                fontSize: "20px",
                marginBottom: "20px",
              }}
            >
              Popular Materials
            </h3>
            <div style={suggestionsGridStyle}>
              {["Cement", "Bricks", "Steel", "Sand", "Wood", "Gravel"].map(
                (material) => (
                  <motion.button
                    key={material}
                    style={suggestionChipStyle}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "#f39c12",
                      color: "#1a1a1a",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery(material);
                      if (userLocation) {
                        setTimeout(handleSearch, 100);
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
  maxWidth: "1400px",
  margin: "0 auto",
};

const heroSectionStyle = {
  textAlign: "center",
  marginBottom: "40px",
};

const titleStyle = {
  fontSize: "clamp(32px, 5vw, 48px)",
  fontWeight: "800",
  color: "#fff",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const subtitleStyle = {
  fontSize: "clamp(16px, 2vw, 20px)",
  color: "#aaa",
  marginBottom: "40px",
};

const searchBarContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

const searchBarStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#242424",
  border: "2px solid #3a3a3a",
  borderRadius: "50px",
  padding: "8px 8px 8px 24px",
  maxWidth: "900px",
  width: "100%",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  gap: "12px",
};

const searchIconStyle = {
  color: "#888",
  marginRight: "12px",
};

const searchInputStyle = {
  flex: 1,
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
  color: "#fff",
  fontSize: "16px",
  padding: "12px 0",
};

const radiusInputContainer = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  backgroundColor: "#1a1a1a",
  padding: "8px 12px",
  borderRadius: "20px",
};

const radiusInputStyle = {
  width: "50px",
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
  color: "#fff",
  fontSize: "14px",
  textAlign: "center",
};

const radiusLabelStyle = {
  color: "#888",
  fontSize: "14px",
};

const searchButtonStyle = {
  backgroundColor: "#f39c12",
  color: "#1a1a1a",
  border: "none",
  borderRadius: "50px",
  padding: "12px 32px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const locationButtonStyle = {
  backgroundColor: "#3498db",
  color: "#fff",
  border: "none",
  borderRadius: "50px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "inline-flex",
  alignItems: "center",
  marginTop: "10px",
};

const mapContainerStyle = {
  marginTop: "40px",
};

const loadingContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 20px",
};

const resultsHeaderStyle = {
  fontSize: "24px",
  color: "#f39c12",
  marginBottom: "20px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
};

const mapWrapperStyle = {
  borderRadius: "16px",
  overflow: "hidden",
  border: "2px solid #3a3a3a",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
};

const mapStyle = {
  height: "600px",
  width: "100%",
};

const popupStyle = {
  padding: "4px",
};

const popupContentStyle = {
  padding: "8px",
  minWidth: "250px",
};

const popupTitleStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#f39c12",
  margin: "0 0 12px 0",
};

const popupDetailsStyle = {
  marginBottom: "12px",
};

const popupRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#333",
  fontSize: "13px",
  marginBottom: "4px",
};

const popupMaterialsStyle = {
  marginBottom: "12px",
};

const popupMaterialsTitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#333",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "8px",
};

const popupMaterialsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "8px",
};

const popupMaterialCardStyle = {
  backgroundColor: "#f8f9fa",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #dee2e6",
};

const popupMaterialNameStyle = {
  display: "block",
  color: "#333",
  fontSize: "12px",
  fontWeight: "600",
  marginBottom: "4px",
  textTransform: "capitalize",
};

const popupMaterialInfoStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const popupStockStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  color: "#666",
  fontSize: "11px",
};

const popupPriceStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  color: "#f39c12",
  fontSize: "11px",
  fontWeight: "700",
};

const popupBuyButtonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#f39c12",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const noResultsStyle = {
  textAlign: "center",
  padding: "80px 20px",
  backgroundColor: "#242424",
  borderRadius: "16px",
  border: "2px dashed #3a3a3a",
};

const suggestionsStyle = {
  marginTop: "60px",
  textAlign: "center",
};

const suggestionsGridStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  justifyContent: "center",
};

const suggestionChipStyle = {
  padding: "10px 20px",
  backgroundColor: "#242424",
  color: "#f39c12",
  border: "2px solid #3a3a3a",
  borderRadius: "50px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};
