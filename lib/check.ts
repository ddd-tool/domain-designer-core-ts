import { DomainDesigner } from 'lib'
import { match_string } from './wasm/wasm'

export type Problem = {}

export function checkDomainDesigner(_d: DomainDesigner): void {
  match_string('a', 'b')
}
