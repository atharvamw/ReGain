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
  const [radius, setRadius] = useState(10);
  const [selectedSite, setSelectedSite] = useState(null);

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
      console.log(result, userLocation.lat, userLocation.lng, radius);
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
                                <MapPin size={14} style={{ color: "#888" }} />
                                <span>
                                  {site.location.coordinates[0].toFixed(4)},{" "}
                                  {site.location.coordinates[1].toFixed(4)}
                                </span>
                              </div>
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
      </motion.div>
    </div>
  );
}

// ...existing code (all the style definitions)...
