import { estadoLabel, servicioLabel } from "../data/cortes";

export function BadgeServicio({ servicio }) {
  const s = servicioLabel[servicio];
  return (
    <span className={`badge-${servicio}`}>
      {s.icon} {s.label}
    </span>
  );
}

export function BadgeEstado({ estado }) {
  const e = estadoLabel[estado];
  return <span className={`badge-estado-${estado}`}>{e.label}</span>;
}
