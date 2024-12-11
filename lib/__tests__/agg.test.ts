import { expect, it } from 'vitest'
import { createDomainDesigner } from '..'

it('agg 定义', () => {
  const d = createDomainDesigner()
  const agg1 = d.agg('agg1', ['field1', d.info.field.id('field2')])
  expect(agg1._attributes.name).toBe('agg1')
  expect(agg1.inner.field1).not.toBeUndefined()
  expect(agg1.inner.field2).not.toBeUndefined()

  const agg2 = d.agg('agg2', () => ['field1', d.info.field.id('field2')])
  expect(agg2._attributes.name).toBe('agg2')
  expect(agg2.inner.field1).not.toBeUndefined()
  expect(agg2.inner.field2).not.toBeUndefined()
})
