import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        include: ['src/*'],
      },
      setupFiles: [
        fileURLToPath(
          new URL('./src/testing/vitest-setup.ts', import.meta.url),
        ),
      ],
    },
  }),
)
