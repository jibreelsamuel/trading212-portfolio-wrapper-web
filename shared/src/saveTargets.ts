import { putTargets, type TargetWeight } from './api/targetApi'
import { percentToWeight } from './weightUtils'

const WEIGHT_EPSILON = 1e-9
/** Matches backend SUM_EPSILON (2dp percent → 1e-4 as a fraction). */
const SUM_EPSILON = 1e-4

export type SaveTargetsInput = {
  rows: Array<{ ticker: string; targetWeight: number }>
  draftPercents: Record<string, string>
}

export type SaveTargetsResult =
  | { ok: true; saved: TargetWeight[] }
  | { ok: false; messages: string[] }

function buildTargetsFromDrafts(input: SaveTargetsInput): TargetWeight[] {
  return input.rows.map((row) => ({
    ticker: row.ticker,
    weight: percentToWeight(Number(input.draftPercents[row.ticker])),
  }))
}

function buildPreviousByTicker(
  rows: SaveTargetsInput['rows'],
): Record<string, number> {
  return Object.fromEntries(rows.map((row) => [row.ticker, row.targetWeight]))
}

function hasChanges(
  next: TargetWeight[],
  previousByTicker: Record<string, number>,
): boolean {
  for (const target of next) {
    const previous = previousByTicker[target.ticker] ?? 0
    if (Math.abs(target.weight - previous) > WEIGHT_EPSILON) {
      return true
    }
  }
  for (const [ticker, previous] of Object.entries(previousByTicker)) {
    if (
      previous > WEIGHT_EPSILON &&
      !next.some((target) => target.ticker === ticker)
    ) {
      return true
    }
  }
  return false
}

function validateTargets(targets: TargetWeight[]): string[] {
  const errors: string[] = []

  for (const target of targets) {
    if (!target.ticker.trim()) {
      errors.push('Each target needs a ticker')
      continue
    }
    if (!Number.isFinite(target.weight)) {
      errors.push(`Enter a valid percent for ${target.ticker}`)
      continue
    }
    if (target.weight < 0 || target.weight > 1) {
      errors.push(`Weight for ${target.ticker} must be between 0% and 100%`)
    }
  }

  const sum = targets.reduce((acc, target) => acc + target.weight, 0)
  if (Math.abs(sum - 1) > SUM_EPSILON) {
    errors.push('Target weights must sum to 100%')
  }

  return errors
}

export async function saveTargets(
  input: SaveTargetsInput,
): Promise<SaveTargetsResult> {
  const targets = buildTargetsFromDrafts(input)
  const previousByTicker = buildPreviousByTicker(input.rows)

  if (!hasChanges(targets, previousByTicker)) {
    return { ok: false, messages: ['No changes to save'] }
  }

  const validationErrors = validateTargets(targets)
  if (validationErrors.length > 0) {
    return { ok: false, messages: validationErrors }
  }

  try {
    const saved = await putTargets(targets)
    return { ok: true, saved }
  } catch (err: unknown) {
    return {
      ok: false,
      messages: [
        err instanceof Error ? err.message : 'Failed to save targets',
      ],
    }
  }
}
