import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        ebook: "easy-ai-marketing-for-plumbers.html",
      },
    },
  },
  server: {
    allowedHosts: [
      "swimming-wherever-might-facial.trycloudflare.com",
      "worship-guide-annie-quick.trycloudflare.com",
    ],
  },
});
