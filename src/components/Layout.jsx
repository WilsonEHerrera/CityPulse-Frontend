import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main
        className="container-fluid py-4 px-3 px-md-4"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        {children}
      </main>
      <footer
        className="text-center py-4 mt-4"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
        }}
      >
        CortesCtg · Datos de Afinia y Acuacar · Proyecto académico
      </footer>
    </div>
  );
}