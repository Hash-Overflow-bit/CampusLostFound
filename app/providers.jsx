import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../AuthContext/AuthContext";

export default function AppProviders({ children }) {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
