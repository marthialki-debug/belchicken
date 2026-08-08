import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (or SSR ...)
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Belchiken",
        short_name: "Belchiken",
        description: "Le poulet frit qui craque vraiment",
        theme_color: "#FF6B00",
        background_color: "#1a1a1a",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});