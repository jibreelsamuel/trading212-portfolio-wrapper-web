import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TargetRows, { type TargetRow } from '../components/TargetRows'
import ValidationMessages from '../components/ValidationMessages'
import {
  editTargetsReducer,
  initialEditTargetsState,
  invalidatePortfolioRelatedQueries,
  saveTargets,
  usePortfolio,
} from '@portfolio/shared'

export function EditTargetsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [state, dispatch] = useReducer(
    editTargetsReducer,
    initialEditTargetsState,
  )

  const { data, isPending, isError, error } = usePortfolio()

  const rows: TargetRow[] | undefined = data?.holdings.map((h) => ({
    ticker: h.ticker,
    name: h.name,
    weight: h.weight,
    targetWeight: h.targetWeight,
  }))

  const { mutateAsync: saveMutation, isPending: isSaving } = useMutation({
    mutationFn: saveTargets,
    onSuccess: (result) => {

      if (!result.ok) return 
      void invalidatePortfolioRelatedQueries(queryClient)
    },
  })

  // Seed local drafts once portfolio data is available (not a fetch).
  useEffect(() => {
    if (!rows) {
      return
    }
    dispatch({ type: 'SEED_DRAFTS', rows })
  }, [data])

  const handleSave = async () => {
    if (!rows) {
      return
    }

    const result = await saveMutation({
      rows,
      draftPercents: state.draftPercents,
    })

    if (!result.ok) {
      dispatch({ type: 'TARGETS_NOT_SAVED', messages: result.messages })
      return
    }

    if (result.saved.length === 0) {
      dispatch({
        type: 'TARGETS_NOT_SAVED',
        messages: ['No changes to save'],
      })
      return
    }

    dispatch({ type: 'TARGETS_SAVED' })
    navigate('/')
  }

  return (
    <main>
      <h1>Edit targets</h1>

      {isPending && <p>Loading…</p>}
      {isError && (
        <p>
          Error:{' '}
          {error instanceof Error ? error.message : 'Failed to load targets'}
        </p>
      )}
      {rows && (
        <>
          <TargetRows
            rows={rows}
            draftPercents={state.draftPercents}
            onTargetPercentChange={(ticker, percentText) =>
              dispatch({ type: 'SET_DRAFT_PERCENT', ticker, percentText })
            }
          />
          <ValidationMessages messages={state.saveErrors} />
          <p>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => void handleSave()}
            >
              {isSaving ? 'Saving…' : 'Save targets'}
            </button>
          </p>
        </>
      )}

      <p>
        <Link to="/">Back to portfolio</Link>
      </p>
    </main>
  )
}

export default EditTargetsPage
