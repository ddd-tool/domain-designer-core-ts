import { expect, it } from 'vitest'
import { createDomainDesigner } from '..'

it('字符串转换模板函数', () => {
  const d = createDomainDesigner()
  const desc = d.desc('default')
  const agg = d.agg('agg', {}, '')
  const event = agg.event('event', {}, '')
  const policy = event.policy('policy', '')
  const person = d.person('person', '')
  const system = d.system('system', '')
  const service = d.service('service', '')
  const infoId = d.info.field.id('infoId', '')
  const command = d.command('command', {}, '')
  const facadeCmd = d.facadeCmd('facadeCmd', {}, '')
  expect(desc._attributes.template.reduce).instanceOf(Function)
  expect(agg._attributes.description?._attributes.template.reduce).instanceOf(Function)
  expect(event._attributes.description?._attributes.template.reduce).instanceOf(Function)
  expect(policy._attributes.description?._attributes.template.reduce).instanceOf(Function)
  expect(person._attributes.description?._attributes.template.reduce).instanceOf(Function)
  expect(system._attributes.description?._attributes.template.reduce).instanceOf(Function)
  expect(service._attributes.description?._attributes.template.reduce).instanceOf(Function)
  expect(infoId._attributes.description?._attributes.template.reduce).instanceOf(Function)
  expect(command._attributes.description?._attributes.template.reduce).instanceOf(Function)
  expect(facadeCmd._attributes.description?._attributes.template.reduce).instanceOf(Function)
})

it('字符串模板类型校验', () => {
  const d = createDomainDesigner()
  const agg = d.agg('agg', {})
  const event = d.event('event', {})
  const policy = d.policy('policy')
  const person = d.person('person')
  const system = d.system('system')
  const service = d.service('service')
  const infoId = d.info.field.id('infoId')
  const command = d.command('command', {})
  const facadeCmd = d.facadeCmd('facadeCmd', {})
  const desc = d.desc`
    ${agg}
    ${event}
    ${policy}
    ${person}
    ${system}
    ${service}
    ${infoId}
    ${command}
    ${facadeCmd}
  `
  expect(desc._attributes.values.length).toEqual(9)
})
