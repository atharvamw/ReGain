import { useState } from 'react'
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet"
import L from "leaflet"
import './App.css'
import 'leaflet/dist/leaflet.css'
import Routing from "./components/Routing"
import Navbar from './components/NavBar'
import ReGainGraph from './components/Graph'

const nodes = [
  { id: 0, label: "My Site" },
  { id: 1, label: "Site A" },
  { id: 2, label: "Site B" },
  { id: 3, label: "Site C" },
];

const edges = [
  { from: 0, to: 1, distance: 10 },
  { from: 0, to: 2, distance: 20 },
  { from: 0, to: 3, distance: 40 },
  { from: 1, to: 2, distance: 15 },
];

function App() {
  const [cords, setCords] = useState({x: 0, y: 0});

  function handleClick(event)
  {
    navigator.geolocation.getCurrentPosition((position)=>{
        setCords({x: position.coords.latitude, y: position.coords.longitude});
    })
  }

  return (
    <>
        <Navbar/>
        <ReGainGraph nodes={nodes} edges={edges} height="600px"/>
        <button className='bg-green-700 rounded-4xl px-4 py-2 mb-4 cursor-pointer' onClick={handleClick}>Find My Location</button>
        {cords.x != 0 ? <h1>X: {cords.x} , Y: {cords.y}</h1> : null}

        {
          cords.x != 0 ? (<Routing className='mb-4'from={[cords.x, cords.y]} to={[cords.x+0.005, cords.y+0.005]}></Routing>) : null
        }
    </>
  )
}

export default App
