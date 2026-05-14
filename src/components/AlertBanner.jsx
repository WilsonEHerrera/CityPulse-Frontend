// components/AlertaBanner.jsx
import { useState, useEffect } from "react";
import { noticiasService } from "../services/api";

function esFechaHoy(iso) {
  const d = new Date(iso);
  const hoy = new Date();
  return (
    d.getDate() === hoy.getDate() &&
    d.getMonth() === hoy.getMonth() &&
    d.getFullYear() === hoy.getFullYear()
  );
}

export default function AlertaBanner() {
  const [cortesHoy, setCortesHoy] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await noticiasService.getAll();
        const hoy = (res.data ?? []).filter((c) =>
          c.programaciones?.some((p) => esFechaHoy(p.fecha)),
        );
        setCortesHoy(hoy);
      } catch {}
    }
    cargar();
  }, []);

  if (!visible || cortesHoy.length === 0) return null;

  const totalBarrios = cortesHoy.reduce((acc, c) => {
    const prog = c.programaciones?.filter((p) => esFechaHoy(p.fecha)) ?? [];
    return acc + prog.reduce((a, p) => a + p.barrios.length, 0);
  }, 0);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
      <div
        style={{
          backgroundColor: "#fff7ed",
          borderBottom: "1px solid #fed7aa",
          padding: "8px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#ea580c",
                flexShrink: 0,
                animation: "pulse 1.5s ease-in-out infinite",
                display: "inline-block",
              }}
            />
            <p
              style={{
                fontSize: 13,
                color: "#9a3412",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                margin: 0,
              }}
            >
              Hoy hay {cortesHoy.length} corte
              {cortesHoy.length !== 1 ? "s" : ""} programado
              {cortesHoy.length !== 1 ? "s" : ""} que afectan {totalBarrios}{" "}
              barrio{totalBarrios !== 1 ? "s" : ""} en Cartagena.
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              color: "#9a3412",
              cursor: "pointer",
              padding: "0 4px",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            &times;
          </button>
        </div>
      </div>
    </>
  );
}