import type { Holding } from './holdingApi'
import { getJson } from './http'

/**
 * Account-wide investment totals (not a list of holdings).
 * Mapped from T212 AccountSummary.investments.
 */
export type InvestmentTotals = {
  currentValue: number | null
  totalCost: number | null
  unrealizedProfitLoss: number | null
  realizedProfitLoss: number | null
}

/** Account-level slice of the portfolio home screen. */
export type AccountOverview = {
  currency: string
  totalValue: number
  cashAvailable: number | null
  investmentTotals: InvestmentTotals | null
}

export type PortfolioSnapshot = {
  account: AccountOverview
  /** 0–1 balance vs targets; null when no targets are set. */
  score: number | null
  holdings: Holding[]
}

/** Matches backend SuggestedOrder(ticker, name, quantity). */
export type SuggestedOrder = {
  ticker: string
  name: string | null
  /** Signed: buy positive, sell negative. */
  quantity: number
}

const base = '/api/portfolio'

export function getPortfolio(): Promise<PortfolioSnapshot> {
  return getJson<PortfolioSnapshot>(base)
}

export function getSuggestedOrders(): Promise<SuggestedOrder[]> {
  return getJson<SuggestedOrder[]>(`${base}/rebalance`)
}
