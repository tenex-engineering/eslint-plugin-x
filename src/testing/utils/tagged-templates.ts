export function ts(strings: TemplateStringsArray) {
  return strings
    .map((string) =>
      string
        .split('\n')
        .map((line) => line.trim())
        .join('\n'),
    )
    .join('\n')
}
