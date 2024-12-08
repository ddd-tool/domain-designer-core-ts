import { expect, it } from 'vitest'
import { createDomainDesigner } from '..'

it('agg 定义', () => {
  const d = createDomainDesigner()
  const agg1 = d.agg('agg', {
    id: d.info.field.id('id'),
  })
  const agg2 = d.agg('agg', () => {
    return {
      id: d.info.field.id('id'),
    }
  })
  expect(agg1.inner.id).not.toBeUndefined()
  expect(agg2.inner.id).not.toBeUndefined()
})
