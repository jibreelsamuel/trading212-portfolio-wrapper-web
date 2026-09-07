/** Shared step for draft quantity sliders (buy + sell). */
export const DRAFT_QUANTITY_SLIDER_STEP = 0.1

/** Treat missing / non-positive max as “no slider range”. */
export function resolveDraftQuantitySliderMax(
  maxQuantity: number | null,
): number {
  return maxQuantity != null && maxQuantity > 0 ? maxQuantity : 0
}

/** Map typed draft text → clamped slider thumb position. */
export function sliderValueFromDraft(
  draftQuantity: string,
  max: number,
): number {
  const n = Number(draftQuantity)
  if (!Number.isFinite(n) || n < 0) {
    return 0
  }
  return Math.min(n, max)
}

/**
 * Format a slider value for the draft string.
 * Rounds to step so RN Slider float noise (e.g. 1.3000000002) doesn’t leak into state.
 */
export function formatSliderQuantity(
  value: number,
  step: number = DRAFT_QUANTITY_SLIDER_STEP,
): string {
  const decimals = Math.max(0, Math.round(-Math.log10(step)))
  return (Math.round(value / step) * step).toFixed(decimals)
}
