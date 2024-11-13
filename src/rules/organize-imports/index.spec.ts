import rule from './index.js'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { ts } from '#package/testing/utils/tagged-templates.js'

export const ruleTester = new RuleTester()

ruleTester.run('organize-imports', rule, {
  valid: [
    ts`
      import type { a } from 'module'
    `,

    ts`
      import { a } from 'module'
      import { b } from 'module'
    `,
  ],

  invalid: [
    {
      errors: [{ messageId: 'avoidMultipleSpecifiersImports' }],
      code: ts`
        import { a, b } from 'module'
      `,
      output: ts`
        import { a } from 'module'
        import { b } from 'module'
      `,
    },

    {
      errors: [{ messageId: 'avoidMultipleSpecifiersImports' }],
      code: ts`
        import { type a, type b } from 'module'
      `,
      output: ts`
        import { type a } from 'module'
        import { type b } from 'module'
      `,
    },

    {
      errors: [{ messageId: 'avoidMultipleSpecifiersImports' }],
      code: ts`
        import type { a, b } from 'module'
      `,
      output: ts`
        import type { a } from 'module'
        import type { b } from 'module'
      `,
    },

    {
      errors: [{ messageId: 'avoidUnsortedImports' }],
      code: ts`
        import { b } from 'module'
        // comment
        import { a } from 'module'
      `,
      output: ts`
        // comment
        import { a } from 'module'
        import { b } from 'module'
      `,
    },

    {
      errors: [{ messageId: 'avoidUnsortedImports' }],
      code: ts`
        import { b } from 'module'
        import { c as a } from 'module'
        `,
      output: ts`
        import { c as a } from 'module'
        import { b } from 'module'
      `,
    },
  ],
})
