import { expect, it } from 'vitest'
import { createDomainDesigner } from '..'

it('初始化指令', () => {
  const d = createDomainDesigner()

  const command1 = d.command('command1', ['field1', d.info.valueObj('field2')])
  expect(command1._attributes.name).toBe('command1')
  expect(command1.inner.field1).not.toBeUndefined()
  expect(command1.inner.field2).not.toBeUndefined()

  const command2 = d.command('command2', () => ['field1', d.info.valueObj('field2')])
  expect(command2._attributes.name).toBe('command2')
  expect(command2.inner.field1).not.toBeUndefined()
  expect(command2.inner.field2).not.toBeUndefined()

  const facadeCmd1 = d.facadeCmd('facadeCmd1', ['field1', d.info.valueObj('field2')])
  expect(facadeCmd1._attributes.name).toBe('facadeCmd1')
  expect(facadeCmd1.inner.field1).not.toBeUndefined()
  expect(facadeCmd1.inner.field2).not.toBeUndefined()

  const facadeCmd2 = d.facadeCmd('facadeCmd2', () => ['field1', d.info.valueObj('field2')])
  expect(facadeCmd2._attributes.name).toBe('facadeCmd2')
  expect(facadeCmd2.inner.field1).not.toBeUndefined()
  expect(facadeCmd2.inner.field2).not.toBeUndefined()
})
