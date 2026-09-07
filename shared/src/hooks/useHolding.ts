import { useQuery } from '@tanstack/react-query'
import { getHolding } from '../api/holdingApi'
import { PORTFOLIO_CACHE_MS } from '../query/portfolioCacheMs'
import { holdingQueryKey } from '../query/portfolioQueryKeys'

export function useHolding(ticker: string) {
  const normalizedTicker = ticker.trim()

  return useQuery({
    queryKey: holdingQueryKey(normalizedTicker),
    queryFn: () => getHolding(normalizedTicker),
    enabled: normalizedTicker !== '',
    refetchInterval: PORTFOLIO_CACHE_MS,
    refetchIntervalInBackground: false,
  })
}
