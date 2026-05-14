import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import EstadoBadge from "../components/EstadoBadge";
import { noticiasService } from "../services/api";
import { useIsMobile } from "../hooks/useIsMobile";

export default function Mapa() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function cargar() {
      try {
        const res = await noticiasService.getAll();
        setNoticias(res.data ?? []);
      } catch (err) {
        console.error("Error cargando noticias:", err);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  useEffect(() => {
    if (cargando) return;
    if (typeof window === "undefined") return;
    if (mapInstanceRef.current) return;

    const init = () => {
      if (!window.L) return setTimeout(init, 100);

      const L = window.L;
      const map = L.map(mapRef.current).setView([10.3997, -75.5144], 12);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      noticias.forEach((n) => {
        const marker = L.marker([n.lat, n.lng]).addTo(map);
        marker.on("click", () => setSeleccionado(n));
      });
    };

    init();
  }, [cargando, noticias]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" />
      </Head>

      <div>
        <div
          style={{
            marginBottom: 28,
            borderBottom: "1px solid #e5e5e3",
            paddingBottom: 20,
          }}
        >
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            Mapa de cortes
          </h1>
          <p style={{ fontSize: 15, color: "#737373" }}>
            Distribucion geografica de las interrupciones registradas.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 300px",
            gridTemplateRows: isMobile ? "380px auto" : undefined,
            gap: 16,
            height: isMobile ? "auto" : 520,
          }}
        >
          <div
            ref={mapRef}
            style={{
              borderRadius: 10,
              border: "1px solid #e5e5e3",
              overflow: "hidden",
              height: "100%",
            }}
          >
            {cargando && (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#737373",
                  fontSize: 14,
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                }}
              >
                Cargando mapa...
              </div>
            )}
          </div>

          <div
            style={{
              border: "1px solid #e5e5e3",
              borderRadius: 10,
              padding: 20,
              overflow: "auto",
            }}
          >
            {seleccionado ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#2563eb",
                      flexShrink: 0,
                    }}
                  />
                  <strong
                    style={{
                      fontSize: 14,
                      fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    }}
                  >
                    {seleccionado.empresa}
                  </strong>
                </div>
                <EstadoBadge estado={seleccionado.estado} />
                <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.4 }}>
                  {seleccionado.barrios.join(", ")}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "#737373",
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                  }}
                >
                  {seleccionado.municipio}
                </p>
                <p style={{ fontSize: 14, color: "#525252", lineHeight: 1.6 }}>
                  {seleccionado.descripcion}
                </p>
                <button
                  onClick={() => setSeleccionado(null)}
                  style={{
                    marginTop: 8,
                    padding: "7px 16px",
                    border: "1px solid #e5e5e3",
                    borderRadius: 6,
                    backgroundColor: "#ffffff",
                    fontSize: 13,
                    color: "#737373",
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                  }}
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    color: "#737373",
                    lineHeight: 1.6,
                    textAlign: "center",
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                  }}
                >
                  Haz clic en un marcador del mapa para ver el detalle del
                  corte.
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "#737373",
                      fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#2563eb",
                        flexShrink: 0,
                      }}
                    />
                    <span>Agua — Acuacar</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}