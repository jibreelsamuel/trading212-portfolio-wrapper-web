import { sanitizeTargetPercentText, weightToPercentText } from './weightUtils'

/** Minimal row shape needed to seed draft percent fields. */
export type EditTargetSeedRow = {
  ticker: string
  targetWeight: number
}

export type EditTargetsState = {
  draftPercents: Record<string, string>
  saveErrors: string[]
}

export type EditTargetsAction =
  | { type: 'SEED_DRAFTS'; rows: EditTargetSeedRow[] }
  | { type: 'SET_DRAFT_PERCENT'; ticker: string; percentText: string }
  | { type: 'TARGETS_NOT_SAVED'; messages: string[] }
  | { type: 'TARGETS_SAVED' }

export const initialEditTargetsState: EditTargetsState = {
  draftPercents: {},
  saveErrors: [],
}

export function editTargetsReducer(
  state: EditTargetsState,
  action: EditTargetsAction,
): EditTargetsState {
  switch (action.type) {
    case 'SEED_DRAFTS':
      // Keep in-progress edits if portfolio data arrives again (poll / focus).
      if (Object.keys(state.draftPercents).length > 0) {
        return state
      }
      return {
        draftPercents: Object.fromEntries(
          action.rows.map((row) => [
            row.ticker,
            weightToPercentText(row.targetWeight),
          ]),
        ),
        saveErrors: [],
      }
    case 'SET_DRAFT_PERCENT': {
      // Ignore keystrokes beyond 2dp so the controlled input never shows them.
      const percentText = sanitizeTargetPercentText(action.percentText)
      if (percentText == null) {
        return state
      }
      return {
        ...state,
        saveErrors: [],
        draftPercents: {
          ...state.draftPercents,
          [action.ticker]: percentText,
        },
      }
    }
    case 'TARGETS_NOT_SAVED':
      return {
        ...state,
        saveErrors: action.messages,
      }
    case 'TARGETS_SAVED':
      return {
        ...state,
        saveErrors: [],
      }
    default:
      return state
  }
}
