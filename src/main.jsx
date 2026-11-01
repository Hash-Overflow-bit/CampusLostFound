import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AppProviders from "./app/providers";
import "./styles/globals.css";

const loadBootstrapAssets = () => {
  if (!document.querySelector('link[href*="bootstrap"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    link.crossOrigin = "anonymous";
    link.media = "print";
    link.onload = function () {
      this.media = "all";
    };
    document.head.appendChild(link);
  }

  if (!document.querySelector('script[src*="bootstrap.bundle"]')) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadBootstrapAssets, { once: true });
} else {
  loadBootstrapAssets();
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Application root element was not found");

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);
