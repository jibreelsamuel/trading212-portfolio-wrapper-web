import { Link } from 'react-router-dom'
import { formatWeight, type HoldingsListProps } from '@portfolio/shared'

export function HoldingsList({ holdings }: HoldingsListProps) {
  return (
    <section>
      <h2>Holdings</h2>
      <ol>
        {holdings.map((h) => (
          <li key={h.ticker}>
            {h.name} — {h.value} — {h.quantity} - {formatWeight(h.weight)}
            {h.targetWeight !== 0 && (
              <> — target {formatWeight(h.targetWeight)}</>
            )}{' '}
            <Link to={`/${encodeURIComponent(h.ticker)}/buy`}>Buy</Link>
            {' · '}
            <Link to={`/${encodeURIComponent(h.ticker)}/sell`}>Sell</Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default HoldingsList
