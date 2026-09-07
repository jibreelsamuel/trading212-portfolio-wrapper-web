import {
  formatMoney,
  formatUnrealizedProfitLossAgainstCost,
  signedAmountTone,
  type AccountSummaryProps,
} from '@portfolio/shared'

const toneColor = {
  high: '#027a48',
  low: '#b42318',
} as const

export function AccountSummary({
  currency,
  totalValue,
  cashAvailable,
  investmentTotals,
}: AccountSummaryProps) {
  const unrealizedTone = signedAmountTone(
    investmentTotals?.unrealizedProfitLoss,
  )

  return (
    <section>
      <h2>Account</h2>
      <p>Account value: {formatMoney(totalValue, { currency })}</p>
      <p>Cash: {formatMoney(cashAvailable, { currency })}</p>
      {investmentTotals != null && (
        <p>
          Unrealized P/L:{' '}
          <span
            style={
              unrealizedTone != null
                ? { color: toneColor[unrealizedTone] }
                : undefined
            }
          >
            {formatUnrealizedProfitLossAgainstCost(
              investmentTotals.unrealizedProfitLoss,
              investmentTotals.totalCost,
              currency,
            )}
          </span>
        </p>
      )}
    </section>
  )
}

export default AccountSummary
