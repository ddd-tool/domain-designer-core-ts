export { match_string } from './wasm'

import { match_table as _match_table } from './wasm'

type MatchRecord = {
  source: string
  target: string
  score: number
}

export type MatchResult = {
  matches: MatchRecord[]
}

export function match_table(sources: string[], targets: string[], threshold?: number): MatchResult {
  return _match_table(sources, targets, threshold)
}
