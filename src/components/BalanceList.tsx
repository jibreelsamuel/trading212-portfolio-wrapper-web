import type { OrderSide } from '@portfolio/shared'
import type { SuggestedOrder } from '@portfolio/shared'

type BalanceListProps = {
  suggestedOrders: SuggestedOrder[]
  onOpenOrder: (order: {
    ticker: string
    name: string
    quantity: number
    side: OrderSide
  }) => void
}

export function BalanceList({ suggestedOrders, onOpenOrder }: BalanceListProps) {
  return (
    <section>
      <h2>Suggested orders</h2>
      <ol>
        {suggestedOrders.map((s) => {
          const side: OrderSide = s.quantity > 0 ? 'buy' : 'sell'
          const quantity = Math.abs(s.quantity)
          const name = s.name ?? s.ticker

          return (
            <li key={s.ticker}>
              {name} — {quantity}{' '}
              <button
                type="button"
                onClick={() =>
                  onOpenOrder({
                    ticker: s.ticker,
                    name,
                    quantity,
                    side,
                  })
                }
              >
                {side === 'buy' ? 'Buy' : 'Sell'}
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
export default BalanceList
