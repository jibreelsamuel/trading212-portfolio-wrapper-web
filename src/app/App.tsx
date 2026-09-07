import { Route, Routes } from 'react-router-dom'
import EditTargetsPage from '../pages/EditTargetsPage'
import PortfolioPage from '../pages/PortfolioPage'
import RebalancePage from '../pages/RebalancePage'
import { BuyPage, SellPage } from '../pages/TradePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/rebalance" element={<RebalancePage />} />
      <Route path="/targets/edit" element={<EditTargetsPage />} />
      <Route path="/:ticker/buy" element={<BuyPage />} />
      <Route path="/:ticker/sell" element={<SellPage />} />
    </Routes>
  )
}

export default App
