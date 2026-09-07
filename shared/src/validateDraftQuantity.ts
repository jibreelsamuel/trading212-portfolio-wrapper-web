import type { OrderSide } from './orderSide'
import { estimateFxFee } from './fxFee'

export type ValidateDraftQuantityInput = {
  draftQuantityText: string
  side: OrderSide
  /** Shares held (sell cap until quantityAvailableForTrading is on Holding). */
  holdingQuantity: number
  cashAvailable: number | null
  referencePrice: number | null
  /** From maxDraftQuantity — buy cash buffer / sell holding cap. */
  maxQuantity: number | null
  marketCurrency?: string | null
  walletCurrency?: string | null
  forceFxFee?: boolean
}

/** Float-safe “same shares” for sell-all (JS Number vs portfolio mark). */
const SELL_ALL_EPSILON = 1e-8

function isApproximatelyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) <= SELL_ALL_EPSILON
}

/**
 * Client-side draft checks aligned with OrderValidator.
 * Sell may exceed 4dp only when quantity ≈ full holding (sell-all).
 */
export function validateDraftQuantity(
  input: ValidateDraftQuantityInput,
): string[] {
  const errors: string[] = []
  const fractional = input.draftQuantityText.split('.')[1]
  const quantity = Number(input.draftQuantityText.trim())

  const exceedsFourDecimals = fractional != null && fractional.length > 4

  const isSellAll =
    input.side === 'sell' &&
    Number.isFinite(quantity) &&
    isApproximatelyEqual(quantity, input.holdingQuantity)

  if (exceedsFourDecimals && !isSellAll) {
    errors.push('Quantity must have at most 4 decimal places')
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return errors
  }

  if (input.maxQuantity !== null && quantity > input.maxQuantity) {
    errors.push(
      input.side === 'sell'
        ? 'Sell quantity exceeds available quantity'
        : 'Buy quantity exceeds maximum for available cash',
    )
  }

  // Buy affordability: mark × qty + est. FX fee. Skip when price/cash unknown.
  if (
    input.side === 'buy' &&
    input.referencePrice !== null &&
    input.referencePrice > 0 &&
    input.cashAvailable !== null
  ) {
    const gross = input.referencePrice * quantity
    const fxFee = estimateFxFee(
      gross,
      input.marketCurrency,
      input.walletCurrency,
      { force: input.forceFxFee },
    )
    if (gross + fxFee > input.cashAvailable) {
      errors.push('Estimated cost exceeds available cash')
    }
  }

  return errors
}
