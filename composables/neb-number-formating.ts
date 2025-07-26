export function useCurrencyFormat(num: number, precision?: number) {
  const num_parts = useRoundNumberTo(num, precision).toString().split('.')
  num_parts[0] = num_parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return num_parts.join(',')
}
export function useRoundNumberTo(value: number, precision = 2) {
  const multiplier = 10 ** precision
  return Math.round(value * multiplier) / multiplier
}
