import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "swimming-wherever-might-facial.trycloudflare.com",
      "worship-guide-annie-quick.trycloudflare.com",
    ],
  },
});