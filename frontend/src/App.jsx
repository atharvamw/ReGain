import { useState } from 'react'
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet"
import L from "leaflet"
import './App.css'
import 'leaflet/dist/leaflet.css'
import Routing from "./components/Routing"
import Navbar from './components/NavBar'


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
        <button className='bg-green-700 rounded-4xl px-4 py-2 mb-4 cursor-pointer' onClick={handleClick}>Find My Location</button>
        {cords.x != 0 ? <h1>X: {cords.x} , Y: {cords.y}</h1> : null}

        {
          cords.x != 0 ? (<Routing className='mb-4'from={[cords.x, cords.y]} to={[cords.x+0.005, cords.y+0.005]}></Routing>) : null
        }
    </>
  )
}

export default App
