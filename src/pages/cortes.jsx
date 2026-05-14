import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { noticiasService } from "../services/api";
import { useIsMobile } from "../hooks/useIsMobile";
import { sharedStyles } from "../styles/shared";
import CorteCard from "../components/CorteCard";
import Spinner from "../components/Spinner";

export default function Cortes() {
  const router = useRouter();
  const [cortes, setCortes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    try {
      const res = await noticiasService.getAll();
      setCortes(res.data ?? []);
    } catch (err) {
      console.error("Error cargando cortes:", err);
    } finally {
      setCargando(false);
    }
  }

  const filtrados = cortes.filter((c) => {
    const texto = busqueda.toLowerCase();
    return (
      !texto ||
      c.programaciones?.some((p) =>
        p.barrios.some((b) => b.toLowerCase().includes(texto)),
      ) ||
      c.descripcion.toLowerCase().includes(texto)
    );
  });

  return (
    <div>
      <div
        style={{
          ...sharedStyles.pageHeader,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <h1 style={sharedStyles.pageTitle}>Cortes registrados</h1>
        <p style={sharedStyles.muted}>
          {cargando
            ? "Cargando..."
            : `${filtrados.length} resultado${filtrados.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Buscar por barrio o descripcion..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: isMobile ? "100%" : 360,
            padding: "9px 14px",
            border: "1px solid #e5e5e3",
            borderRadius: 8,
            fontSize: 14,
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            color: "#1a1a1a",
            backgroundColor: "#ffffff",
            outline: "none",
          }}
        />
      </div>

      {cargando ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#737373",
            fontSize: 14,
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            padding: "24px 0",
          }}
        >
          <Spinner />
          <span>Cargando cortes...</span>
        </div>
      ) : filtrados.length === 0 ? (
        <p
          style={{
            color: "#737373",
            fontSize: 15,
            padding: "48px 0",
            textAlign: "center",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          No se encontraron cortes con esos filtros.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 16,
          }}
        >
          {filtrados.map((c) => (
            <CorteCard
              key={c._id}
              corte={c}
              onClick={() => router.push(`/cortes/${c._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
