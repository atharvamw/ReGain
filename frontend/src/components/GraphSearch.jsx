import React from "react";
import { Search as SearchIcon, MapPin, Loader } from "lucide-react";

export default function GraphSearch({
    searchQuery,
    setSearchQuery,
    radius,
    setRadius,
    userLocation,
    getUserLocation,
    handleSearch,
    loading,
    handleKeyPress,
    isMobile
}) {
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

    return (
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
    );
}
