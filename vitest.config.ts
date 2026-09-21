import { defineConfig } from 'vitest/config'

// Kept separate from vite.config.ts so unit tests don't boot the Start/Nitro build.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ['tests/**/*.test.ts'],
  },
})
