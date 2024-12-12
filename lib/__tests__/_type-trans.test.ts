import { expect, it } from 'vitest'
import { createDomainDesigner } from '..'

it('', () => {
  const d = createDomainDesigner()
  const 命令 = d.command('命令', [
    'a',
    d.info.any('b'),
    d.info.entity('c', []),
    d.info.func('d', [d.info.any('d')]),
    d.info.field.any('e'),
    d.info.field.bool('f'),
    d.info.field.enum('g'),
    d.info.field.id('h'),
    d.info.field.num('i'),
    d.info.field.str('j'),
    d.info.field.time('k'),
  ])
  expect(命令.inner.b._attributes.name).toBe('b')
  expect(命令.inner.a._attributes.name).toBe('a')
  expect(命令.inner.c._attributes.name).toBe('c')
  expect(命令.inner.d._attributes.name).toBe('d')
  expect(命令.inner.e._attributes.name).toBe('e')
  expect(命令.inner.f._attributes.name).toBe('f')
  expect(命令.inner.g._attributes.name).toBe('g')
  expect(命令.inner.h._attributes.name).toBe('h')
  expect(命令.inner.i._attributes.name).toBe('i')
  expect(命令.inner.j._attributes.name).toBe('j')
  expect(命令.inner.k._attributes.name).toBe('k')

  const 事件 = d.event('事件', ['中文， 【 ? 事件'])
  expect(事件.inner['中文， 【 ? 事件']._attributes.name).toBe('中文， 【 ? 事件')

  const 聚合 = d.agg('聚合', ['id', d.info.any('name')])
  expect(聚合.inner.id._attributes.name).toBe('id')
  expect(聚合.inner.name._attributes.name).toBe('name')

  const actor = d.actor('actor')
  const command = actor.command('命令', ['a1', d.info.field.time('a2')])
  expect(command.inner.a1._attributes.name).toBe('a1')
  expect(command.inner.a2._attributes.name).toBe('a2')
  const agg = command.agg('聚合', ['b1', d.info.entity('b2'), d.info.func('b3', ['b4', d.info.field.bool('b5')])])
  expect(agg.inner.b1._attributes.name).toBe('b1')
  expect(agg.inner.b2._attributes.name).toBe('b2')
  expect(agg.inner.b3._attributes.name).toBe('b3')
  const event = agg.event('事件', ['c1', d.info.any('c2')])
  expect(event.inner.c1._attributes.name).toBe('c1')
  expect(event.inner.c2._attributes.name).toBe('c2')
})
