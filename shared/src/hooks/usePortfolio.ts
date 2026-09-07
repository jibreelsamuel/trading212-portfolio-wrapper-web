import { useQuery } from '@tanstack/react-query'
import { getPortfolio } from '../api/portfolioApi'
import { PORTFOLIO_CACHE_MS } from '../query/portfolioCacheMs'
import { portfolioQueryKey } from '../query/portfolioQueryKeys'

export function usePortfolio() {
  return useQuery({
    queryFn: () => getPortfolio(),
    queryKey: portfolioQueryKey,
    refetchInterval: PORTFOLIO_CACHE_MS,
    // Hidden tabs / backgrounded apps must not keep calling T212 (account summary ≈ 1 req / 5s).
    refetchIntervalInBackground: false,
  })
}
