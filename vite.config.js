import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["48a6-223-177-160-54.ngrok-free.app"], // 👈 Allow ngrok host
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
    },
  },
});
