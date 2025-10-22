import "leaflet-routing-machine"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"
import 'leaflet/dist/leaflet.css'
import L from "leaflet"
import { useState, useEffect } from 'react'

export default function Routing({from, to})
{
    useEffect(()=>{

        const map = L.map("map").setView(from, 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
          }).addTo(map);

        L.Routing.control({
            waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
            routeWhileDragging: true,
        }).addTo(map);

        return () => map.remove();

    }, [from, to]);

    return <div id="map" style={{height: "70vh", width: "70vw"}}></div>
}