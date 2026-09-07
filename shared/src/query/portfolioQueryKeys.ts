import type { QueryClient } from '@tanstack/react-query'

export const portfolioQueryKey = ['portfolio'] as const
export const suggestedOrdersQueryKey = ['suggested-orders'] as const
export const holdingQueryKeyRoot = ['holding'] as const

export function holdingQueryKey(ticker: string) {
  return [...holdingQueryKeyRoot, ticker] as const
}

/** Mark portfolio + rebalance suggestions stale after writes that change either. */
export function invalidatePortfolioRelatedQueries(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: portfolioQueryKey }),
    queryClient.invalidateQueries({ queryKey: suggestedOrdersQueryKey }),
    queryClient.invalidateQueries({ queryKey: holdingQueryKeyRoot }),
  ])
}
