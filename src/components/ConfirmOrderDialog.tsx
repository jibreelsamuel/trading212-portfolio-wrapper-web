import { formatMoney, type ConfirmOrder } from '@portfolio/shared'

type ConfirmOrderDialogProps = ConfirmOrder & {
  isPending?: boolean
  errorMessage?: string | null
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function ConfirmOrderDialog({
  ticker,
  name,
  quantity,
  side,
  estimatedFxFee = null,
  estimatedNotional = null,
  currency,
  isPending = false,
  errorMessage = null,
  onConfirm,
  onCancel,
}: ConfirmOrderDialogProps) {
  const sideLabel = side === 'buy' ? 'Buy' : 'Sell'
  const showFxFee = estimatedFxFee != null && estimatedFxFee > 0

  return (
    <section role="dialog" aria-modal="true" aria-labelledby="confirm-order-title">
      <h2 id="confirm-order-title">Confirm order</h2>
      <p>
        {sideLabel} {quantity} of {name ?? ticker}
      </p>
      <p>
        <code>{ticker}</code>
      </p>
      {showFxFee && (
        <p>
          FX fee:{' '}
          {formatMoney(estimatedFxFee, { currency, estimated: true })}
        </p>
      )}
      {estimatedNotional != null && (
        <p>
          <strong>
            Total:{' '}
            {formatMoney(estimatedNotional, { currency, estimated: true })}
          </strong>
        </p>
      )}
      {errorMessage && <p>Error: {errorMessage}</p>}
      <div>
        <button
          type="button"
          disabled={isPending}
          onClick={() => void onConfirm()}
        >
          {isPending ? 'Placing…' : 'Confirm'}
        </button>
        <button type="button" disabled={isPending} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </section>
  )
}

export default ConfirmOrderDialog
