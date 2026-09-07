import { formatWeight, weightToPercentText } from '@portfolio/shared'

export type TargetRow = {
  ticker: string
  name: string
  weight: number
  targetWeight: number
}

type TargetRowsProps = {
  rows: TargetRow[]
  /** Percent text as typed, e.g. "40" or "" while clearing */
  draftPercents: Record<string, string>
  onTargetPercentChange: (ticker: string, percentText: string) => void
}

export function TargetRows({
  rows,
  draftPercents,
  onTargetPercentChange,
}: TargetRowsProps) {
  if (rows.length === 0) {
    return <p>No holdings to edit.</p>
  }

  return (
    <ol>
      {rows.map((row) => (
        <li key={row.ticker}>
          {row.name} — {formatWeight(row.weight)} → target{' '}
          {/* text + inputMode: type=number ignores controlled 2dp caps in some browsers */}
          <input
            type="text"
            inputMode="decimal"
            value={
              draftPercents[row.ticker] ??
              weightToPercentText(row.targetWeight)
            }
            onChange={(e) => onTargetPercentChange(row.ticker, e.target.value)}
            aria-label={`Target weight percent for ${row.name}`}
          />
          %
        </li>
      ))}
    </ol>
  )
}

export default TargetRows
