import { sendJson } from './http'

export type TargetWeight = {
  ticker: string
  weight: number
}

const url = '/api/targets'

/** Full replace of the target allocation (must sum to 100%). */
export function putTargets(
  targetWeights: TargetWeight[],
): Promise<TargetWeight[]> {
  return sendJson<TargetWeight[]>(url, 'PUT', targetWeights)
}
