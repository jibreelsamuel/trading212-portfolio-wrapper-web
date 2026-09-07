import { useState } from 'react'
import type { Holding } from '../api/holdingApi'
import type { PortfolioSnapshot } from '../api/portfolioApi'
import { inferMarketCurrency, tradeRequiresFxFee } from '../fxFee'
import { investedBookValue } from '../investedBookValue'
import type { OrderSide } from '../orderSide'
import {
  draftToSignedQuantity,
  maxDraftQuantity,
  projectTradeImpact,
  referencePriceFromHolding,
} from '../projectTradeImpact'
import { validateDraftQuantity } from '../validateDraftQuantity'

export type UseTradeDraftInput = {
  data: PortfolioSnapshot | undefined
  holding: Holding | undefined
  side: OrderSide
}

function capDraftQuantity(next: string, maxQuantity: number | null): string {
  if (maxQuantity === null || next.trim() === '') {
    return next
  }

  const n = Number(next)
  if (Number.isFinite(n) && n > maxQuantity) {
    return String(maxQuantity)
  }

  return next
}

export function useTradeDraft({ data, holding, side }: UseTradeDraftInput) {
  const [draftQuantity, setDraftQuantity] = useState('')

  const referencePrice =
    holding != null
      ? referencePriceFromHolding(holding.value, holding.quantity)
      : null

  const signedQuantity = draftToSignedQuantity(draftQuantity, side)

  const marketCurrency =
    holding != null
      ? inferMarketCurrency(holding.marketCurrency)
      : null
  const walletCurrency = holding?.walletCurrency ?? data?.account.currency ?? null
  // Position already has FX P/L → conversion applies even if currency string missing.
  const forceFxFee =
    holding?.fxImpact != null &&
    !tradeRequiresFxFee(marketCurrency, walletCurrency)

  const maxQuantity =
    data && holding != null
      ? maxDraftQuantity({
          side,
          cashAvailable: data.account.cashAvailable,
          referencePrice,
          holdingQuantity: holding.quantity,
          marketCurrency,
          walletCurrency,
          forceFxFee,
        })
      : null

  const emptyPreview = {
    projectedWeight: null,
    estimatedGrossNotional: null,
    estimatedFxFee: null,
    estimatedNotional: null,
  }

  const preview =
    data && holding
      ? projectTradeImpact({
          holdingValue: holding.value,
          portfolioTotal: investedBookValue(data.holdings),
          signedQuantity,
          referencePrice,
          marketCurrency,
          walletCurrency,
          forceFxFee,
        })
      : emptyPreview

  const draftErrors =
    data && holding != null
      ? validateDraftQuantity({
          draftQuantityText: draftQuantity,
          side,
          holdingQuantity: holding.quantity,
          cashAvailable: data.account.cashAvailable,
          referencePrice,
          maxQuantity,
          marketCurrency,
          walletCurrency,
          forceFxFee,
        })
      : []

  const canReview = signedQuantity !== null && draftErrors.length === 0

  const onDraftQuantityChange = (next: string) => {
    setDraftQuantity(capDraftQuantity(next, maxQuantity))
  }

  return {
    draftQuantity,
    onDraftQuantityChange,
    signedQuantity,
    maxQuantity,
    preview,
    draftErrors,
    canReview,
  }
}
