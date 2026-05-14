import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { cortesMock } from "../data/cortes";
import { BadgeServicio, BadgeEstado } from "../components/BadgeServicio";
import { useRouter } from "next/router";

const TODOS_BARRIOS = [...new Set(cortesMock.flatMap((c) => c.barrios))].sort();

export default function Alertas() {
  const router = useRouter();
  const [guardados, setGuardados] = useState([]);
  const [inputBarrio, setInputBarrio] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("barrios_guardados");
    if (saved) setGuardados(JSON.parse(saved));
  }, []);

  const guardar = (barrio) => {
    if (guardados.includes(barrio)) return;
    const nuevos = [...guardados, barrio];
    setGuardados(nuevos);
    localStorage.setItem("barrios_guardados", JSON.stringify(nuevos));
    setInputBarrio("");
  };

  const eliminar = (barrio) => {
    const nuevos = guardados.filter((b) => b !== barrio);
    setGuardados(nuevos);
    localStorage.setItem("barrios_guardados", JSON.stringify(nuevos));
  };

  const cortesRelevantes = cortesMock.filter(
    (c) =>
      c.estado !== "finalizado" && c.barrios.some((b) => guardados.includes(b)),
  );

  const sugerencias = TODOS_BARRIOS.filter(
    (b) =>
      b.toLowerCase().includes(inputBarrio.toLowerCase()) &&
      inputBarrio.length > 0 &&
      !guardados.includes(b),
  ).slice(0, 5);

  return (
    <Layout>
      <div className="mb-4">
        <h1
          style={{ fontWeight: 700, fontSize: "1.6rem", marginBottom: "4px" }}
        >
          Mis barrios
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
          }}
        >
          Guarda tus barrios para ver cortes que te afectan · Sin cuenta ni
          login
        </p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "24px",
            }}
          >
            <h6
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "14px",
              }}
            >
              Agregar barrio
            </h6>

            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Ej: Bocagrande, Manga..."
                value={inputBarrio}
                onChange={(e) => setInputBarrio(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />

              {sugerencias.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    marginTop: "4px",
                    zIndex: 10,
                    overflow: "hidden",
                  }}
                >
                  {sugerencias.map((b) => (
                    <div
                      key={b}
                      onClick={() => guardar(b)}
                      style={{
                        padding: "10px 14px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontFamily: "var(--font-mono)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "var(--border)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "transparent")
                      }
                    >
                      + {b}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3">
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginBottom: "10px",
                }}
              >
                Barrios disponibles:
              </p>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {TODOS_BARRIOS.map((b) => (
                  <div
                    key={b}
                    onClick={() => guardar(b)}
                    className="chip-barrio"
                    style={{
                      cursor: "pointer",
                      display: "inline-block",
                      margin: "3px",
                      ...(guardados.includes(b)
                        ? {
                            background: "rgba(63,185,80,0.15)",
                            borderColor: "rgba(63,185,80,0.4)",
                            color: "var(--accent-ok)",
                          }
                        : {}),
                    }}
                  >
                    {guardados.includes(b) ? "✓ " : ""}
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {guardados.length > 0 && (
              <div className="mt-4">
                <h6
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "10px",
                  }}
                >
                  Mis barrios guardados
                </h6>
                {guardados.map((b) => (
                  <div
                    key={b}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <span className="chip-barrio guardado">{b}</span>
                    <button
                      onClick={() => eliminar(b)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-md-8">
          <h6
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "14px",
            }}
          >
            Cortes que te afectan ({cortesRelevantes.length})
          </h6>

          {guardados.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🏘️</div>
              <p>
                Guarda tus barrios para ver los cortes que te afectan
                directamente.
              </p>
            </div>
          ) : cortesRelevantes.length === 0 ? (
            <div className="empty-state">
              <div className="icon"></div>
              <p>¡Sin cortes activos ni programados en tus barrios!</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {cortesRelevantes.map((c) => (
                <div
                  key={c.id}
                  onClick={() => router.push(`/corte/${c.id}`)}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "18px",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor =
                      "var(--accent-energia)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <BadgeServicio servicio={c.servicio} />
                    <BadgeEstado estado={c.estado} />
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: "6px" }}>
                    {c.titulo}
                  </div>
                  <div
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Barrios tuyos afectados:{" "}
                    <strong style={{ color: "var(--accent-ok)" }}>
                      {c.barrios
                        .filter((b) => guardados.includes(b))
                        .join(", ")}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}