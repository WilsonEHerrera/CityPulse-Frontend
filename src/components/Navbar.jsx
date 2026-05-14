import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useIsMobile } from "../hooks/useIsMobile";

export default function Navbar() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/cortes", label: "Cortes" },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link href="/" style={styles.brand}>
          CityPulse
          <span style={styles.brandSub}>Cartagena</span>
        </Link>

        {isMobile ? (
          <>
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              style={styles.hamburger}
              aria-label="Menu"
            >
              <span style={styles.hamburgerLine} />
              <span style={styles.hamburgerLine} />
              <span style={styles.hamburgerLine} />
            </button>
            {menuAbierto && (
              <div style={styles.mobileMenu}>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuAbierto(false)}
                    style={{
                      ...styles.mobileLink,
                      ...(router.pathname === l.href
                        ? styles.mobileLinkActive
                        : {}),
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={styles.links}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  ...styles.link,
                  ...(router.pathname === l.href ? styles.linkActive : {}),
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    borderBottom: "1px solid #e5e5e3",
    backgroundColor: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  brand: {
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    fontFamily: "Georgia, serif",
    color: "#1a1a1a",
    display: "flex",
    alignItems: "baseline",
    gap: 6,
  },
  brandSub: {
    fontSize: 11,
    fontWeight: 400,
    color: "#a3a3a3",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    letterSpacing: "0.04em",
  },
  links: {
    display: "flex",
    gap: 4,
  },
  link: {
    fontSize: 14,
    color: "#737373",
    padding: "6px 12px",
    borderRadius: 6,
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
  },
  linkActive: {
    color: "#1a1a1a",
    backgroundColor: "#f7f7f5",
  },
  hamburger: {
    background: "none",
    border: "none",
    padding: 8,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    cursor: "pointer",
  },
  hamburgerLine: {
    display: "block",
    width: 20,
    height: 2,
    backgroundColor: "#1a1a1a",
    borderRadius: 2,
  },
  mobileMenu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e5e3",
    display: "flex",
    flexDirection: "column",
    padding: "8px 12px 12px",
    gap: 2,
    zIndex: 99,
  },
  mobileLink: {
    fontSize: 15,
    color: "#737373",
    padding: "10px 12px",
    borderRadius: 8,
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
  },
  mobileLinkActive: {
    color: "#1a1a1a",
    backgroundColor: "#f7f7f5",
  },
};
