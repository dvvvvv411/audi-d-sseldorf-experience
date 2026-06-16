import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    allowedHosts: [
      "audi-duesseldorf.de",
      "www.audi-duesseldorf.de",
      "berlin-audi-zentrum.de",
      "www.berlin-audi-zentrum.de",
      "audi-portal.de",
      "berlin.audi-portal.de",
      "vw-dusseldorf.de",
      "www.vw-dusseldorf.de",
    ],
    cors: {
      origin: [
        "https://audi-duesseldorf.de",
        "https://www.audi-duesseldorf.de",
        "https://berlin-audi-zentrum.de",
        "https://www.berlin-audi-zentrum.de",
        "https://audi-portal.de",
        "https://berlin.audi-portal.de",
        "https://vw-dusseldorf.de",
        "https://www.vw-dusseldorf.de",
      ],
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
