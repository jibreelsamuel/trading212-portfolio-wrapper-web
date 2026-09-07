/** Truncate for dense list rows (e.g. holdings). Includes spaces in the count. */
export function truncateHoldingName(name: string, maxLength = 22): string {
  if (name.length <= maxLength) {
    return name
  }
  return `${name.slice(0, maxLength)}…`
}
