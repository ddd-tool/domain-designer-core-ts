import { expect, it } from 'vitest'
import { checkDomainDesigner, checkStory, checkWorkflow } from '../check'
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

it('check', () => {
  const d = createDomainDesigner()
  const command = d.command('command', ['id'])
  const agg = d.agg('agg', ['id'])
  const workflow = d.startWorkflow('123')
  command.agg(agg)
  d.defineUserStory('story', [workflow])
  const result1 = checkDomainDesigner(d)
  const result3 = checkStory(d, 'story')
  const result2 = checkWorkflow(d, workflow)

  expect(Object.values(result1).length).toBe(1)
  expect(Object.values(result2).length).toBe(1)
  expect(Object.values(result3).length).toBe(1)
})
