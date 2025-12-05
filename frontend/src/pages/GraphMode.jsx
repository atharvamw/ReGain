import { useState, useEffect } from "react";
import ReGainGraph from "../components/Graph";
import GraphSearch from "../components/GraphSearch";
import GraphSidebar from "../components/GraphSidebar";
import { Search as SearchIcon, Loader } from "lucide-react";

export default function GraphMode() {
    const [selectedNode, setSelectedNode] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [userLocation, setUserLocation] = useState(null);
    const [radius, setRadius] = useState(50); // Default 50 km for graph
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [sites, setSites] = useState([]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        
        // Auto-fetch location on mount
        getUserLocation();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
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

    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 80px)",
        width: "100%",
        backgroundColor: "#1c1c1c"
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

    const { nodes, edges } = transformDataToGraph();

    return (
        <div style={containerStyle}>
            <GraphSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                radius={radius}
                setRadius={setRadius}
                userLocation={userLocation}
                getUserLocation={getUserLocation}
                handleSearch={handleSearch}
                loading={loading}
                handleKeyPress={handleKeyPress}
                isMobile={isMobile}
            />

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
                
                <GraphSidebar 
                    selectedNode={selectedNode} 
                    isMobile={isMobile} 
                    handleBuyListing={handleBuyListing} 
                />
            </div>
        </div>
    );
}