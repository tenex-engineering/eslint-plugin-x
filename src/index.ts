import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import * as fs from 'node:fs'
import organizeImports from '#package/rules/organize-imports/index.js'

const { name, version } = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'),
)

const base: FlatConfig.Plugin = {
  meta: { name, version },
  rules: {
    'organize-imports': organizeImports,
  },
}

const final = {
  ...base,
  configs: {
    recommended: [
      {
        plugins: {
          x: base,
        },
        rules: {
          'x/organize-imports': 'warn',
        },
      },
    ],
  },
} satisfies FlatConfig.Plugin

const eslintPluginX = final

export default eslintPluginX
