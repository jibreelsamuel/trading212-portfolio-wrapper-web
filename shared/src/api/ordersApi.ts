import { sendJson } from './http'

export type MarketRequest = {
  ticker: string
  /** Signed: buy positive, sell negative. */
  quantity: number
  extendedHours?: boolean
}

/** Matches backend Order (fields we care about after place). */
export type PlacedOrder = {
  id: number
  ticker: string
  quantity: number
  side: 'BUY' | 'SELL'
}

const url = '/api/orders/market'

export function placeMarketOrder(
  request: MarketRequest,
): Promise<PlacedOrder> {
  return sendJson<PlacedOrder>(url, 'POST', request)
}
