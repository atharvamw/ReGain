import { useState } from 'react'
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet"
import L from "leaflet"
import './App.css'
import 'leaflet/dist/leaflet.css'
import Routing from "./components/Routing"

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})


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
        <h1>ReGain</h1>
        <button onClick={handleClick}>Find My Location</button>
        {cords.x != 0 ? <h1>X: {cords.x} , Y: {cords.y}</h1> : null}

        {
          cords.x != 0 ? (<Routing from={[cords.x, cords.y]} to={[cords.x+0.005, cords.y+0.005]}></Routing>) : null
        }
    </>
  )
}

export default App
