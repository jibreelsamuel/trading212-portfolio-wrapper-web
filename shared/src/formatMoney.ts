export type FormatMoneyOptions = {
  /** ISO currency code appended after the amount (e.g. GBP). */
  currency?: string | null
  /** Fixed decimal places. Default 2. Pass null to use String(value). */
  decimals?: number | null
  /** Prefix '+' for non-negative values (P/L, FX impact). */
  signed?: boolean
  /** Prefix '~' to mark client estimates (notional, FX fee, etc.). */
  estimated?: boolean
}

/**
 * Null-safe amount + optional currency. One place for list/detail money display.
 */
export function formatMoney(
  value: number | null | undefined,
  options: FormatMoneyOptions = {},
): string {
  if (value == null) {
    return '—'
  }

  const {
    currency = null,
    decimals = 2,
    signed = false,
    estimated = false,
  } = options
  const body =
    decimals == null ? String(value) : value.toFixed(decimals)
  const approx = estimated ? '~' : ''
  const sign = signed && value >= 0 ? '+' : ''
  const currencySuffix =
    currency != null && currency !== '' ? ` ${currency}` : ''
  return `${approx}${sign}${body}${currencySuffix}`
}

/** Signed wallet amount (FX impact, raw P/L figure). */
export function formatSignedMoney(
  amount: number | null,
  currency: string | null,
  decimals = 2,
): string {
  return formatMoney(amount, { currency, decimals, signed: true })
}

function formatSignedPercent(value: number, decimals: number): string {
  return formatMoney(value, { decimals, signed: true }) + '%'
}

/**
 * Signed UPL amount with optional return % vs cost basis in brackets.
 * Skips % when cost basis is missing or non-positive.
 */
function formatProfitLossWithReturnPct(
  profitLoss: number | null,
  costBasis: number | null | undefined,
  walletCurrency: string | null,
): string {
  if (profitLoss == null) {
    return '—'
  }

  const amountPart = formatMoney(profitLoss, {
    currency: walletCurrency,
    signed: true,
  })

  if (costBasis == null || !Number.isFinite(costBasis) || costBasis <= 0) {
    return amountPart
  }

  const returnPct = (profitLoss / costBasis) * 100
  return `${amountPart} (${formatSignedPercent(returnPct, 2)})`
}

/**
 * Paper P/L in wallet currency with return % vs cost basis.
 * Cost basis derived as value − unrealizedProfitLoss (T212: P/L = value − totalCost).
 */
export function formatUnrealizedProfitLoss(
  value: number,
  unrealizedProfitLoss: number | null,
  walletCurrency: string | null,
): string {
  const costBasis =
    unrealizedProfitLoss == null ? null : value - unrealizedProfitLoss
  return formatProfitLossWithReturnPct(
    unrealizedProfitLoss,
    costBasis,
    walletCurrency,
  )
}

/**
 * Account-level unrealized P/L using T212 investments.totalCost as cost basis.
 */
export function formatUnrealizedProfitLossAgainstCost(
  unrealizedProfitLoss: number | null,
  totalCost: number | null,
  walletCurrency: string | null,
): string {
  return formatProfitLossWithReturnPct(
    unrealizedProfitLoss,
    totalCost,
    walletCurrency,
  )
}
