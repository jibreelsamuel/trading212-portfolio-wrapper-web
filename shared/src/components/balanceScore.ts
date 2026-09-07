import type { PortfolioSnapshot } from '../api/portfolioApi'

export type BalanceScoreProps = Pick<PortfolioSnapshot, 'score'>

/** Display scale: backend score is 0–1, UI shows 0–10. */
export function formatBalanceScore(score: number): string {
  return (score * 10).toFixed(1)
}

export type BalanceScoreTone = 'low' | 'mid' | 'high'

/** Thresholds on the 0–10 display scale. */
export function balanceScoreTone(score: number): BalanceScoreTone {
  const display = score * 10
  if (display < 5) {
    return 'low'
  }
  if (display < 8) {
    return 'mid'
  }
  return 'high'
}
