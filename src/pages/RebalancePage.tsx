import { useSuggestedOrders } from '@portfolio/shared'
import BalanceList from '../components/BalanceList'
import ConfirmOrderDialog from '../components/ConfirmOrderDialog'
import { useConfirmOrderDialog } from '../hooks/useConfirmOrderDialog'

export function RebalancePage() {
  const { data, isPending, isError, error } = useSuggestedOrders()
  const {
    selectedOrder,
    openConfirmOrderDialog,
    closeConfirmOrderDialog,
    confirmSelectedOrder,
    isPending: isConfirming,
    error: confirmError,
  } = useConfirmOrderDialog()

  return (
    <main>
      <h1>Rebalance</h1>

      {isPending && <p>Loading…</p>}

      {isError && (
        <p>
          Error:{' '}
          {error instanceof Error
            ? error.message
            : 'Failed to load suggested orders'}
        </p>
      )}

      {data && (
        <BalanceList
          suggestedOrders={data}
          onOpenOrder={openConfirmOrderDialog}
        />
      )}

      {selectedOrder && (
        <ConfirmOrderDialog
          {...selectedOrder}
          isPending={isConfirming}
          errorMessage={
            confirmError instanceof Error
              ? confirmError.message
              : confirmError
                ? 'Failed to place order'
                : null
          }
          onConfirm={() => void confirmSelectedOrder()}
          onCancel={closeConfirmOrderDialog}
        />
      )}
    </main>
  )
}

export default RebalancePage
