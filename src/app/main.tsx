import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@portfolio/shared'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { configureWebApi } from '../api/configureWebApi'
import App from './App'
import '../index.css'

configureWebApi()

const queryClient = createQueryClient()

// StrictMode double-mounts effects in dev → two /api/portfolio calls → T212 429
// (account summary is limited to 1 req / 5s). staleTime reduces nav refetches;
// keep StrictMode off until we’re sure mount dedupe is enough under load.
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>,
)
