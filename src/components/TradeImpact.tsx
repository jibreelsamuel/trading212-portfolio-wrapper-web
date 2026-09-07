import {
  formatMoney,
  formatWeight,
  type TradeImpactProps,
} from '@portfolio/shared'

export type { TradeImpactProps }

export function TradeImpact({
  name,
  ticker,
  quantity,
  weight,
  targetWeight,
  currency,
  projectedWeight,
  estimatedNotional,
}: TradeImpactProps) {
  return (
    <section>
      <h2>
        {name} ({ticker})
      </h2>
      <p>Quantity: {quantity}</p>
      <p>Weight: {formatWeight(weight)}</p>
      <p>
        Target:{' '}
        {targetWeight !== 0 ? formatWeight(targetWeight) : '—'}
      </p>
      <p>
        Projected weight:{' '}
        {projectedWeight !== null
          ? formatWeight(projectedWeight, { estimated: true })
          : '—'}
      </p>
      <p>
        Total:{' '}
        {formatMoney(estimatedNotional, { currency, estimated: true })}
      </p>
    </section>
  )
}

export default TradeImpact
