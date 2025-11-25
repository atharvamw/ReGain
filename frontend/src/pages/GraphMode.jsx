import { useState, useEffect } from "react";
import ReGainGraph from "../components/Graph"
import { ShoppingCart, MapPin, Mail } from "lucide-react";

export default function GraphMode()
{
    const [selectedNode, setSelectedNode] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const nodes = [
        { 
            id: 0, 
            label: "My Site",
            materials: [
                { name: "Steel", quantity: 500, unit: "kg", price: 50 },
                { name: "Copper", quantity: 200, unit: "kg", price: 80 }
            ],
            contact: "contact@mysite.com",
            location: "Location A"
        },
        { 
            id: 1, 
            label: "Site A",
            materials: [
                { name: "Aluminum", quantity: 300, unit: "kg", price: 60 },
                { name: "Plastic", quantity: 150, unit: "kg", price: 20 }
            ],
            contact: "info@sitea.com",
            location: "Location B"
        },
        { 
            id: 2, 
            label: "Site B",
            materials: [
                { name: "Glass", quantity: 400, unit: "kg", price: 30 },
                { name: "Wood", quantity: 250, unit: "kg", price: 40 }
            ],
            contact: "contact@siteb.com",
            location: "Location C"
        },
        { 
            id: 3, 
            label: "Site C",
            materials: [
                { name: "Paper", quantity: 600, unit: "kg", price: 15 },
                { name: "Cardboard", quantity: 350, unit: "kg", price: 10 }
            ],
            contact: "support@sitec.com",
            location: "Location D"
        },
    ];
      
    const edges = [
        { from: 0, to: 1, distance: 10 },
        { from: 0, to: 2, distance: 20 },
        { from: 0, to: 3, distance: 40 },
        { from: 1, to: 2, distance: 15 },
    ];

    const handleNodeClick = (nodeId) => {
        const node = nodes.find(n => n.id === nodeId);
        setSelectedNode(node);
    };

    const handleBuyListing = (material) => {
        alert(`Initiating purchase for ${material.quantity}${material.unit} of ${material.name}`);
    };

    useEffect(() => {
        if (!selectedNode && nodes.length > 0) {
            setSelectedNode(nodes[0]);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Styles
    const containerStyle = {
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "calc(100vh - 120px)",
        width: "100%",
        backgroundColor: "#1c1c1c"
    };

    const graphContainerStyle = {
        flex: isMobile ? "0 0 50vh" : "1 1 auto",
        height: isMobile ? "50vh" : "calc(100vh - 120px)",
        padding: "10px"
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
            : "-5px 0 20px rgba(243, 156, 18, 0.2)"
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
        transition: "all 0.2s ease"
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
        boxShadow: "0 2px 8px rgba(243, 156, 18, 0.3)"
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

    return(
        <div style={containerStyle}>
            <div style={graphContainerStyle}>
                <ReGainGraph 
                    nodes={nodes} 
                    edges={edges} 
                    height="100%"
                    width="100%"
                    onNodeClick={handleNodeClick}
                />
            </div>
            
            <div style={sidebarStyle}>
                {selectedNode ? (
                    <>
                        <div style={headerStyle}>
                            <h2 style={siteNameStyle}>{selectedNode.label}</h2>
                            <div style={infoBoxStyle}>
                                <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#ccc", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <MapPin size={16} />
                                    <strong style={{ color: "#f39c12" }}>Location:</strong> {selectedNode.location}
                                </p>
                                <p style={{ margin: "0", fontSize: "14px", color: "#ccc", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Mail size={16} />
                                    <strong style={{ color: "#f39c12" }}>Contact:</strong> {selectedNode.contact}
                                </p>
                            </div>
                        </div>
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
                                    <h4 style={{ margin: "0 0 12px 0", fontSize: "18px", color: "#f1c40f", fontWeight: "700" }}>
                                        {material.name}
                                    </h4>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                                        <p style={{ margin: "0", fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ color: "#aaa" }}>Quantity:</span>
                                            <strong>{material.quantity}{material.unit}</strong>
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
                                    
                                    <button 
                                        onClick={() => handleBuyListing(material)}
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
                                        <ShoppingCart size={16} style={{ marginRight: "6px" }} />
                                        Buy Listing
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: "#666" }}>
                        <p style={{ fontSize: "16px" }}>Click on a node to view details</p>
                    </div>
                )}
            </div>
        </div>
    )
}