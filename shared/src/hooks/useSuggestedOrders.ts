import { useQuery } from '@tanstack/react-query'
import { getSuggestedOrders } from '../api/portfolioApi'
import { suggestedOrdersQueryKey } from '../query/portfolioQueryKeys'

export function useSuggestedOrders() {
  return useQuery({
    queryKey: suggestedOrdersQueryKey,
    queryFn: () => getSuggestedOrders(),
  })
}
