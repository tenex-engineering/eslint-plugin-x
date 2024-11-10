export function ts(strings: TemplateStringsArray) {
  return strings
    .map((string) =>
      string
        .split('\n')
        .map((sub) => sub.trim())
        .join('\n'),
    )
    .join('\n')
}
