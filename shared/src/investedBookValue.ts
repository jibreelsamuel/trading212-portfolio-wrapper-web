/** Σ holding market values — invested book (excludes cash). */
export function investedBookValue(
  holdings: ReadonlyArray<{ value: number }>,
): number {
  return holdings.reduce((sum, holding) => sum + holding.value, 0)
}
