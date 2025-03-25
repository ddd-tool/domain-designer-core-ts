import { it, expect } from 'vitest'
import { loadWasm } from '../index'

it('loadWasm', async () => {
  const api = await loadWasm()
  expect(api.matchString).instanceOf(Function)
  expect(api.matchTable).instanceOf(Function)
})
