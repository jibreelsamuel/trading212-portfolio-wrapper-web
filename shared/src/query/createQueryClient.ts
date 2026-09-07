import { QueryClient } from '@tanstack/react-query'
import { PORTFOLIO_CACHE_MS } from './portfolioCacheMs'

/**
 * Per-app QueryClient factory (web and mobile each call this once).
 * Aligns staleTime with backend portfolio.cache.ttl-seconds.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: PORTFOLIO_CACHE_MS,
        // One retry only — avoid long Loading… loops on dead network / wrong base URL.
        retry: 1,
      },
    },
  })
}
