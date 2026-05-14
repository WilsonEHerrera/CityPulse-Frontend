import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { noticiasService } from "../services/api";
import { useIsMobile } from "../hooks/useIsMobile";
import { sharedStyles } from "../styles/shared";
import CorteCard from "../components/CorteCard";
import Spinner from "../components/Spinner";

function formatRelativo(iso) {
  const d = new Date(iso);
  const ahora = new Date();
  const diff = Math.floor((ahora - d) / 60000);
  if (diff < 60) return `hace ${diff} min`;
  if (diff < 1440) return `hace ${Math.floor(diff / 60)} h`;
  return `hace ${Math.floor(diff / 1440)} d`;
}

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [cortes, setCortes] = useState([]);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
    cargarInicial();
  }, []);

  async function cargarInicial() {
    try {
      const res = await noticiasService.getAll({ limit: 5 });
      setCortes(res.data ?? []);
      setUltimaActualizacion(new Date().toISOString());
    } catch (err) {
      console.error("Error cargando cortes:", err);
    } finally {
      setCargandoInicial(false);
    }
  }

  async function buscar(q) {
    if (!q.trim()) {
      setResultados(null);
      return;
    }
    setBuscando(true);
    setResultados(null);
    try {
      const res = await noticiasService.getAll({ barrio: q });
      setResultados(res.data ?? []);
    } catch (err) {
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter") buscar(query);
  };

  const listaActiva = resultados !== null ? resultados : cortes;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 280px",
        gap: isMobile ? 24 : 32,
        alignItems: "start",
      }}
    >
      {/* Columna principal */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Buscador */}
        <div style={{ paddingBottom: 20, borderBottom: "1px solid #e5e5e3" }}>
          <h1
            style={{
              fontSize: isMobile ? 20 : 22,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              marginBottom: 6,
              lineHeight: 1.2,
            }}
          >
            Consulta cortes en tu barrio
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#737373",
              lineHeight: 1.6,
              marginBottom: 14,
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
            }}
          >
            Informacion extraida automaticamente de Acuacar. Ultima
            actualizacion{" "}
            <strong>
              {mounted && ultimaActualizacion
                ? formatRelativo(ultimaActualizacion)
                : "—"}
            </strong>
            .
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Escribe tu barrio..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1px solid #e5e5e3",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                color: "#1a1a1a",
                backgroundColor: "#ffffff",
                outline: "none",
                minWidth: 0,
              }}
              autoFocus={!isMobile}
            />
            <button
              onClick={() => buscar(query)}
              disabled={buscando}
              style={{
                padding: "10px 16px",
                backgroundColor: "#1a1a1a",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                fontWeight: 500,
                whiteSpace: "nowrap",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {buscando ? "Buscando..." : "Consultar"}
            </button>
          </div>
        </div>

        {/* Estado de busqueda */}
        {buscando && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#737373",
              fontSize: 14,
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
            }}
          >
            <Spinner />
            <span>
              Buscando cortes para <em>{query}</em>...
            </span>
          </div>
        )}

        {/* Sin resultados */}
        {resultados !== null && resultados.length === 0 && !buscando && (
          <div>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>
              No se encontraron cortes para &ldquo;{query}&rdquo;
            </p>
            <p style={sharedStyles.muted}>
              Puede que no haya interrupciones en esa zona o que el nombre no
              coincida exactamente.
            </p>
            <button
              onClick={() => {
                setResultados(null);
                setQuery("");
              }}
              style={{
                marginTop: 12,
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
              Ver todos los cortes
            </button>
          </div>
        )}

        {/* Resultados o lista inicial */}
        {!buscando &&
          (cargandoInicial ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#737373",
                fontSize: 14,
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
              }}
            >
              <Spinner />
              <span>Cargando informacion...</span>
            </div>
          ) : (
            listaActiva.length > 0 && (
              <div>
                {resultados !== null && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <p style={sharedStyles.sectionLabel(false)}>
                      {resultados.length} resultado
                      {resultados.length !== 1 ? "s" : ""} para &ldquo;{query}
                      &rdquo;
                    </p>
                    <button
                      onClick={() => {
                        setResultados(null);
                        setQuery("");
                      }}
                      style={{
                        fontSize: 12,
                        color: "#737373",
                        background: "none",
                        border: "none",
                        padding: 0,
                        textDecoration: "underline",
                        textUnderlineOffset: 3,
                        cursor: "pointer",
                        fontFamily: "ui-sans-serif, system-ui, sans-serif",
                      }}
                    >
                      Limpiar
                    </button>
                  </div>
                )}
                {resultados === null && (
                  <p style={sharedStyles.sectionLabel(false)}>
                    {cortes.length} corte{cortes.length !== 1 ? "s" : ""}{" "}
                    registrado{cortes.length !== 1 ? "s" : ""}
                  </p>
                )}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {listaActiva.map((c) => (
                    <CorteCard
                      key={c._id}
                      corte={c}
                      onClick={() =>
                        router.push(
                          `/cortes/${c._id}${query ? `?q=${encodeURIComponent(query)}` : ""}`,
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )
          ))}
      </div>

      {/* Aside */}
      <aside
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
            gap: 10,
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
            Informacion actualizada
          </p>
          <p style={sharedStyles.muted}>
            {mounted && ultimaActualizacion
              ? `Consultamos la base de datos ${formatRelativo(ultimaActualizacion)} y mostramos la informacion mas reciente disponible.`
              : "Cargando..."}
          </p>
          <div style={{ borderTop: "1px solid #e5e5e3", margin: "2px 0" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#1a1a1a",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                }}
              >
                Acuacar
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "#a3a3a3",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                }}
              >
                {mounted && ultimaActualizacion
                  ? `Revisada ${formatRelativo(ultimaActualizacion)}`
                  : "—"}
              </p>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 999,
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                backgroundColor: "#dcfce7",
                color: "#16a34a",
              }}
            >
              Al dia
            </span>
          </div>
        </div>

        {/* Resumen rapido */}
        {!cargandoInicial && cortes.length > 0 && (
          <div
            style={{
              border: "1px solid #e5e5e3",
              borderRadius: 10,
              padding: "16px 18px",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: 10,
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
              Resumen
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <ResumenFila label="Total de cortes" valor={cortes.length} />
              <ResumenFila
                label="Barrios afectados"
                valor={cortes.reduce(
                  (acc, c) =>
                    acc +
                    (c.programaciones?.reduce(
                      (a, p) => a + p.barrios.length,
                      0,
                    ) ?? 0),
                  0,
                )}
              />
              <ResumenFila
                label="Dias de corte"
                valor={cortes.reduce(
                  (acc, c) => acc + (c.programaciones?.length ?? 0),
                  0,
                )}
              />
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function ResumenFila({ label, valor }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
          fontWeight: 600,
          color: "#1a1a1a",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {valor}
      </span>
    </div>
  );
}
