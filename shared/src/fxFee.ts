/** Published Trading 212 Invest / Stocks ISA FX conversion fee. */
export const T212_FX_FEE_RATE = 0.0015

/**
 * Normalise instrument currency for FX-fee comparison.
 * GBX / GBp are sterling pence — same family as GBP (no FX fee).
 */
export function normalizeCurrencyForFx(
  currency: string | null | undefined,
): string | null {
  if (currency == null || currency.trim() === '') {
    return null
  }
  const upper = currency.trim().toUpperCase()
  if (upper === 'GBX' || upper === 'GBP') {
    return 'GBP'
  }
  return upper
}

/**
 * Prefer API currency; if missing, infer from T212 ticker shape
 * (e.g. `AAPL_US_EQ` → USD).
 */
export function inferMarketCurrency(
  marketCurrency: string | null | undefined,
): string | null {
  if (marketCurrency != null && marketCurrency.trim() !== '') {
    return marketCurrency.trim()
  }
  
  return null
}

/** True when T212 would convert between instrument and wallet currency. */
export function tradeRequiresFxFee(
  marketCurrency: string | null | undefined,
  walletCurrency: string | null | undefined,
  options?: { force?: boolean },
): boolean {
  if (options?.force) {
    return true
  }
  const market = normalizeCurrencyForFx(marketCurrency)
  const wallet = normalizeCurrencyForFx(walletCurrency)
  if (market == null || wallet == null) {
    return false
  }
  return market !== wallet
}

/** Est. FX fee on a pre-fee wallet-currency notional (0 when no conversion). */
export function estimateFxFee(
  grossNotional: number,
  marketCurrency: string | null | undefined,
  walletCurrency: string | null | undefined,
  options?: { force?: boolean },
): number {
  if (
    !Number.isFinite(grossNotional) ||
    grossNotional <= 0 ||
    !tradeRequiresFxFee(marketCurrency, walletCurrency, options)
  ) {
    return 0
  }
  return grossNotional * T212_FX_FEE_RATE
}
