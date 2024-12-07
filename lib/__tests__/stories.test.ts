import { expect, it } from 'vitest'
import { createDomainDesigner } from '..'

it('self design', () => {
  const d = createDomainDesigner()

  const 领域专家 = d.person('领域专家')
  const 开发人员 = d.person('开发人员')

  const 强类型需求 = (function () {
    const 现有基础设施 = d.info.doc('现有基础设施')
    const 现有痛点 = d.info.doc('现有痛点')
    const 软件应用场景 = d.info.doc('软件应用场景')
    const 预期业务效果 = d.info.doc('预期效果')
    const 性能指标 = d.info.doc('性能指标')
    const 是否已确定软件价值 = d.info.func('软件价值', [现有痛点, 现有基础设施, 软件应用场景, 预期业务效果, 性能指标])
    return d.agg('强类型需求', {
      UI和UE设计: d.info.doc('UI和UE设计'),
      详细设计: d.info.doc('详细设计'),
      现有痛点,
      现有基础设施,
      软件应用场景,
      预期业务效果,
      性能指标,
      是否已确定软件价值,
    })
  })()

  const 确定软件价值 = d.command(
    '确定软件价值',
    { 是否已确定软件价值: 强类型需求.inner.是否已确定软件价值 },
    d.desc`与${领域专家}沟通`
  )

  const 已确定软件价值 = d.event('已确定软件价值', {
    现有痛点: 强类型需求.inner.现有痛点,
    现有基础设施: 强类型需求.inner.现有基础设施,
    软件应用场景: 强类型需求.inner.软件应用场景,
    预期业务效果: 强类型需求.inner.预期业务效果,
    性能指标: 强类型需求.inner.性能指标,
  })

  const 未确定软件价值 = d.event('未确定软件价值', {
    模糊地带: d.info.field('模糊地带'),
  })

  const 继续沟通 = d.policy(
    '继续沟通',
    d.desc`
    ${开发人员}与${领域专家}沟通
      1、${未确定软件价值}的${未确定软件价值.inner.模糊地带}
    `
  )

  const 开发人员成功确定软件价值 = d.startWorkflow('开发人员成功确定软件价值')
  开发人员.command(确定软件价值).agg(强类型需求).event(已确定软件价值)

  const 开发人员未确定软件价值 = d.startWorkflow('开发人员未确定软件价值')
  开发人员.command(确定软件价值).agg(强类型需求).event(未确定软件价值).policy(继续沟通)

  d.setUserStory('用户故事：确定软件价值', [开发人员成功确定软件价值, 开发人员未确定软件价值])

  expect(Object.keys(d._getContext().getUserStories()).length).toBe(1)
  expect(Object.values(d._getContext().getUserStories())[0].length).toBe(2)
})
