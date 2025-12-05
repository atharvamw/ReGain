import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/Auth";
import Navbar from "./components/NavBar";
import GraphMode from "./pages/GraphMode";
import MapMode from "./pages/MapMode";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MySites from "./components/MySites";
import ProtectedRoute from "./components/ProtectedRoute";
import Search from "./pages/Search";
import MyOrders from "./pages/MyOrders";
import "./App.css";
import "leaflet/dist/leaflet.css";

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
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/myorders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
