import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { noticiasService } from "../../services/api";
import { sharedStyles } from "../../styles/shared";
import ProgramacionTimeline from "../../components/ProgramacionTimeline";
import Spinner from "../../components/Spinner";
import { useIsMobile } from "../../hooks/useIsMobile";

function formatFecha(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DetalleCorte() {
  const router = useRouter();
  const { id } = router.query;
  const [corte, setCorte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!id) return;
    cargar();
  }, [id]);

  async function cargar() {
    setCargando(true);
    try {
      const res = await noticiasService.getById(id);
      if (!res.success) {
        setError(true);
        return;
      }
      setCorte(res.data);
    } catch (err) {
      console.error("Error cargando corte:", err);
      setError(true);
    } finally {
      setCargando(false);
    }
  }

  if (cargando) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "#737373",
          fontSize: 14,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "48px 0",
        }}
      >
        <Spinner />
        <span>Cargando informacion del corte...</span>
      </div>
    );
  }

  if (error || !corte) {
    return (
      <div style={{ padding: "48px 0" }}>
        <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>
          No se encontro el corte.
        </p>
        <button
          onClick={() => router.back()}
          style={{
            fontSize: 13,
            color: "#1a1a1a",
            background: "none",
            border: "none",
            padding: 0,
            textDecoration: "underline",
            textUnderlineOffset: 3,
            cursor: "pointer",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  const totalBarrios =
    corte.programaciones?.reduce((acc, p) => acc + p.barrios.length, 0) ?? 0;
  const dias = corte.programaciones?.length ?? 0;

  return (
    <div>
      {/* Volver */}
      <button
        onClick={() => router.back()}
        style={{
          fontSize: 13,
          color: "#737373",
          background: "none",
          border: "none",
          padding: 0,
          marginBottom: 20,
          textDecoration: "underline",
          textUnderlineOffset: 3,
          cursor: "pointer",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          display: "block",
        }}
      >
        &larr; Volver
      </button>

      {/* Header */}
      <div style={{ ...sharedStyles.pageHeader }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span style={sharedStyles.pill}>
            {corte.tipo_servicio === "agua" ? "Agua" : "Energia"}
          </span>
          <span
            style={{
              fontSize: 13,
              color: "#737373",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
            }}
          >
            {corte.fuente}
          </span>
        </div>
        <h1
          style={{
            fontSize: isMobile ? 18 : 22,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            marginBottom: 8,
            textTransform: "capitalize",
          }}
        >
          {corte.descripcion.toLowerCase()}
        </h1>
        <p style={sharedStyles.muted}>
          {formatFecha(corte.fecha_inicio)} &ndash;{" "}
          {formatFecha(corte.fecha_fin)}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 260px",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* Timeline de programaciones */}
        <div>
          <p style={sharedStyles.sectionLabel(false)}>Programacion por dia</p>
          <ProgramacionTimeline programaciones={corte.programaciones} />
        </div>

        {/* Sidebar con resumen */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            position: isMobile ? "static" : "sticky",
            top: 80,
          }}
        >
          <div
            style={{
              border: "1px solid #e5e5e3",
              borderRadius: 10,
              padding: "16px 18px",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#a3a3a3",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
              }}
            >
              Resumen del corte
            </p>
            <ResumenFila label="Dias de corte" valor={dias} />
            <ResumenFila label="Barrios afectados" valor={totalBarrios} />
            <ResumenFila label="Fuente" valor={corte.fuente} />
            <ResumenFila
              label="Servicio"
              valor={
                corte.tipo_servicio === "agua"
                  ? "Acueducto"
                  : "Energia electrica"
              }
            />
          </div>

          <div
            style={{
              border: "1px solid #e5e5e3",
              borderRadius: 10,
              padding: "16px 18px",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#a3a3a3",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
              }}
            >
              Informacion oficial
            </p>
            <p style={sharedStyles.muted}>
              Para informacion adicional o reportar novedades, consulta
              directamente la fuente oficial.
            </p>

            <a
              href={`https://www.acuacar.com`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13,
                color: "#1a1a1a",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Ir al sitio oficial &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumenFila({ label, valor }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: "#737373",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "#1a1a1a",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "right",
        }}
      >
        {valor}
      </span>
    </div>
  );
}
