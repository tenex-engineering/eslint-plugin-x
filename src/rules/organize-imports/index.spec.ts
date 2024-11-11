import rule from './index'
import { ruleTester } from '#package/tests/rule-tester'
import { ts } from '#package/utils/tagged-templates'

ruleTester.run('organize-imports', rule, {
  valid: [
    ts`
      import type { foo } from 'bar'
    `,

    ts`
      import { foo } from 'bar'
      import { goo } from 'bar'
    `,
  ],

  invalid: [
    {
      errors: [{ messageId: 'avoidMultipleSpecifiersImports' }],
      code: ts`
        import { foo, goo } from 'bar'
      `,
      output: ts`
        import { foo } from 'bar'
        import { goo } from 'bar'
      `,
    },

    {
      errors: [{ messageId: 'avoidMultipleSpecifiersImports' }],
      code: ts`
        import { type foo, type goo } from 'bar'
      `,
      output: ts`
        import { type foo } from 'bar'
        import { type goo } from 'bar'
      `,
    },

    {
      errors: [{ messageId: 'avoidMultipleSpecifiersImports' }],
      code: ts`
        import type { foo, goo } from 'bar'
      `,
      output: ts`
        import type { foo } from 'bar'
        import type { goo } from 'bar'
      `,
    },

    {
      errors: [{ messageId: 'avoidUnsortedImports' }],
      code: ts`
        import { goo } from 'bar'
        // comment
        import { foo } from 'bar'
      `,
      output: ts`
        // comment
        import { foo } from 'bar'
        import { goo } from 'bar'
      `,
    },

    {
      errors: [{ messageId: 'avoidUnsortedImports' }],
      code: ts`
        import { goo } from 'bar'
        import { foo as doo } from 'bar'
        `,
      output: ts`
        import { foo as doo } from 'bar'
        import { goo } from 'bar'
      `,
    },
  ],
})
