export type { OrderSide } from './orderSide'

export {
  formatWeight,
  percentToWeight,
  weightToPercent,
  weightToPercentText,
  sanitizeTargetPercentText,
  TARGET_PERCENT_STEP,
  stepTargetPercentText,
} from './weightUtils'

export {
  validateDraftQuantity,
  type ValidateDraftQuantityInput
} from './validateDraftQuantity'

export {
  draftToSignedQuantity,
  maxDraftQuantity, projectTradeImpact,
  referencePriceFromHolding, type ProjectTradeImpactInput,
  type ProjectTradeImpactResult
} from './projectTradeImpact'

export {
  estimateFxFee, inferMarketCurrency, normalizeCurrencyForFx, T212_FX_FEE_RATE, tradeRequiresFxFee
} from './fxFee'

export { configureApi, getApiConfig, type ApiConfig } from './api/config'

export { getJson, sendJson } from './api/http'

export {
  getPortfolio,
  getSuggestedOrders, type AccountOverview,
  type InvestmentTotals, type PortfolioSnapshot, type SuggestedOrder
} from './api/portfolioApi'

export { getHolding, type Holding } from './api/holdingApi'

export {
  putTargets,
  type TargetWeight,
} from './api/targetApi'

export {
  saveTargets,
  type SaveTargetsInput,
  type SaveTargetsResult
} from './saveTargets'

export {
  editTargetsReducer,
  initialEditTargetsState, type EditTargetsAction, type EditTargetSeedRow, type EditTargetsState
} from './editTargetsState'

export {
  placeMarketOrder,
  type MarketRequest,
  type PlacedOrder
} from './api/ordersApi'

export {
  handleConfirmOrder,
  type ConfirmOrder,
  type ConfirmOrderRequest
} from './api/confirmOrder'

export {
  holdingQueryKey,
  holdingQueryKeyRoot,
  invalidatePortfolioRelatedQueries, portfolioQueryKey,
  suggestedOrdersQueryKey
} from './query/portfolioQueryKeys'

export { createQueryClient } from './query/createQueryClient'

export {
  formatMoney,
  formatSignedMoney,
  formatUnrealizedProfitLoss,
  formatUnrealizedProfitLossAgainstCost,
  type FormatMoneyOptions
} from './formatMoney'
export { investedBookValue } from './investedBookValue'
export { signedAmountTone, type SignedAmountTone } from './signedAmountTone'
export { truncateHoldingName } from './truncateHoldingName'

export { holdingFromPortfolio } from './holdingFromPortfolio'

export { useConfirmOrder, type UseConfirmOrderOptions } from './hooks/useConfirmOrder'
export { useHolding } from './hooks/useHolding'
export { usePortfolio } from './hooks/usePortfolio'
export { useSuggestedOrders } from './hooks/useSuggestedOrders'
export {
  useTradeContext,
  type UseTradeContextInput
} from './hooks/useTradeContext'
export { useTradeDraft, type UseTradeDraftInput } from './hooks/useTradeDraft'

export { accountSummaryProps } from './components/accountSummary'
export type {
  AccountSummaryProps
} from './components/accountSummary'
export {
  balanceScoreTone, formatBalanceScore
} from './components/balanceScore'
export type {
  BalanceScoreProps,
  BalanceScoreTone
} from './components/balanceScore'
export type { DraftQuantityInputProps } from './components/draftQuantityInput'
export type { HoldingInfoProps } from './components/holdingInfo'
export type { HoldingsListProps } from './components/holdingsList'
export type { TradeImpactProps } from './components/tradeImpact'

export {
  DRAFT_QUANTITY_SLIDER_STEP, formatSliderQuantity, resolveDraftQuantitySliderMax,
  sliderValueFromDraft
} from './draftQuantitySlider'

