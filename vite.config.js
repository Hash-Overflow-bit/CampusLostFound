import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { assistantDevPlugin } from "./server/assistantDevPlugin.js";

export default defineConfig(({ mode, command }) => {
  if (command === "serve") {
    const env = loadEnv(mode, process.cwd(), "");
    for (const key of ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY", "VITE_SUPABASE_ANON_KEY", "GEMINI_API_KEY", "GEMINI_MODEL", "GEMINI_FALLBACK_MODEL"]) {
      if (env[key]) process.env[key] = env[key];
    }
  }
  return {
    plugins: [react(), assistantDevPlugin()],
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 600,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  };
});
