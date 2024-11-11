import { ESLintUtils } from '@typescript-eslint/utils'

export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/tenex-engineering/eslint-plugin-x/rules/${name}/README.md`,
)
