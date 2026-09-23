import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { type BuildEnvironmentOptions, defineConfig } from 'vite'

// TanStack Router ships "use client" markers for RSC setups; they're
// meaningless in this bundle and drown out real warnings.
const quietBuild: BuildEnvironmentOptions = {
  rolldownOptions: {
    onwarn(warning, warn) {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
      warn(warning)
    },
  },
}

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  build: quietBuild,
  plugins: [
    tailwindcss(),
    tanstackStart({
      // The landing page is content that changes rarely: ship it as static HTML
      // and hydrate. Live ledger figures are fetched client-side on top.
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: true,
        // A section link ("/#work") is the same page, not a new one. Crawled as pages, each
        // was written over index.html, and on Linux one of those writes came out empty.
        filter: ({ path }) => !path.includes('#'),
      },
      // 8 KB of CSS: inline it rather than spend a render-blocking round-trip on it.
      server: { build: { inlineCss: true } },
    }),
    // Nitro bundles the server separately and doesn't inherit `build`.
    nitro({
      rolldownConfig: { onwarn: quietBuild.rolldownOptions?.onwarn },
      routeRules: {
        // Screenshots aren't content-hashed (they're re-captured in place), so cache
        // for a day and revalidate in the background rather than for a year.
        '/work/**': { headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } },
      },
    }),
    // react's plugin must come after start's
    viteReact(),
  ],
})
