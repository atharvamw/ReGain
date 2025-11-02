import { useState, useEffect } from "react";
import ReGainGraph from "../components/Graph"

export default function GraphMode()
{
    const [selectedNode, setSelectedNode] = useState(null);

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
        // Add your purchase logic here
    };

    // Set default selected node on mount
    useEffect(() => {
        if (!selectedNode && nodes.length > 0) {
            setSelectedNode(nodes[0]);
        }
    }, []);

    return(
        <div style={{ display: "flex", height: "calc(100vh - 120px)", gap: "0", width: "100%" }}>
            <div style={{ flex: "1 1 auto", minWidth: 0, height: "100%" }}>
                <ReGainGraph 
                    nodes={nodes} 
                    edges={edges} 
                    height="100%"
                    width="100%"
                    onNodeClick={handleNodeClick}
                />
            </div>
            
            <div style={{
                width: "380px",
                minWidth: "380px",
                maxWidth: "380px",
                padding: "20px",
                borderLeft: "3px solid #f39c12",
                overflowY: "auto",
                backgroundColor: "#1a1a1a",
                color: "#ffffff",
                boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.3)",
                height: "100%"
            }}>
                {selectedNode ? (
                    <>
                        <h2 style={{ 
                            color: "#f39c12", 
                            marginBottom: "16px",
                            marginTop: "0",
                            fontSize: "22px",
                            borderBottom: "2px solid #f39c12",
                            paddingBottom: "8px"
                        }}>
                            {selectedNode.label}
                        </h2>
                        
                        <div style={{ marginBottom: "20px" }}>
                            <p style={{ marginBottom: "8px", fontSize: "13px" }}>
                                <strong style={{ color: "#f1c40f" }}>Location:</strong> {selectedNode.location}
                            </p>
                            <p style={{ fontSize: "13px", margin: "0" }}>
                                <strong style={{ color: "#f1c40f" }}>Contact:</strong> {selectedNode.contact}
                            </p>
                        </div>
                        
                        <h3 style={{ 
                            color: "#f39c12", 
                            marginBottom: "12px",
                            fontSize: "16px",
                            marginTop: "0"
                        }}>
                            Available Materials
                        </h3>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {selectedNode.materials.map((material, index) => (
                                <div key={index} style={{
                                    padding: "14px",
                                    backgroundColor: "#2c2c2c",
                                    borderRadius: "6px",
                                    border: "1px solid #444"
                                }}>
                                    <h4 style={{ 
                                        margin: "0 0 10px 0",
                                        color: "#f1c40f",
                                        fontSize: "15px"
                                    }}>
                                        {material.name}
                                    </h4>
                                    <div style={{ marginBottom: "10px" }}>
                                        <p style={{ margin: "4px 0", fontSize: "13px" }}>
                                            <strong>Stock:</strong> {material.quantity} {material.unit}
                                        </p>
                                        <p style={{ margin: "4px 0", fontSize: "13px" }}>
                                            <strong>Price:</strong> ${material.price}/{material.unit}
                                        </p>
                                        <p style={{ 
                                            margin: "4px 0", 
                                            fontSize: "13px",
                                            color: "#95a5a6" 
                                        }}>
                                            <strong>Total:</strong> ${material.price * material.quantity}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleBuyListing(material)}
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            backgroundColor: "#f39c12",
                                            color: "#1a1a1a",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            fontWeight: "bold",
                                            transition: "background-color 0.2s"
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = "#e67e22"}
                                        onMouseOut={(e) => e.target.style.backgroundColor = "#f39c12"}
                                    >
                                        Buy Listing
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#95a5a6" }}>
                        <p>Click on a node to view details</p>
                    </div>
                )}
            </div>
        </div>
    )
}