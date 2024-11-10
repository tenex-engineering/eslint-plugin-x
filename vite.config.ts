/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '#package': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  test: {
    setupFiles: [
      fileURLToPath(new URL('./src/tests/setup.ts', import.meta.url)),
    ],
  },
})
