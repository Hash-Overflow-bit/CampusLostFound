import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";

const Navbar = lazy(() => import("../../componenets/navbar/Navbar"));
const Footer = lazy(() => import("../../componenets/footer/Footer"));

const CHROMELESS_ROUTES = new Set(["/login", "/signup"]);

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const showChrome = !CHROMELESS_ROUTES.has(pathname);

  return (
    <div className="app-shell">
      {showChrome && (
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      )}
      <div className="app-shell__content">{children}</div>
      {showChrome && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}
