/**
 * Green/red tone for signed amounts (P/L, FX impact).
 * null when amount unknown — UI should keep default text color.
 */
export type SignedAmountTone = 'high' | 'low'

export function signedAmountTone(
  amount: number | null | undefined,
): SignedAmountTone | null {
  if (amount == null) {
    return null
  }
  return amount >= 0 ? 'high' : 'low'
}
