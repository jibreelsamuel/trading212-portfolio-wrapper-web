import { getApiConfig } from './config'

/**
 * Dev-only HTTP knobs. Flip these while checking LoadingState / ErrorState.
 * No-ops unless `configureApi({ isDev: true })` was set at app startup.
 */

/** Pause before each request (ms). `0` = off. */
export const DEV_ARTIFICIAL_DELAY_MS = 0

/** Force every request to throw. `false` = off. */
export const DEV_FORCE_FETCH_FAILURE = false

function isDevEnabled(): boolean {
  return getApiConfig().isDev === true
}

export async function maybeDevDelay(): Promise<void> {
  if (!isDevEnabled() || DEV_ARTIFICIAL_DELAY_MS <= 0) {
    return
  }
  await new Promise((resolve) => setTimeout(resolve, DEV_ARTIFICIAL_DELAY_MS))
}

export function maybeDevForceFailure(): void {
  if (!isDevEnabled() || !DEV_FORCE_FETCH_FAILURE) {
    return
  }
  throw new Error('Dev: forced fetch failure')
}
