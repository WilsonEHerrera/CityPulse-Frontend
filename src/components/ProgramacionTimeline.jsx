import { sharedStyles } from "../styles/shared";

function formatFechaCorta(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function esFechaHoy(iso) {
  const d = new Date(iso);
  const hoy = new Date();
  return (
    d.getDate() === hoy.getDate() &&
    d.getMonth() === hoy.getMonth() &&
    d.getFullYear() === hoy.getFullYear()
  );
}

function esFechaFutura(iso) {
  return new Date(iso) > new Date();
}

function BarrioTag({ nombre, busqueda, hoy, pasado }) {
  const coincide =
    busqueda && nombre.toLowerCase().includes(busqueda.toLowerCase());

  if (!coincide) {
    return (
      <span
        style={{
          fontSize: 11,
          padding: "2px 8px",
          borderRadius: 4,
          backgroundColor: hoy ? "#fee2e2" : pasado ? "#f7f7f5" : "#f1f5f9",
          color: hoy ? "#dc2626" : pasado ? "#a3a3a3" : "#475569",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          border: "1px solid",
          borderColor: hoy ? "#fca5a5" : pasado ? "#e5e5e3" : "#e2e8f0",
        }}
      >
        {nombre}
      </span>
    );
  }

  const idx = nombre.toLowerCase().indexOf(busqueda.toLowerCase());
  const antes = nombre.slice(0, idx);
  const match = nombre.slice(idx, idx + busqueda.length);
  const despues = nombre.slice(idx + busqueda.length);

  return (
    <span
      style={{
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 4,
        backgroundColor: "#fef9c3",
        color: "#1a1a1a",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        border: "1px solid #fde047",
        fontWeight: 500,
      }}
    >
      {antes}
      <mark
        style={{
          backgroundColor: "#fbbf24",
          color: "#1a1a1a",
          borderRadius: 2,
          padding: "0 1px",
        }}
      >
        {match}
      </mark>
      {despues}
    </span>
  );
}

export default function ProgramacionTimeline({
  programaciones,
  busqueda = "",
}) {
  if (!programaciones || programaciones.length === 0) {
    return <p style={sharedStyles.muted}>No hay programaciones registradas.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {programaciones.map((p, i) => {
        const hoy = esFechaHoy(p.fecha);
        const futuro = esFechaFutura(p.fecha);
        const pasado = !hoy && !futuro;

        return (
          <div key={i} style={{ display: "flex", gap: 16 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 24,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: hoy
                    ? "#dc2626"
                    : pasado
                      ? "#d1d5db"
                      : "#6366f1",
                  flexShrink: 0,
                  marginTop: 4,
                  zIndex: 1,
                }}
              />
              {i < programaciones.length - 1 && (
                <div
                  style={{
                    width: 1,
                    flex: 1,
                    backgroundColor: "#e5e5e3",
                    marginTop: 4,
                  }}
                />
              )}
            </div>

            <div style={{ flex: 1, paddingBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    color: hoy ? "#dc2626" : "#1a1a1a",
                  }}
                >
                  {formatFechaCorta(p.fecha)}
                  {hoy && " — Hoy"}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#737373",
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                  }}
                >
                  {p.horario}
                </span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {p.barrios.map((b, j) => (
                  <BarrioTag
                    key={j}
                    nombre={b}
                    busqueda={busqueda}
                    hoy={hoy}
                    pasado={pasado}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}