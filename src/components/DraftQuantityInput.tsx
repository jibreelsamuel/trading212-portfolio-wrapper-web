import type { DraftQuantityInputProps } from '@portfolio/shared'

export type { DraftQuantityInputProps }

export function DraftQuantityInput({
  draftQuantity,
  maxQuantity,
  onDraftQuantityChange,
}: DraftQuantityInputProps) {
  return (
    <p>
      <label>
        Quantity{' '}
        <input
          type="number"
          min={0}
          max={maxQuantity ?? undefined}
          step="any"
          value={draftQuantity}
          onChange={(event) => onDraftQuantityChange(event.target.value)}
        />
      </label>
    </p>
  )
}

export default DraftQuantityInput
