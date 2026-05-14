const config = {
  programado: { label: "Programado", bg: "#ede9fe", color: "#6366f1" },
  en_curso: { label: "En curso", bg: "#fee2e2", color: "#dc2626" },
  finalizado: { label: "Finalizado", bg: "#dcfce7", color: "#16a34a" },
};

export default function EstadoBadge({ estado }) {
  const c = config[estado] || {
    label: estado,
    bg: "#f5f5f4",
    color: "#737373",
  };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        backgroundColor: c.bg,
        color: c.color,
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        letterSpacing: "0.01em",
      }}
    >
      {c.label}
    </span>
  );
}