import Footer from "@/components/Footer";
import Navbar from "../components/Navbar";
import "@/styles/globals.css";
import AlertaBanner from "@/components/AlertBanner";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <AlertaBanner/>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}
