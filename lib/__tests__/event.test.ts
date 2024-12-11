import { expect, it } from 'vitest'
import { createDomainDesigner } from '..'

it('event 定义', () => {
  const d = createDomainDesigner()
  const event1 = d.event('event1', ['field1', d.info.field.id('field2')])
  expect(event1._attributes.name).toBe('event1')
  expect(event1.inner.field1).not.toBeUndefined()
  expect(event1.inner.field2).not.toBeUndefined()

  const event2 = d.event('event2', () => ['field1', d.info.field.id('field2')])
  expect(event2._attributes.name).toBe('event2')
  expect(event2.inner.field1).not.toBeUndefined()
  expect(event2.inner.field2).not.toBeUndefined()
})
