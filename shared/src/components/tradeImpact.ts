import type { Holding } from '../api/holdingApi'

export type TradeImpactProps = Pick<
  Holding,
  'name' | 'ticker' | 'quantity' | 'weight' | 'targetWeight'
> & {
  currency: string
  /** null while quantity draft is empty / invalid */
  projectedWeight: number | null
  /**
   * Cash impact including FX fee estimate:
   * buy = gross + fee (total cost), sell = gross − fee (net proceeds).
   */
  estimatedNotional: number | null
}
