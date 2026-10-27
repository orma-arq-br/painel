import { cloudflare } from "@cloudflare/vite-plugin"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  // Always 3000, or fail: Google only sends people back to the address
  // registered on the OAuth client, http://localhost:3000.
  server: { port: 3000, strictPort: true },
  plugins: [
    // Runs the server side in workerd, the same runtime as production, with
    // the local D1 database bound as DB.
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    viteReact(),
  ],
})
