import { expect, it } from 'vitest'
import { checkDomainDesigner, checkStory, checkWorkflow } from '../check'
import { createDomainDesigner } from '..'
import { match_string, match_table } from '../wasm'

it('wasm', async () => {
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

it('check', async () => {
  const d = createDomainDesigner()
  const age = d.info.valueObj('age')
  const command = d.command('command', ['id', 'name', age])
  const agg = d.agg('agg', ['id', 'name', age])
  const workflow = d.startWorkflow('123')
  command.agg(agg)
  d.defineUserStory('story', [workflow])
  const result1 = await checkWorkflow(d, workflow)
  const result2 = await checkStory(d, 'story')
  const result3 = await checkDomainDesigner(d)

  expect(Object.values(result1)[0].length).toBe(2)
  expect(Object.values(result2)[0].length).toBe(2)
  expect(Object.values(result3)[0].length).toBe(2)
})
