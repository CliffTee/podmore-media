import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        ebook: "easy-ai-marketing-for-plumbers.html",
        blogTradesmenWebsite: "blog/tradesmen-website-what-matters.html",
        blogAiVsTraditional: "blog/ai-vs-traditional-marketing-local-trades-2026.html",
        blogEmergencyCallOuts: "blog/emergency-call-outs-ai-plumbers.html",
        blogGoogleBusinessProfile: "blog/google-business-profile-not-working.html",
        blogGetFoundOnGoogle: "blog/get-found-on-google-tradespeople.html",
        blogGoogleReviews: "blog/how-to-ask-customers-for-google-reviews.html",
        blogAiSearchTradespeople: "blog/how-tradespeople-can-make-their-business-easier-to-find-in-ai-search.html",
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
