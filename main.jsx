import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/design-system.css";
import "./componenets/herosection/logo-marquee-overrides.css";
import "./styles/homepage-polish.css";
import "./utils/scrollReveal.js";
import App from "./App.jsx";
import AppProviders from "./app/providers.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
