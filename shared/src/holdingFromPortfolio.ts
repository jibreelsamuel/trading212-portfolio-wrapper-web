import type { Holding } from './api/holdingApi'
import type { PortfolioSnapshot } from './api/portfolioApi'

/** One holding row from a portfolio snapshot, or undefined when missing. */
export function holdingFromPortfolio(
  data: PortfolioSnapshot | undefined,
  ticker: string | undefined,
): Holding | undefined {
  if (data == null || ticker == null || ticker === '') {
    return undefined
  }

  return data.holdings.find((h) => h.ticker === ticker)
}
