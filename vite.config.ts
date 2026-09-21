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
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
      // 8 KB of CSS: inline it rather than spend a render-blocking round-trip on it.
      server: { build: { inlineCss: true } },
    }),
    // Nitro bundles the server separately and doesn't inherit `build`.
    nitro({ rolldownConfig: { onwarn: quietBuild.rolldownOptions?.onwarn } }),
    // react's plugin must come after start's
    viteReact(),
  ],
})
