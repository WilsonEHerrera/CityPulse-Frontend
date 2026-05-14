import { useEffect, useRef } from "react";
import { servicioLabel } from "../data/cortes";

export default function MapaCortes({ cortes }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.L) return;
    if (instanceRef.current) return;

    const L = window.L;

    const map = L.map("mapa-cortes").setView([10.4061, -75.5198], 12);
    instanceRef.current = map;

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; OpenStreetMap &copy; CARTO",
        maxZoom: 18,
      },
    ).addTo(map);

    cortes.forEach((c) => {
      const color = servicioLabel[c.servicio].color;
      const icon = servicioLabel[c.servicio].icon;

      const marker = L.circleMarker([c.lat, c.lng], {
        radius: 10,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.5,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family:sans-serif;min-width:180px">
          <div style="font-weight:700;margin-bottom:4px">${icon} ${c.titulo}</div>
          <div style="font-size:0.8rem;color:#666;margin-bottom:6px">${c.empresa}</div>
          <div style="font-size:0.8rem"><strong>Barrios:</strong> ${c.barrios.join(", ")}</div>
        </div>
      `);
    });

    return () => {
      map.remove();
      instanceRef.current = null;
    };
  }, []);

  return <div id="mapa-cortes"></div>;
}