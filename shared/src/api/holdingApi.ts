import { getJson } from './http'

export type Holding = {
  ticker: string
  name: string
  quantity: number
  value: number
  weight: number
  targetWeight: number
  /** T212 currentPrice — per share in marketCurrency. */
  marketPrice: number | null
  /** ISO 4217 instrument currency (e.g. USD for US stocks). */
  marketCurrency: string | null
  /** T212 averagePricePaid — avg cost per share in marketCurrency. */
  averagePricePaid: number | null
  /** T212 walletImpact.unrealizedProfitLoss — paper P/L in walletCurrency. */
  unrealizedProfitLoss: number | null
  /** T212 walletImpact.currency — ISO 4217 for value / unrealizedProfitLoss / fxImpact. */
  walletCurrency: string | null
  /**
   * T212 walletImpact.fxImpact — gain/loss from FX rate moves (not the 0.15% conversion fee).
   * Null / absent when instrument currency matches the account.
   */
  fxImpact: number | null
}

const base = '/api/holdings'

/** One holding by T212 ticker (e.g. AAPL_US_EQ). */
export function getHolding(ticker: string): Promise<Holding> {
  return getJson<Holding>(`${base}/${encodeURIComponent(ticker)}`)
}
