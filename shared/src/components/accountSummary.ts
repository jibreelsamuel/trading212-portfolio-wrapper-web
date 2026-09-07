import type {
  AccountOverview,
  PortfolioSnapshot,
} from '../api/portfolioApi'

/** Props for account header UI — mirrors {@link AccountOverview}. */
export type AccountSummaryProps = AccountOverview

export function accountSummaryProps(
  snapshot: PortfolioSnapshot,
): AccountSummaryProps {
  return snapshot.account
}
