import {
  accountSummaryProps,
  usePortfolio,
  useTradeContext,
  type OrderSide,
} from '@portfolio/shared'
import { Link, useParams } from 'react-router-dom'
import AccountSummary from '../components/AccountSummary'
import ConfirmOrderDialog from '../components/ConfirmOrderDialog'
import DraftQuantityInput from '../components/DraftQuantityInput'
import TradeImpact from '../components/TradeImpact'
import ValidationMessages from '../components/ValidationMessages'
import { useConfirmOrderDialog } from '../hooks/useConfirmOrderDialog'

type TradePageProps = {
  side: OrderSide
}

/**
 * Shared shell for buy/sell. T212 treats sell as a negative quantity on the
 * same order endpoint, so UI and submit logic should stay unified — only
 * labels and sign convention differ by `side`.
 */
export function TradePage({ side }: TradePageProps) {
  const { ticker: tickerParam } = useParams<{ ticker: string }>()
  const ticker = tickerParam ? decodeURIComponent(tickerParam) : undefined

  const { data, isPending, isError, error } = usePortfolio()
  const { holding, draft } = useTradeContext({ ticker, side, data })
  const {
    draftQuantity,
    onDraftQuantityChange,
    signedQuantity,
    preview,
    maxQuantity,
    draftErrors,
    canReview,
  } = draft

  const {
    selectedOrder,
    openConfirmOrderDialog,
    closeConfirmOrderDialog,
    confirmSelectedOrder,
    isPending: isConfirming,
    error: confirmError,
  } = useConfirmOrderDialog()

  const handleOpenConfirmDialog = () => {
    if (data == null || holding == null || ticker == null) {
      return
    }

    if (!canReview || signedQuantity === null) {
      return
    }

    openConfirmOrderDialog({
      ticker,
      name: holding.name,
      quantity: Math.abs(signedQuantity),
      side,
      estimatedFxFee: preview.estimatedFxFee,
      estimatedNotional: preview.estimatedNotional,
      currency: data.account.currency,
    })
  }

  return (
    <main>
      <h1>
        {side === 'buy' ? 'Buy' : 'Sell'} {ticker}
      </h1>

      {isPending && <p>Loading…</p>}
      {isError && (
        <p>Error: {error instanceof Error ? error.message : 'Failed to load portfolio'}</p>
      )}
      {data && <AccountSummary {...accountSummaryProps(data)} />}
      {data && !holding && (
        <p>Holding not found for {ticker}.</p>
      )}
      {data && holding && (
        <>
          <TradeImpact
            {...holding}
            currency={data.account.currency}
            projectedWeight={preview.projectedWeight}
            estimatedNotional={preview.estimatedNotional}
          />
          <DraftQuantityInput
            draftQuantity={draftQuantity}
            maxQuantity={maxQuantity}
            onDraftQuantityChange={onDraftQuantityChange}
          />
          <ValidationMessages messages={draftErrors} />
          <p>
            <button
              type="button"
              disabled={!canReview}
              onClick={() => void handleOpenConfirmDialog()}
            >
              Review order
            </button>
          </p>
        </>
      )}

      {selectedOrder && (
        <ConfirmOrderDialog
          {...selectedOrder}
          isPending={isConfirming}
          errorMessage={
            confirmError instanceof Error
              ? confirmError.message
              : confirmError
                ? 'Failed to place order'
                : null
          }
          onConfirm={() => void confirmSelectedOrder()}
          onCancel={closeConfirmOrderDialog}
        />
      )}

      <p>
        <Link to="/">Back to portfolio</Link>
      </p>
    </main>
  )
}

export function BuyPage() {
  return <TradePage side="buy" />
}

export function SellPage() {
  return <TradePage side="sell" />
}

export default TradePage
