import { createDomainDesigner } from '..'
import { expect, it } from 'vitest'

it('注册元素', () => {
  const d = createDomainDesigner()

  // 用户
  const 用户 = d.actor('用户')
  // 聚合
  const 聚合 = d.agg('聚合', () => {
    return { 主键: d.info.field.id('主键') }
  })
  // 命令
  const 命令1 = d.command('命令1', {
    id: d.info.field.id('id'),
  })
  const 命令2 = d.facadeCmd('命令2', {
    id: d.info.field.id('id'),
  })
  // 事件
  const 事件 = d.event('事件', {
    id: 聚合.inner.主键,
  })
  // 策略
  const 策略 = d.policy('策略')
  // 服务
  const 服务 = d.service('服务')
  // 外部系统
  const 外部系统 = d.system('外部系统')

  const context = d._getContext()
  expect(context.getActors()[0]._attributes.__code).toEqual(用户._attributes.__code)
  expect(context.getCommands()[0]._attributes.__code).toEqual(命令1._attributes.__code)
  expect(context.getFacadeCommands()[0]._attributes.__code).toEqual(命令2._attributes.__code)
  expect(context.getAggs()[0]._attributes.__code).toEqual(聚合._attributes.__code)
  expect(context.getEvents()[0]._attributes.__code).toEqual(事件._attributes.__code)
  expect(context.getPolicies()[0]._attributes.__code).toEqual(策略._attributes.__code)
  expect(context.getServices()[0]._attributes.__code).toEqual(服务._attributes.__code)
  expect(context.getSystems()[0]._attributes.__code).toEqual(外部系统._attributes.__code)
})

it('箭头', () => {
  const d = createDomainDesigner()
  // 用户
  const 用户 = d.actor('用户')
  // 聚合
  const 聚合 = d.agg('聚合', () => {
    return { 主键: d.info.field.id('主键') }
  })
  // 命令
  const 命令1 = d.command('命令1', {
    id: d.info.field.id('id'),
  })
  const 命令2 = d.facadeCmd('命令2', {
    id: d.info.field.id('id'),
  })
  // 事件
  const 事件 = d.event('事件', { 主键: 聚合.inner.主键 })
  // 策略
  const 策略 = d.policy('策略')
  // 服务
  const 服务 = d.service('服务')
  // 外部系统
  const 外部系统 = d.system('外部系统')
  用户.command(命令1).agg(聚合).event(事件).policy(策略).service(服务)
  事件.system(外部系统)
  用户.facadeCmd(命令2).service(服务)

  const context = d._getContext()
  type Node = {
    _attributes: {
      __code: string
    }
  }
  function checkArrow(from: Node, to: Node) {
    expect(context.getArrows()[`${from._attributes.__code},${to._attributes.__code}`]).not.toBe(undefined)
  }
  checkArrow(用户, 命令1)
  checkArrow(命令1, 聚合)
  checkArrow(聚合, 事件)
  checkArrow(事件, 策略)
  checkArrow(策略, 服务)
  checkArrow(事件, 外部系统)
  checkArrow(用户, 命令2)
  checkArrow(命令2, 服务)
})

it('命令内部字段', () => {
  const d = createDomainDesigner()
  const 主键 = d.info.field.id('主键')
  const 命令1 = d.command('命令', { 主键 })
  const 命令2 = d.facadeCmd('命令', { 主键 })
  expect(命令1.inner.主键).not.toBeUndefined()
  expect(命令2.inner.主键).not.toBeUndefined()
})

it('聚合内部字段', () => {
  const d = createDomainDesigner()
  const 主键 = d.info.field.id('主键')
  const 聚合 = d.agg('聚合', { 主键 })
  expect(聚合.inner.主键).not.toBeUndefined()
})

it('事件内部字段', () => {
  const d = createDomainDesigner()
  const 主键 = d.info.field.id('主键')
  const 事件 = d.event('事件', { 主键 })
  expect(事件.inner.主键).not.toBeUndefined()
})

it('定义流程', () => {
  const d = createDomainDesigner()
  const 用户 = d.actor('用户')
  const 聚合 = d.agg('聚合', { 主键: d.info.field.id('主键') })
  const 命令1 = d.command('命令1', {
    id: 聚合.inner.主键,
  })
  const 命令2 = d.facadeCmd('命令2', {
    id: 聚合.inner.主键,
  })
  const 成功事件 = d.event('成功事件', {
    id: 聚合.inner.主键,
  })
  const 失败事件 = d.event('失败事件', {
    id: 聚合.inner.主键,
  })
  const 成功流程 = d.startWorkflow('成功流程')
  用户.command(命令1).agg(聚合).event(成功事件)
  const 失败流程 = d.startWorkflow('失败流程')
  用户.facadeCmd(命令2).agg(聚合).event(失败事件)
  d.defineUserStory('', [成功流程, 失败流程])

  expect(d._getContext().getWorkflows().成功流程.length).toEqual(4)
  expect(d._getContext().getWorkflows().失败流程.length).toEqual(4)
})
