import { useState } from 'react'
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet"
import L from "leaflet"
import './App.css'
import 'leaflet/dist/leaflet.css'
import Routing from "./components/Routing"
import Navbar from './components/NavBar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GraphMode from './pages/GraphMode'
import MapMode from './pages/MapMode'
import Home from './pages/Home'
import Register from './pages/Register'
import ScrollTriggered from './pages/ScrollProgress'


function App() {

  return (
    <>
      <Navbar/>
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/graph" element={<GraphMode/>}/>
          <Route path="/map" element={<MapMode/>}/>
      </Routes>
    </>
  )
}

export default App
