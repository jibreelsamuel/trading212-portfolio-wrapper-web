import { Link } from 'react-router-dom'
import AccountSummary from '../components/AccountSummary'
import BalanceScore from '../components/BalanceScore'
import HoldingsList from '../components/HoldingsList'
import { accountSummaryProps, usePortfolio } from '@portfolio/shared'

export function PortfolioPage() {
  const { data, isPending, isError, error } = usePortfolio()

  return (
    <main>
      <h1>ISA Portfolio</h1>

      {isPending && <p>Loading…</p>}

      {isError && (
        <p>Error: {error instanceof Error ? error.message : 'Failed to load portfolio'}</p>
      )}

      {data && (
        <div>
          <AccountSummary {...accountSummaryProps(data)} />
          <HoldingsList holdings={data.holdings} />
          <p>
            <Link to="/targets/edit">Edit targets</Link>
          </p>
          <BalanceScore score={data.score} />
        </div>
      )}
    </main>
  )
}

export default PortfolioPage
