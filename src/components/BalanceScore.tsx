import { Link } from 'react-router-dom'
import {
  balanceScoreTone,
  formatBalanceScore,
  type BalanceScoreProps,
  type BalanceScoreTone,
} from '@portfolio/shared'

const TONE_CLASS: Record<BalanceScoreTone, string> = {
  low: 'balance-score--low',
  mid: 'balance-score--mid',
  high: 'balance-score--high',
}

export function BalanceScore({ score }: BalanceScoreProps) {
  return (
    <section>
      <h2>Balance</h2>
      {score === null ? (
        <p className="balance-score">N/A — set targets to score balance</p>
      ) : (
        <p className={`balance-score ${TONE_CLASS[balanceScoreTone(score)]}`}>
          {formatBalanceScore(score)}
        </p>
      )}
      <p>
        <Link to="/rebalance">Rebalance portfolio</Link>
      </p>
    </section>
  )
}

export default BalanceScore
