import { useState } from "react";
import Routing from "../components/Routing";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapMode()
{
    const [cords, setCords] = useState({x: 0, y: 0});

    function handleClick(event)
    {
      navigator.geolocation.getCurrentPosition((position)=>{
          setCords({x: position.coords.latitude, y: position.coords.longitude});
      })
    }

    return(
        <>
            <button className='bg-green-700 rounded-4xl px-4 py-2 mb-4 cursor-pointer' onClick={handleClick}>Find My Location</button>
            {cords.x != 0 ? <h1>X: {cords.x} , Y: {cords.y}</h1> : null}

            {
                cords.x != 0 ? (<Routing className='mb-4'from={[cords.x, cords.y]} to={[cords.x+0.005, cords.y+0.005]}></Routing>) : null
            }
      </>
    )
}