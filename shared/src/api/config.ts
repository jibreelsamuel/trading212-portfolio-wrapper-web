export type ApiConfig = {
  /** Origin + optional path prefix, e.g. '' (web proxy) or 'http://10.0.2.2:8080'. */
  baseUrl: string
  getToken: () => string | undefined
  /** Set once at startup by each app (Vite `import.meta.env.DEV`, Expo `__DEV__`). */
  isDev?: boolean
  /** Optional fetch abort (ms). Both web and mobile set this (typically 10s). */
  requestTimeoutMs?: number
}

let apiConfig: ApiConfig = {
  baseUrl: '',
  getToken: () => undefined,
  isDev: false,
}

export function configureApi(config: ApiConfig): void {
  apiConfig = config
}

export function getApiConfig(): ApiConfig {
  return apiConfig
}
