import type { OrderSide } from '../orderSide'
import { placeMarketOrder } from './ordersApi'

/** Display + confirm payload (quantity always positive; side is separate). */
export type ConfirmOrder = {
  ticker: string
  name: string | null
  quantity: number
  side: OrderSide
  /** Est. 0.15% FX conversion fee when currencies differ; else 0 / omitted. */
  estimatedFxFee?: number | null
  /**
   * Total cash impact including est. FX fee when applicable:
   * buy = trade value + fee, sell = trade value − fee.
   */
  estimatedNotional?: number | null
  currency?: string
}

export type ConfirmOrderRequest = {
  ticker: string
  side: OrderSide
  quantity: number
}

export async function handleConfirmOrder({
  ticker,
  side,
  quantity,
}: ConfirmOrderRequest) {
  const signedQuantity = side === 'buy' ? quantity : -quantity

  return placeMarketOrder({
    ticker,
    quantity: signedQuantity,
    extendedHours: false,
  })
}
