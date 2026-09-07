export function formatWeight(
  weight: number,
  options?: { estimated?: boolean },
): string {
  const approx = options?.estimated ? '~' : ''
  return `${approx}${(weight * 100).toFixed(2)}%`
}

/** UI percentage (e.g. 40) → API fraction (0.4) */
export function percentToWeight(percent: number): number {
  return percent / 100
}

/** API fraction (0.4) → UI percentage (40) */
export function weightToPercent(weight: number): number {
  return weight * 100
}

/**
 * Fraction → percent draft text, at most 2 decimal places
 * (same precision as {@link formatWeight}).
 */
export function weightToPercentText(weight: number): string {
  return String(Number((weight * 100).toFixed(2)))
}

/**
 * Keep only typable target % text: "", digits, optional ".", ≤2 fractional digits.
 * Returns null when the keystroke should be ignored.
 */
export function sanitizeTargetPercentText(text: string): string | null {
  if (text === '') {
    return ''
  }
  if (!/^\d*\.?\d{0,2}$/.test(text)) {
    return null
  }
  return text
}

/** Default stepper delta for target % editing on mobile. */
export const TARGET_PERCENT_STEP = 5

/**
 * Nudge a percent draft by {@link delta} (typically ±{@link TARGET_PERCENT_STEP}).
 * Snaps onto the step grid: e.g. 2.33 +5 → 5, then 10, 15…; 7.2 −5 → 5.
 * Clamped to [0, 100].
 */
export function stepTargetPercentText(
  percentText: string,
  delta: number,
  fallbackPercent = 0,
): string {
  const parsed = Number(percentText)
  const base = Number.isFinite(parsed) ? parsed : fallbackPercent
  const step = Math.abs(delta)
  if (step === 0) {
    return String(Math.round(base))
  }

  // Float-safe grid move: leave a partial cell toward the next/prev multiple.
  const eps = 1e-9
  const next =
    delta > 0
      ? Math.floor(base / step + eps) * step + step
      : Math.ceil(base / step - eps) * step - step

  return String(Math.min(100, Math.max(0, next)))
}

