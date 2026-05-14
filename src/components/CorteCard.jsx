import EstadoBadge from "./EstadoBadge";
import { sharedStyles } from "../styles/shared";

function formatFecha(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatHora(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

export default function CorteCard({ corte, onClick }) {
  const primera = corte.programaciones?.[0];
  const ultima = corte.programaciones?.[corte.programaciones.length - 1];
  const totalBarrios =
    corte.programaciones?.reduce((acc, p) => acc + p.barrios.length, 0) ?? 0;
  const dias = corte.programaciones?.length ?? 0;

  return (
    <div
      style={{
        ...sharedStyles.card,
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.15s",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick)
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
        <span
          style={{
            fontSize: 11,
            color: "#a3a3a3",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          {dias} dia{dias !== 1 ? "s" : ""} de corte
        </span>
      </div>

      {/* Descripcion */}
      <p
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "#1a1a1a",
          lineHeight: 1.4,
          textTransform: "capitalize",
        }}
      >
        {corte.descripcion.toLowerCase()}
      </p>

      {/* Fechas */}
      {primera && ultima && (
        <p
          style={{
            fontSize: 12,
            color: "#737373",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          {formatFecha(primera.fecha)} &ndash; {formatFecha(ultima.fecha)}
        </p>
      )}

      {/* Horario */}
      {primera?.horario && (
        <p
          style={{
            fontSize: 12,
            color: "#525252",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          Horario: {primera.horario}
        </p>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 4,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#a3a3a3",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          {totalBarrios} barrio{totalBarrios !== 1 ? "s" : ""} afectado
          {totalBarrios !== 1 ? "s" : ""}
        </span>
        {onClick && (
          <span
            style={{
              fontSize: 12,
              color: "#1a1a1a",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Ver detalle &rarr;
          </span>
        )}
      </div>
    </div>
  );
}
