import { checkWorkflow, createDomainDesigner, isDomainDesigner } from '..'
import { expect, it } from 'vitest'
import { LinkType } from '../common'

it('注册元素', () => {
  const d = createDomainDesigner()

  // 用户
  const 用户 = d.actor('用户')
  // 聚合
  const 聚合 = d.agg('聚合', () => {
    return [d.info.id('主键')]
  })
  // 命令
  const 命令1 = d.command('命令1', [d.info.id('id')])
  const 命令2 = d.facadeCmd('命令2', [d.info.id('id')])
  // 事件
  const 事件 = d.event('事件', [聚合.inner.主键])
  // 策略
  const 策略 = d.policy('策略')
  // 服务
  const 服务 = d.service('服务')
  // 外部系统
  const 外部系统 = d.system('外部系统')
  // 读模型
  const 读模型 = d.readModel('读模型', [d.info.id('id')])

  const context = d._getContext()
  expect(context.getActors()[0]._attributes.__id).toEqual(用户._attributes.__id)
  expect(context.getCommands()[0]._attributes.__id).toEqual(命令1._attributes.__id)
  expect(context.getFacadeCommands()[0]._attributes.__id).toEqual(命令2._attributes.__id)
  expect(context.getAggs()[0]._attributes.__id).toEqual(聚合._attributes.__id)
  expect(context.getEvents()[0]._attributes.__id).toEqual(事件._attributes.__id)
  expect(context.getPolicies()[0]._attributes.__id).toEqual(策略._attributes.__id)
  expect(context.getServices()[0]._attributes.__id).toEqual(服务._attributes.__id)
  expect(context.getSystems()[0]._attributes.__id).toEqual(外部系统._attributes.__id)
  expect(context.getReadModels()[0]._attributes.__id).toEqual(读模型._attributes.__id)
})

it('连接', () => {
  const d = createDomainDesigner()
  // 用户
  const 用户 = d.actor('用户')
  // 聚合
  const 聚合 = d.agg('聚合', () => {
    return [d.info.id('主键')]
  })
  // 命令
  const 命令1 = d.command('命令1', [d.info.valueObj('id')])
  const 命令2 = d.facadeCmd('命令2', [d.info.id('id')])
  // 事件
  const 事件 = d.event('事件', [聚合.inner.主键])
  // 策略
  const 策略 = d.policy('策略')
  // 服务
  const 服务 = d.service('服务')
  // 外部系统
  const 外部系统 = d.system('外部系统')
  // 读模型
  const 读模型 = d.readModel('读模型', [d.info.id('id')])
  用户.command(命令1).agg(聚合).event(事件).policy(策略).service(服务)
  事件.system(外部系统)
  用户.facadeCmd(命令2).service(服务)
  事件.readModel(读模型)
  用户.readModel(读模型)

  const context = d._getContext()
  type Node = {
    _attributes: {
      __id: string
      rule: string
    }
  }
  function checkLink(from: Node, to: Node, linkType: LinkType = 'Association') {
    expect(
      context.getLinks()[
        `${from._attributes.rule},${from._attributes.__id},${to._attributes.rule},${to._attributes.__id}`
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
  const 主键 = d.info.id('主键')
  const 命令1 = d.command('命令', [主键])
  const 命令2 = d.facadeCmd('命令', [主键])
  expect(命令1.inner.主键).not.toBeUndefined()
  expect(命令2.inner.主键).not.toBeUndefined()
})

it('聚合内部字段', () => {
  const d = createDomainDesigner()
  const 主键 = d.info.id('主键')
  const 聚合 = d.agg('聚合', [主键])
  expect(聚合.inner.主键).not.toBeUndefined()
})

it('事件内部字段', () => {
  const d = createDomainDesigner()
  const 主键 = d.info.id('主键')
  const 事件 = d.event('事件', [主键])
  expect(事件.inner.主键).not.toBeUndefined()
})

it('定义流程', () => {
  const d = createDomainDesigner()
  const 用户 = d.actor('用户')
  const 聚合 = d.agg('聚合', [d.info.id('主键')])
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

it('designer类型判断', () => {
  const d = createDomainDesigner()
  expect(isDomainDesigner(d)).toBeTruthy()
})

it('完整流程', () => {
  const d = createDomainDesigner()

  // 用户
  const 用户 = d.actor('用户', '下单用户')

  // 聚合
  const 用户账号 = d.info.valueObj(
    '用户账号',
    d.desc`用户账号的数据来自于XXX，
它包含了用户在本平台的各种权限数据以及主要增值服务的开通信息`
  )
  const 订单号 = d.info.id('订单号', d.desc`订单号为业务主键，仓储可以根据它查询出全局唯一的一个订单聚合`)
  const 下单时间 = d.info.valueObj('下单时间')
  const 商品价格 = d.info.valueObj('商品价格')
  const 商品数量 = d.info.valueObj('商品数量')
  const 订单金额 = d.info.func(
    '订单金额',
    [商品价格, 商品数量],
    d.desc`计算公式为【订单金额】= ${商品价格} x ${商品数量}`
  )
  const 订单聚合 = d.agg('订单聚合', [订单号, 下单时间, 用户账号, 商品价格, 商品数量, 订单金额], '这是订单聚合')

  // 命令
  const 创建订单 = d.command('创建订单', ['订单号', 用户账号])
  const 自动扣款 = d.command('自动扣款', [订单号])

  // 事件
  const 下单成功 = d.event('下单成功', [订单号, 下单时间])
  const 下单失败 = d.event('下单失败', [订单号, 下单时间])
  const 扣款成功 = d.event('扣款成功', [订单号, 下单时间])
  const 扣款失败 = d.event('扣款失败', [订单号, 下单时间])
  // 规则
  const 付款规则 = d.policy(
    '付款规则',
    d.desc`
如果${用户账号}开通了自动扣费服务，则发起自动扣款
规则1：
规则2：
规则3：
... ...
  `
  )
  // 服务
  const 自动扣款服务 = d.service('自动扣款服务', '根据付款规则发起自动扣款')
  // 外部系统
  const 物流系统 = d.system('物流系统')
  const 邮件系统 = d.system('邮件系统')

  // 读模型
  const 订单详情 = d.readModel(
    '订单详情读模型',
    [订单号, 下单时间],
    d.desc`${自动扣款服务}
`
  )

  const 创建订单失败流程 = d.startWorkflow('创建订单失败')
  用户.command(创建订单).agg(订单聚合).event(下单失败)
  下单失败.system(邮件系统)

  const 创建订单成功_自动扣款失败流程 = d.startWorkflow('创建订单成功，自动扣款失败')
  用户.command(创建订单)
    .agg(订单聚合)
    .event(下单成功)
    .policy(付款规则)
    .service(自动扣款服务)
    .command(自动扣款)
    .agg(订单聚合)
    .event(扣款失败)
  扣款失败.readModel(订单详情)
  扣款失败.system(邮件系统)

  const 创建订单成功_自动扣款成功流程 = d.startWorkflow('创建订单成功，自动扣款成功')
  用户.command(创建订单)
    .agg(订单聚合)
    .event(下单成功)
    .policy(付款规则)
    .service(自动扣款服务)
    .command(自动扣款)
    .agg(订单聚合)
    .event(扣款成功)
  扣款成功.readModel(订单详情)
  扣款成功.system(物流系统)

  d.startWorkflow('未归纳流程')
  用户.command(创建订单).agg(订单聚合).event(下单失败)
  下单失败.system(邮件系统)

  d.startWorkflow('读模型')
  const 用户读 = d.actor('用户', '用户(读模型)')
  用户读.readModel(订单详情)

  d.defineUserStory('作为商城用户，我要下单并且实现自动扣款，以便购得心仪得商品', [
    创建订单失败流程,
    创建订单成功_自动扣款失败流程,
    创建订单成功_自动扣款成功流程,
  ])

  d.defineUserStory('作为商城用户，我要查看订单情况，以便了解订单状态', [创建订单成功_自动扣款成功流程])

  const chekcResult = checkWorkflow(d, 创建订单成功_自动扣款失败流程)
  expect(Object.values(chekcResult).length).toBe(6)
  expect(Object.values(chekcResult)[0].length).toBe(1)
  expect(Object.values(chekcResult)[1].length).toBe(0)
  expect(Object.values(chekcResult)[2].length).toBe(0)
  expect(Object.values(chekcResult)[3].length).toBe(0)
  expect(Object.values(chekcResult)[4].length).toBe(0)
  expect(Object.values(chekcResult)[5].length).toBe(0)
})
