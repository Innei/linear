import pluralize from 'pluralize'

export const pluralizeWord = (count: number, word: string) => {
  return pluralize(word, count)
}
