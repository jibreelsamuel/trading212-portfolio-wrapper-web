import { useNavigate } from 'react-router-dom'
import { useConfirmOrder, type ConfirmOrder } from '@portfolio/shared'

export type { ConfirmOrder }

/** Web wrapper: shared confirm flow + navigate home on success. */
export function useConfirmOrderDialog() {
  const navigate = useNavigate()
  const {
    selectedOrder,
    openConfirmOrder,
    closeConfirmOrder,
    confirmSelectedOrder,
    isPending,
    isError,
    error,
    errorMessage,
  } = useConfirmOrder({
    onConfirmed: () => {
      navigate('/')
    },
  })

  return {
    selectedOrder,
    openConfirmOrderDialog: openConfirmOrder,
    closeConfirmOrderDialog: closeConfirmOrder,
    confirmSelectedOrder,
    isPending,
    isError,
    error,
    errorMessage,
  }
}
