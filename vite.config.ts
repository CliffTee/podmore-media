import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const blogArticleInputs = Object.fromEntries(
  readdirSync("blog")
    .filter((fileName) => fileName.endsWith(".html"))
    .map((fileName) => [
      `blog-${fileName.replace(/\.html$/, "")}`,
      join("blog", fileName),
    ]),
);

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        blog: "blog.html",
        ebook: "easy-ai-marketing-for-plumbers.html",
        ...blogArticleInputs,
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
