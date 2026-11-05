import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import NetworkStatus from "../state/NetworkStatus";
import CampusAssistant from "../../features/assistant/components/CampusAssistant";

const Navbar = lazy(() => import("../../componenets/navbar/Navbar"));
const Footer = lazy(() => import("../../componenets/footer/Footer"));

const CHROMELESS_ROUTES = new Set(["/login", "/signup", "/forgot-password", "/update-password"]);
const NO_FOOTER_ROUTES = new Set(["/dashboard", "/report"]);

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const showChrome = !CHROMELESS_ROUTES.has(pathname);
  const showFooter = showChrome && !NO_FOOTER_ROUTES.has(pathname);

  return (
    <div className="app-shell">
      <NetworkStatus />
      {showChrome && (
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      )}
      <div className="app-shell__content">{children}</div>
      <CampusAssistant />
      {showFooter && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}
