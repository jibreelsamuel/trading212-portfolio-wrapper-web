import type { OrderSide } from './orderSide'
import { estimateFxFee, T212_FX_FEE_RATE, tradeRequiresFxFee } from './fxFee'

export type ProjectTradeImpactInput = {
  holdingValue: number
  portfolioTotal: number
  /** Sell is negative; null while draft qty is empty / invalid */
  signedQuantity: number | null
  referencePrice: number | null
  marketCurrency?: string | null
  walletCurrency?: string | null
  /** When true, apply 0.15% even if currency strings are incomplete. */
  forceFxFee?: boolean
}

export type ProjectTradeImpactResult = {
  projectedWeight: number | null
  /** Gross |qty × price| before FX fee. */
  estimatedGrossNotional: number | null
  /** Est. 0.15% FX fee when currencies differ; else 0. */
  estimatedFxFee: number | null
  /**
   * Cash impact including FX fee estimate:
   * buy = gross + fee (total cost), sell = gross − fee (net proceeds).
   */
  estimatedNotional: number | null
}

/**
 * Position weight uses invested-book denominator (excludes cash); cash↔stock
 * trades adjust that denominator. Cash totals include est. FX fee when applicable.
 */
export function projectTradeImpact(
  input: ProjectTradeImpactInput,
): ProjectTradeImpactResult {
  const {
    holdingValue,
    portfolioTotal,
    signedQuantity,
    referencePrice,
    marketCurrency = null,
    walletCurrency = null,
    forceFxFee = false,
  } = input

  if (
    signedQuantity === null ||
    referencePrice === null ||
    referencePrice <= 0 ||
    portfolioTotal <= 0
  ) {
    return {
      projectedWeight: null,
      estimatedGrossNotional: null,
      estimatedFxFee: null,
      estimatedNotional: null,
    }
  }

  const signedNotional = signedQuantity * referencePrice
  const estimatedGrossNotional = Math.abs(signedNotional)
  const estimatedFxFee = estimateFxFee(
    estimatedGrossNotional,
    marketCurrency,
    walletCurrency,
    { force: forceFxFee },
  )
  const estimatedNotional =
    signedQuantity > 0
      ? estimatedGrossNotional + estimatedFxFee
      : estimatedGrossNotional - estimatedFxFee

  // Invested-book weights: trade moves cash ↔ holdings, so denominator shifts.
  const investedTotalAfter = portfolioTotal + signedNotional
  const projectedWeight =
    investedTotalAfter > 0
      ? (holdingValue + signedNotional) / investedTotalAfter
      : null

  return {
    projectedWeight,
    estimatedGrossNotional,
    estimatedFxFee,
    estimatedNotional,
  }
}

/** Derive per-share price from a holding when quantity is available. */
export function referencePriceFromHolding(
  value: number,
  quantity: number,
): number | null {
  if (quantity <= 0) {
    return null
  }
  return value / quantity
}

/**
 * Map UI draft quantity + side to signed quantity for the T212-style API.
 * Empty / non-positive drafts yield null (no preview).
 */
export function draftToSignedQuantity(
  draftQuantityText: string,
  side: OrderSide,
): number | null {
  const trimmed = draftQuantityText.trim()
  if (trimmed === '') {
    return null
  }

  const qty = Number(trimmed)
  if (!Number.isFinite(qty) || qty <= 0) {
    return null
  }

  return side === 'sell' ? -qty : qty
}

/** Leave headroom vs mark price on buys so fills are less likely to exceed cash. */
const BUY_MAX_QUANTITY_BUFFER = 0.95

/**
 * Max shares the user can enter for this side.
 * Buy: ~95% of cash / (mark × (1 + FX fee if needed)).
 * Sell: full shares held.
 */
export function maxDraftQuantity(input: {
  side: OrderSide
  cashAvailable: number | null
  referencePrice: number | null
  holdingQuantity: number
  marketCurrency?: string | null
  walletCurrency?: string | null
  forceFxFee?: boolean
}): number | null {
  if (input.side === 'sell') {
    return input.holdingQuantity > 0 ? input.holdingQuantity : 0
  }

  if (input.cashAvailable !== null && input.cashAvailable <= 0) {
    return 0
  }

  if (
    input.cashAvailable === null ||
    input.referencePrice === null ||
    input.referencePrice <= 0
  ) {
    return null
  }

  const fxMultiplier = tradeRequiresFxFee(
    input.marketCurrency,
    input.walletCurrency,
    { force: input.forceFxFee },
  )
    ? 1 + T212_FX_FEE_RATE
    : 1

  return (
    (input.cashAvailable / (input.referencePrice * fxMultiplier)) *
    BUY_MAX_QUANTITY_BUFFER
  )
}
