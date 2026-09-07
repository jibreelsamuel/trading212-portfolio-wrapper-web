/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Same value as backend APP_API_TOKEN (from shell env when Vite starts). */
  readonly APP_API_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
