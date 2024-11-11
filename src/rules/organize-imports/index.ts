import { createRule } from '#package/tests/rule-creator.js'

export default createRule({
  name: 'organize-imports',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Organize imports.',
    },
    messages: {
      avoidMultipleSpecifiersImports:
        'Avoid multiple specifiers on import declarations.',
      avoidUnsortedImports:
        'Import declarations should be sorted by the specifier.',
    },
    schema: [],
  },
  defaultOptions: [],
  create: (context) => ({
    Program: (program) => {
      const sourceCode = context.sourceCode
      const importDeclarations = program.body.filter(
        (declaration) => declaration.type === 'ImportDeclaration',
      )

      if (importDeclarations.length === 0) {
        return
      }

      if (
        importDeclarations.some(
          (declaration) => declaration.specifiers.length > 1,
        )
      ) {
        for (const declaration of importDeclarations) {
          if (declaration.specifiers.length <= 1) {
            continue
          }

          context.report({
            node: declaration,
            messageId: 'avoidMultipleSpecifiersImports',
            fix: (fixer) => {
              const fix = declaration.specifiers
                .map((specifier) => {
                  if (specifier.type === 'ImportSpecifier') {
                    const segments = [`import`]

                    if (declaration.importKind === 'type') {
                      segments.push('type')
                    }

                    segments.push(`{`)

                    if (specifier.importKind === 'type') {
                      segments.push('type')
                    }

                    const importedName =
                      'name' in specifier.imported
                        ? specifier.imported.name
                        : specifier.imported.value

                    if (importedName !== specifier.local.name) {
                      segments.push(`${importedName} as`)
                    }

                    segments.push(
                      `${specifier.local.name} } from '${declaration.source.value}'`,
                    )

                    return segments.join(' ')
                  }

                  if (specifier.type === 'ImportDefaultSpecifier') {
                    const segments = ['import']

                    if (declaration.importKind === 'type') {
                      segments.push('type')
                    }

                    segments.push(
                      `${specifier.local.name} from '${declaration.source.value}'`,
                    )

                    return segments.join(' ')
                  }

                  if (specifier.type === 'ImportNamespaceSpecifier') {
                    return `import * as ${specifier.local.name} from '${declaration.source.value}'`
                  }
                })
                .join('\n')

              return fixer.replaceText(declaration, fix)
            },
          })
        }

        return
      }

      const sortedDeclarations = importDeclarations.toSorted((a, b) => {
        const aa = a.specifiers[0]?.local.name
        const bb = b.specifiers[0]?.local.name

        if (aa == null && bb == null) {
          return 0
        }

        if (aa == null) {
          return -1
        }

        if (bb == null) {
          return 1
        }

        return aa.localeCompare(bb)
      })

      const firstOutOfSortDeclaration = sortedDeclarations.find(
        (declaration, index) => declaration !== importDeclarations[index],
      )

      if (firstOutOfSortDeclaration == null) {
        return
      }

      context.report({
        node: firstOutOfSortDeclaration,
        messageId: 'avoidUnsortedImports',
        fix: (fixer) => {
          const fix = sortedDeclarations
            .flatMap((declaration) => {
              const comments = sourceCode.getCommentsBefore(declaration)

              const preserveLeadingComments = (() => {
                const lastComment = comments[comments.length - 1]

                if (lastComment == null) {
                  return true
                }

                return (
                  declaration.loc.start.line - lastComment.loc.end.line <= 1
                )
              })()

              return [
                ...(preserveLeadingComments
                  ? comments.map((comment) => sourceCode.getText(comment))
                  : []),
                sourceCode.getText(declaration),
              ]
            })
            .join('\n')

          const start = importDeclarations[0]?.range[0]
          const end =
            importDeclarations[importDeclarations.length - 1]?.range[1]

          return fixer.replaceTextRange(
            [
              start as NonNullable<typeof start>,
              end as NonNullable<typeof end>,
            ],
            fix,
          )
        },
      })
    },
  }),
})
