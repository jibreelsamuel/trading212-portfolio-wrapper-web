import { configureApi } from '@portfolio/shared'

export function configureWebApi(): void {
  configureApi({
    baseUrl: '',
    isDev: import.meta.env.DEV,
    requestTimeoutMs: 10_000,
    getToken: () => {
      const token = import.meta.env.APP_API_TOKEN
      if (typeof token !== 'string' || token.trim() === '') {
        return undefined
      }
      return token.trim()
    },
  })
}
