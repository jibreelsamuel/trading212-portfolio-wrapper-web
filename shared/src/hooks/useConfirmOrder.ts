import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  handleConfirmOrder,
  type ConfirmOrder,
} from '../api/confirmOrder'
import { invalidatePortfolioRelatedQueries } from '../query/portfolioQueryKeys'

export type UseConfirmOrderOptions = {
  /** Platform navigation / dismiss after a successful place. */
  onConfirmed?: (order: ConfirmOrder) => void
}

/**
 * Shared confirm-order flow: selected order state + place mutation.
 * UI shells (dialog / sheet) stay platform-specific.
 */
export function useConfirmOrder(options?: UseConfirmOrderOptions) {
  const queryClient = useQueryClient()
  const [selectedOrder, setSelectedOrder] = useState<ConfirmOrder | null>(null)

  const {
    mutateAsync: confirmMutation,
    isPending,
    isError,
    error,
    reset,
  } = useMutation({
    mutationFn: handleConfirmOrder,
    onSuccess: () => {
      void invalidatePortfolioRelatedQueries(queryClient)
    },
  })

  const openConfirmOrder = (order: ConfirmOrder) => {
    reset()
    setSelectedOrder(order)
  }

  const closeConfirmOrder = () => {
    if (isPending) {
      return
    }
    reset()
    setSelectedOrder(null)
  }

  const confirmSelectedOrder = async () => {
    if (selectedOrder == null) {
      return
    }

    const order = selectedOrder

    try {
      await confirmMutation({
        ticker: order.ticker,
        side: order.side,
        quantity: order.quantity,
      })

      setSelectedOrder(null)
      reset()
      options?.onConfirmed?.(order)
    } catch {
      // mutation.error / isError update for the dialog / sheet UI
    }
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : isError
        ? 'Failed to place order'
        : null

  return {
    selectedOrder,
    openConfirmOrder,
    closeConfirmOrder,
    confirmSelectedOrder,
    isPending,
    isError,
    error,
    errorMessage,
  }
}
