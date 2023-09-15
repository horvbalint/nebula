export function createDateIfPossible(value: any) {
  if (value instanceof Date)
    return value

  const maybeDate = new Date(value)

  if (Number.isNaN(maybeDate.getTime()))
    return null

  if (maybeDate.toISOString() === value)
    return maybeDate

  return null
}
