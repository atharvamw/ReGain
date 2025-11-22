import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import Routing from "./components/Routing";
import Navbar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GraphMode from "./pages/GraphMode";
import MapMode from "./pages/MapMode";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ScrollTriggered from "./pages/ScrollProgress";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MySites from "./components/MySites";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/Auth";
import { useContext } from "react";

function App() {
  const Auth = useContext(AuthContext);

  useEffect(() => {
    Auth.authenticate();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/graph" element={<ProtectedRoute><GraphMode /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapMode /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mysites" element={<ProtectedRoute><MySites /></ProtectedRoute>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
