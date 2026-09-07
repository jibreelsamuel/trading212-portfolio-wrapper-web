import type { PortfolioSnapshot } from '../api/portfolioApi'
import { holdingFromPortfolio } from '../holdingFromPortfolio'
import type { OrderSide } from '../orderSide'
import { useTradeDraft } from './useTradeDraft'

export type UseTradeContextInput = {
  ticker: string | undefined
  side: OrderSide
  data: PortfolioSnapshot | undefined
}

/** Wires holding lookup and draft trade state for buy/sell screens. */
export function useTradeContext({ ticker, side, data }: UseTradeContextInput) {
  const holding = holdingFromPortfolio(data, ticker)
  const draft = useTradeDraft({ data, holding, side })

  return { holding, draft }
}
