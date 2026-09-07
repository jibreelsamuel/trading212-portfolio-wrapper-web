import { getApiConfig } from './config'
import { maybeDevDelay, maybeDevForceFailure } from './httpDev'

/** Matches backend ApiError / ApiValidationError. */
type ApiErrorBody = {
  error?: string
  errors?: string[]
}

/** HTTP methods that send a JSON body (not GET). */
type JsonWriteMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE'

function resolveUrl(path: string): string {
  const { baseUrl } = getApiConfig()
  const normalizedBase = baseUrl.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

function authHeaders(): HeadersInit {
  const token = getApiConfig().getToken()
  if (token == null || token.trim() === '') {
    return {}
  }
  return { Authorization: `Bearer ${token.trim()}` }
}

/**
 * If the response is not OK, throw with backend error text when present,
 * otherwise `HTTP ${status}`.
 */
async function throwIfNotOk(response: Response): Promise<void> {
  if (response.ok) {
    return
  }

  let message = `HTTP ${response.status}`
  try {
    const body = (await response.json()) as ApiErrorBody
    if (body.errors?.length) {
      message = body.errors.join('; ')
    } else if (body.error != null && body.error !== '') {
      message = body.error
    }
  } catch {
    // non-JSON body — keep status message
  }

  throw new Error(message)
}

function throwIfFetchFailed(error: unknown, timeoutMs?: number): never {
  if (
    timeoutMs != null &&
    timeoutMs > 0 &&
    error instanceof Error &&
    (error.name === 'TimeoutError' || error.name === 'AbortError')
  ) {
    throw new Error(`Request timed out after ${timeoutMs / 1000}s`)
  }
  if (error instanceof Error) {
    throw error
  }
  throw new Error('Request failed')
}

function createTimeoutSignal(ms: number): {
  signal: AbortSignal
  clear: () => void
} {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timer),
  }
}

async function fetchJson(
  url: string,
  init: RequestInit,
): Promise<Response> {
  await maybeDevDelay()
  maybeDevForceFailure()

  const resolved = resolveUrl(url)
  if (getApiConfig().isDev) {
    console.log(`[api] ${init.method ?? 'GET'} ${resolved}`)
  }

  const timeoutMs = getApiConfig().requestTimeoutMs
  const timeout =
    timeoutMs != null && timeoutMs > 0
      ? createTimeoutSignal(timeoutMs)
      : undefined

  let response: Response
  try {
    response = await fetch(resolved, {
      ...init,
      ...(timeout != null ? { signal: timeout.signal } : {}),
    })
  } catch (error) {
    throwIfFetchFailed(error, timeoutMs)
  } finally {
    timeout?.clear()
  }
  return response
}

/** Shared GET helper: fetch JSON or throw with backend message. */
export async function getJson<T>(url: string): Promise<T> {
  const response = await fetchJson(url, {
    headers: {
      ...authHeaders(),
    },
  })
  await throwIfNotOk(response)
  return (await response.json()) as T
}

/**
 * Shared JSON write helper.
 * `body` is `unknown` because this layer only serializes — callers pass
 * their own typed request objects; we do not validate shape here.
 */
export async function sendJson<T>(
  url: string,
  method: JsonWriteMethod,
  body: unknown,
): Promise<T> {
  const response = await fetchJson(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  })
  await throwIfNotOk(response)
  return (await response.json()) as T
}
