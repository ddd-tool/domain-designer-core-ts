import { expect, it } from 'vitest'
import { checkDomainDesigner } from '../check'
import { createDomainDesigner } from '..'
import { match_string, match_table } from '../wasm'

it('wasm', () => {
  const f = match_string('a', 'a')
  expect(f).toBe(1)
  const m = match_table(['a', 'b'], ['a', 'b'], 0.7)
  expect(m.matches.length).toBe(2)
  expect(m.matches[0].source).toBe('a')
  expect(m.matches[0].target).toBe('a')
  expect(m.matches[0].score).toBe(1)
  expect(m.matches[1].source).toBe('b')
  expect(m.matches[1].target).toBe('b')
  expect(m.matches[1].score).toBe(1)
})
