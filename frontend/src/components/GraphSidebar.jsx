import React from "react";
import { MapPin, Mail, ShoppingCart } from "lucide-react";

export default function GraphSidebar({ selectedNode, isMobile, handleBuyListing }) {
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

    if (!selectedNode) {
        return (
            <div style={sidebarStyle}>
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#666" }}>
                    <p style={{ fontSize: "16px" }}>
                        Click on a node to view details
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={sidebarStyle}>
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
        </div>
    );
}
