export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.aviso}>
          <p style={styles.avisoTexto}>
            La informacion presentada en esta plataforma es extraida
            automaticamente del portal oficial de{" "}
            <a
              href="https://www.acuacar.com"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              Acuacar
            </a>
            . Este sitio no tiene ninguna relacion comercial con dicha empresa
            ni recibe financiamiento de ella. Su unico proposito es facilitar el
            acceso ciudadano a informacion de interes publico que ya es de libre
            consulta.
          </p>
          <p style={styles.avisoTexto}>
            Plataforma desarrollada con fines academicos e investigativos en el
            marco de un proyecto universitario. No nos hacemos responsables por
            imprecisiones en la informacion publicada por la fuente original.
            Para datos oficiales y actualizados, consulte directamente el portal
            de Acuacar.
          </p>
        </div>
        <div style={styles.meta}>
          <p style={styles.metaTexto}>
            Proyecto academico - Fundacion Universitaria Tecnologico Comfenalco
          </p>
          <p style={styles.metaTexto}>
            Fuente:{" "}
            <a
              href="https://www.acuacar.com"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              acuacar.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    borderTop: "1px solid #e5e5e3",
    marginTop: 64,
    backgroundColor: "#f7f7f5",
  },
  inner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  aviso: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxWidth: 760,
  },
  avisoTexto: {
    fontSize: 13,
    color: "#737373",
    lineHeight: 1.7,
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
  },
  meta: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    paddingTop: 16,
    borderTop: "1px solid #e5e5e3",
  },
  metaTexto: {
    fontSize: 12,
    color: "#a3a3a3",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
  },
  link: {
    color: "#525252",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
};
