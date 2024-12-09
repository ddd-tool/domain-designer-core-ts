import { createDomainDesigner } from '..'
import { expect, it } from 'vitest'
import { LinkType } from '../common'

it('注册元素', () => {
  const d = createDomainDesigner()

  // 用户
  const 用户 = d.actor('用户')
  // 聚合
  const 聚合 = d.agg('聚合', () => {
    return [d.info.field.id('主键')]
  })
  // 命令
  const 命令1 = d.command('命令1', [d.info.field.id('id')])
  const 命令2 = d.facadeCmd('命令2', [d.info.field.id('id')])
  // 事件
  const 事件 = d.event('事件', [聚合.inner.主键])
  // 策略
  const 策略 = d.policy('策略')
  // 服务
  const 服务 = d.service('服务')
  // 外部系统
  const 外部系统 = d.system('外部系统')
  // 读模型
  const 读模型 = d.readModel('读模型', [d.info.field.id('id')])

  const context = d._getContext()
  expect(context.getActors()[0]._attributes.__code).toEqual(用户._attributes.__code)
  expect(context.getCommands()[0]._attributes.__code).toEqual(命令1._attributes.__code)
  expect(context.getFacadeCommands()[0]._attributes.__code).toEqual(命令2._attributes.__code)
  expect(context.getAggs()[0]._attributes.__code).toEqual(聚合._attributes.__code)
  expect(context.getEvents()[0]._attributes.__code).toEqual(事件._attributes.__code)
  expect(context.getPolicies()[0]._attributes.__code).toEqual(策略._attributes.__code)
  expect(context.getServices()[0]._attributes.__code).toEqual(服务._attributes.__code)
  expect(context.getSystems()[0]._attributes.__code).toEqual(外部系统._attributes.__code)
  expect(context.getReadModels()[0]._attributes.__code).toEqual(读模型._attributes.__code)
})

it('连接', () => {
  const d = createDomainDesigner()
  // 用户
  const 用户 = d.actor('用户')
  // 聚合
  const 聚合 = d.agg('聚合', () => {
    return [d.info.field.id('主键')]
  })
  // 命令
  const 命令1 = d.command('命令1', [d.info.any('id')])
  const 命令2 = d.facadeCmd('命令2', [d.info.field.id('id')])
  // 事件
  const 事件 = d.event('事件', [聚合.inner.主键])
  // 策略
  const 策略 = d.policy('策略')
  // 服务
  const 服务 = d.service('服务')
  // 外部系统
  const 外部系统 = d.system('外部系统')
  // 读模型
  const 读模型 = d.readModel('读模型', [d.info.field.id('id')])
  用户.command(命令1).agg(聚合).event(事件).policy(策略).service(服务)
  事件.system(外部系统)
  用户.facadeCmd(命令2).service(服务)
  事件.readModel(读模型)
  用户.readModel(读模型)

  const context = d._getContext()
  type Node = {
    _attributes: {
      __code: string
      rule: string
    }
  }
  function checkLink(from: Node, to: Node, linkType: LinkType = 'Association') {
    expect(
      context.getLinks()[
        `${from._attributes.rule},${from._attributes.__code},${to._attributes.rule},${to._attributes.__code}`
      ]
    ).toBe(linkType)
  }
  checkLink(用户, 命令1)
  checkLink(命令1, 聚合)
  checkLink(聚合, 事件)
  checkLink(事件, 策略)
  checkLink(策略, 服务)
  checkLink(事件, 外部系统)
  checkLink(用户, 命令2)
  checkLink(命令2, 服务)
  checkLink(事件, 读模型, 'Aggregation')
  checkLink(用户, 读模型, 'Dependency')
})

it('命令内部字段', () => {
  const d = createDomainDesigner()
  const 主键 = d.info.field.id('主键')
  const 命令1 = d.command('命令', [主键])
  const 命令2 = d.facadeCmd('命令', [主键])
  expect(命令1.inner.主键).not.toBeUndefined()
  expect(命令2.inner.主键).not.toBeUndefined()
})

it('聚合内部字段', () => {
  const d = createDomainDesigner()
  const 主键 = d.info.field.id('主键')
  const 聚合 = d.agg('聚合', [主键])
  expect(聚合.inner.主键).not.toBeUndefined()
})

it('事件内部字段', () => {
  const d = createDomainDesigner()
  const 主键 = d.info.field.id('主键')
  const 事件 = d.event('事件', [主键])
  expect(事件.inner.主键).not.toBeUndefined()
})

it('定义流程', () => {
  const d = createDomainDesigner()
  const 用户 = d.actor('用户')
  const 聚合 = d.agg('聚合', [d.info.field.id('主键')])
  const 命令1 = d.command('命令1', [聚合.inner.主键])
  命令1.inner
  const 命令2 = d.facadeCmd('命令2', [聚合.inner.主键])
  const 成功事件 = d.event('成功事件', [聚合.inner.主键])
  const 失败事件 = d.event('失败事件', [聚合.inner.主键])
  const 成功流程 = d.startWorkflow('成功流程')
  用户.command(命令1).agg(聚合).event(成功事件)
  const 失败流程 = d.startWorkflow('失败流程')
  用户.facadeCmd(命令2).agg(聚合).event(失败事件)
  d.defineUserStory('', [成功流程, 失败流程])

  expect(d._getContext().getWorkflows().成功流程.length).toEqual(4)
  expect(d._getContext().getWorkflows().失败流程.length).toEqual(4)
})

// import { DomainDesignInfo, DomainDesignInfoType } from '../define'

// const d = createDomainDesigner()

// type DemoType<T> = T extends DomainDesignInfo<DomainDesignInfoType, string> ? T : never
// function f<T>(f: DemoType<T>) {}
// f(d.info.any('id'))

// type InfoType = 'Any' | 'String'
// type Info<TYPE extends InfoType, NAME extends string> = {
//   type: TYPE
//   name: NAME
// }

// type ArrayToObject<ARR extends Array<Info<any, string> | string>> = {
//   [K in ARR[number] as K extends Info<any, infer U> ? U : K extends string ? K : never]: K extends Info<any, string>
//     ? K
//     : K extends string
//     ? Info<'Any', K>
//     : never
// }

// function exec<NAME extends string, ARR extends Array<NAME | Info<any, NAME>>>(t: ARR): ArrayToObject<ARR> {
//   return {} as ArrayToObject<typeof t>
// }

// const a = exec(['a', { type: 'Any', name: 'b' }])
// a
