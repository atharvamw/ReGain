import { useState, useEffect } from "react";
import ReGainGraph from "../components/Graph"
import { ShoppingCart, MapPin, Mail, Search as SearchIcon, Loader } from "lucide-react";
import { motion } from "framer-motion";

export default function GraphMode()
{
    const [selectedNode, setSelectedNode] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [userLocation, setUserLocation] = useState(null);
    const [radius, setRadius] = useState(50); // Default 50 km for graph
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [sites, setSites] = useState([]);

    // Transform sites into nodes and edges for graph
    const transformDataToGraph = () => {
        if (!userLocation || sites.length === 0) return { nodes: [], edges: [] };

        // Create user node (center)
        const nodes = [
            {
                id: 0,
                label: "Your Location",
                materials: [],
                contact: "You",
                location: `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`,
                isUser: true
            }
        ];

        const edges = [];

        // Add site nodes
        sites.forEach((site, index) => {
            const siteId = index + 1;
            
            // Calculate distance from user
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                site.location.coordinates[0],
                site.location.coordinates[1]
            );

            // Convert materials object to array
            const materials = Object.entries(site.materials || {}).map(([name, details]) => ({
                name: name.replace("_", " "),
                quantity: details.stock || 0,
                unit: "kg",
                price: details.price || 0
            }));

            nodes.push({
                id: siteId,
                label: site.name,
                materials: materials,
                contact: site.phone,
                location: `${site.location.coordinates[0].toFixed(4)}, ${site.location.coordinates[1].toFixed(4)}`,
                isActive: site.isActive,
                isUser: false
            });

            // Create edge from user to site
            edges.push({
                from: 0,
                to: siteId,
                distance: Math.round(distance)
            });
        });

        return { nodes, edges };
    };

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
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
                    alert("Unable to get your location. Please enable location services.");
                }
            );
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

            if (result.status === "success") {
                let filteredResults = result.data || [];
                
                // Filter by material if search query provided
                if (searchQuery.trim()) {
                    filteredResults = filteredResults.filter((site) =>
                        Object.keys(site.materials || {}).some((material) =>
                            material.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                    );
                }
                
                setSites(filteredResults);
                
                // Auto-select user node after search
                if (filteredResults.length > 0) {
                    setTimeout(() => setSelectedNode(transformDataToGraph().nodes[0]), 300);
                }
            } else {
                setSites([]);
            }
        } catch (error) {
            console.error("Search failed:", error);
            setSites([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNodeClick = (nodeId) => {
        const { nodes } = transformDataToGraph();
        const node = nodes.find(n => n.id === nodeId);
        setSelectedNode(node);
    };

    const handleBuyListing = (material, siteName) => {
        alert(`Initiating purchase for ${material.quantity}${material.unit} of ${material.name} from ${siteName}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { nodes, edges } = transformDataToGraph();

    // Styles
    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 80px)",
        width: "100%",
        backgroundColor: "#1c1c1c"
    };

    const searchContainerStyle = {
        padding: "20px",
        backgroundColor: "#242424",
        borderBottom: "2px solid #f39c12",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)"
    };

    const searchBarStyle = {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        maxWidth: "1200px",
        margin: "0 auto",
        flexWrap: isMobile ? "wrap" : "nowrap"
    };

    const searchInputStyle = {
        flex: 1,
        padding: "12px 16px",
        backgroundColor: "#1a1a1a",
        border: "2px solid #3a3a3a",
        borderRadius: "8px",
        color: "#fff",
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.3s",
        minWidth: isMobile ? "100%" : "300px"
    };

    const radiusContainerStyle = {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "#1a1a1a",
        padding: "8px 16px",
        borderRadius: "8px",
        border: "2px solid #3a3a3a"
    };

    const radiusInputStyle = {
        width: "60px",
        backgroundColor: "transparent",
        border: "none",
        color: "#fff",
        fontSize: "14px",
        textAlign: "center",
        outline: "none"
    };

    const searchButtonStyle = {
        padding: "12px 24px",
        backgroundColor: "#f39c12",
        color: "#1a1a1a",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "all 0.3s",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        whiteSpace: "nowrap"
    };

    const locationButtonStyle = {
        padding: "12px 24px",
        backgroundColor: "#3498db",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        whiteSpace: "nowrap"
    };

    const mainContainerStyle = {
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        flex: 1,
        overflow: "hidden"
    };

    const graphContainerStyle = {
        flex: isMobile ? "0 0 50vh" : "1 1 auto",
        height: isMobile ? "50vh" : "calc(100vh - 200px)",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a1a1a"
    };

    const sidebarStyle = {
        width: isMobile ? "100%" : "380px",
        padding: "24px",
        borderLeft: isMobile ? "none" : "3px solid #f39c12",
        borderTop: isMobile ? "3px solid #f39c12" : "none",
        backgroundColor: "#242424",
        color: "#fff",
        boxShadow: isMobile 
            ? "0 -5px 20px rgba(243, 156, 18, 0.2)" 
            : "-5px 0 20px rgba(243, 156, 18, 0.2)",
        overflowY: "auto",
        maxHeight: isMobile ? "50vh" : "calc(100vh - 200px)"
    };

    const headerStyle = {
        color: "#f39c12",
        fontSize: "24px",
        fontWeight: "600",
        borderBottom: "2px solid #f39c12",
        paddingBottom: "10px",
        marginBottom: "20px"
    };

    const infoBoxStyle = {
        padding: "12px",
        backgroundColor: "#2a2a2a",
        borderRadius: "6px",
        borderLeft: "3px solid #f1c40f",
        marginBottom: "24px"
    };

    const materialCardStyle = {
        padding: "16px",
        backgroundColor: "#2a2a2a",
        borderRadius: "8px",
        border: "1px solid #3a3a3a",
        transition: "all 0.2s ease",
        marginBottom: "12px"
    };

    const buttonStyle = {
        width: "100%",
        padding: "10px",
        backgroundColor: "#f39c12",
        color: "#1a1a1a",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 8px rgba(243, 156, 18, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px"
    };

    const siteNameStyle = {
        margin: "0 0 16px 0",
        fontSize: "28px",
        fontWeight: "700",
        color: "#f1c40f"
    };

    const sectionTitleStyle = {
        fontSize: "18px",
        fontWeight: "600",
        color: "#f39c12",
        marginBottom: "16px",
        paddingBottom: "8px",
        borderBottom: "2px solid #f39c12"
    };

    const noResultsStyle = {
        textAlign: "center",
        padding: "60px 20px",
        color: "#666"
    };

    const loadingStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        color: "#f39c12"
    };

    return(
        <div style={containerStyle}>
            {/* Search Bar */}
            <div style={searchContainerStyle}>
                <div style={searchBarStyle}>
                    <input
                        type="text"
                        placeholder="Search for materials (e.g., cement, bricks)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={searchInputStyle}
                        onFocus={(e) => e.target.style.borderColor = "#f39c12"}
                        onBlur={(e) => e.target.style.borderColor = "#3a3a3a"}
                    />
                    
                    <div style={radiusContainerStyle}>
                        <input
                            type="number"
                            value={radius}
                            onChange={(e) => setRadius(parseInt(e.target.value) || 50)}
                            min="1"
                            max="200"
                            style={radiusInputStyle}
                        />
                        <span style={{ color: "#888", fontSize: "14px" }}>km</span>
                    </div>

                    {!userLocation ? (
                        <button
                            onClick={getUserLocation}
                            style={locationButtonStyle}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#2980b9"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#3498db"}
                        >
                            <MapPin size={18} />
                            Enable Location
                        </button>
                    ) : (
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            style={searchButtonStyle}
                            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#e67e22")}
                            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "#f39c12")}
                        >
                            {loading ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <SearchIcon size={18} />
                                    Search
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <div style={mainContainerStyle}>
                {/* Graph Visualization */}
                <div style={graphContainerStyle}>
                    {loading ? (
                        <div style={loadingStyle}>
                            <Loader size={48} className="animate-spin" />
                            <p style={{ marginTop: "20px" }}>Loading graph...</p>
                        </div>
                    ) : !searched ? (
                        <div style={noResultsStyle}>
                            <SearchIcon size={64} style={{ margin: "0 auto 20px", color: "#3a3a3a" }} />
                            <p style={{ fontSize: "18px", color: "#aaa" }}>
                                Search for construction sites to view the network graph
                            </p>
                        </div>
                    ) : nodes.length === 0 ? (
                        <div style={noResultsStyle}>
                            <p style={{ fontSize: "18px", color: "#aaa" }}>
                                No sites found within {radius} km
                            </p>
                        </div>
                    ) : (
                        <ReGainGraph 
                            nodes={nodes} 
                            edges={edges} 
                            height="100%"
                            width="100%"
                            onNodeClick={handleNodeClick}
                        />
                    )}
                </div>
                
                {/* Sidebar */}
                <div style={sidebarStyle}>
                    {selectedNode ? (
                        <>
                            <div style={headerStyle}>
                                <h2 style={siteNameStyle}>
                                    {selectedNode.isUser ? "🧑 " : "🏗️ "}
                                    {selectedNode.label}
                                </h2>
                                <div style={infoBoxStyle}>
                                    <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#ccc", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <MapPin size={16} />
                                        <strong style={{ color: "#f39c12" }}>Location:</strong> {selectedNode.location}
                                    </p>
                                    <p style={{ margin: "0", fontSize: "14px", color: "#ccc", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <Mail size={16} />
                                        <strong style={{ color: "#f39c12" }}>Contact:</strong> {selectedNode.contact}
                                    </p>
                                    {!selectedNode.isUser && selectedNode.isActive !== undefined && (
                                        <p style={{ margin: "6px 0 0 0", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ 
                                                padding: "4px 12px", 
                                                backgroundColor: selectedNode.isActive ? "rgba(46, 204, 113, 0.2)" : "rgba(231, 76, 60, 0.2)",
                                                color: selectedNode.isActive ? "#2ecc71" : "#e74c3c",
                                                borderRadius: "12px",
                                                fontSize: "12px",
                                                fontWeight: "600"
                                            }}>
                                                {selectedNode.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            {selectedNode.materials && selectedNode.materials.length > 0 ? (
                                <div style={{ flex: 1, overflowY: "auto" }}>
                                    <h3 style={sectionTitleStyle}>Available Materials</h3>
                                    {selectedNode.materials.map((material, index) => (
                                        <div 
                                            key={index} 
                                            style={materialCardStyle}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.borderColor = "#f39c12";
                                                e.currentTarget.style.transform = "translateX(4px)";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.borderColor = "#3a3a3a";
                                                e.currentTarget.style.transform = "translateX(0)";
                                            }}
                                        >
                                            <h4 style={{ margin: "0 0 12px 0", fontSize: "18px", color: "#f1c40f", fontWeight: "700", textTransform: "capitalize" }}>
                                                {material.name}
                                            </h4>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                                                <p style={{ margin: "0", fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                                                    <span style={{ color: "#aaa" }}>Quantity:</span>
                                                    <strong>{material.quantity} {material.unit}</strong>
                                                </p>
                                                <p style={{ margin: "0", fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                                                    <span style={{ color: "#aaa" }}>Price:</span>
                                                    <strong>₹{material.price}/{material.unit}</strong>
                                                </p>
                                                <p style={{ 
                                                    margin: "0", 
                                                    fontSize: "15px",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    paddingTop: "6px",
                                                    borderTop: "1px solid #3a3a3a"
                                                }}>
                                                    <span style={{ color: "#aaa" }}>Total:</span>
                                                    <strong style={{ color: "#f39c12" }}>₹{material.price * material.quantity}</strong>
                                                </p>
                                            </div>
                                            
                                            {!selectedNode.isUser && (
                                                <button 
                                                    onClick={() => handleBuyListing(material, selectedNode.label)}
                                                    style={buttonStyle}
                                                    onMouseOver={(e) => {
                                                        e.target.style.backgroundColor = "#e67e22";
                                                        e.target.style.transform = "translateY(-2px)";
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.target.style.backgroundColor = "#f39c12";
                                                        e.target.style.transform = "translateY(0)";
                                                    }}
                                                >
                                                    <ShoppingCart size={16} />
                                                    Buy Listing
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                                    <p style={{ fontSize: "14px" }}>
                                        {selectedNode.isUser 
                                            ? "Your location is at the center of the network"
                                            : "No materials available at this site"}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: "center", padding: "60px 20px", color: "#666" }}>
                            <p style={{ fontSize: "16px" }}>
                                {searched 
                                    ? "Click on a node to view details"
                                    : "Search for sites to see the graph"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}