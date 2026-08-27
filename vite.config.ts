// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // No Nitro: the site is one prerendered page served as static files, so the
  // Cloudflare worker output it produces is not needed and its .output/ layout
  // is what breaks the prerender preview server.
  nitro: false,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Prerender the one route to real HTML so the build can be served by a
    // static host. Without this the output has no index.html at all — the
    // markup is produced per request by the server bundle.
    pages: [{ path: "/", prerender: { enabled: true } }],
  },
});
