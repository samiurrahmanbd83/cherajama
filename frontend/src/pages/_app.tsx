import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Manrope, Playfair_Display } from "next/font/google";
import { useRouter } from "next/router";
import FloatingChatButtons from "../components/FloatingChatButtons";
import AnnouncementBar from "../components/AnnouncementBar";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import { CartProvider } from "../context/CartContext";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith("/admin");
  const isAuth = router.pathname === "/signin" || router.pathname === "/signup";
  const content = <Component {...pageProps} />;

  return (
    <CartProvider>
      <div className={`${manrope.variable} ${playfair.variable}`} style={{ fontFamily: "var(--font-sans)" }}>
        {!isAdmin && <AnnouncementBar />}
        {!isAdmin && <Navbar />}
        {content}
        {!isAdmin && !isAuth && <SiteFooter />}
        {!isAdmin && <FloatingChatButtons />}
      </div>
    </CartProvider>
  );
}
