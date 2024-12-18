import { expect, it } from 'vitest'
import { createDomainDesigner } from '..'

it('info类型', () => {
  const d = createDomainDesigner()
  const infoDoc = d.info.document('infoDoc')
  const infoId = d.info.id('infoId')
  const infoVo1 = d.info.valueObj('infoVo', '备注')
  const infoVo2 = d.info.valueObj('infoVo', ['field1'], '备注')
  const infoFunc1 = d.info.func('infoFunc', '')
  const infoFunc2 = d.info.func('infoFunc', [infoId, infoVo1, infoDoc])

  expect(infoDoc._attributes.type === 'Document').toBeTruthy()
  expect(infoDoc._attributes.subtype === 'None').toBeTruthy()
  expect(infoId._attributes.type === 'Id').toBeTruthy()
  expect(infoId._attributes.subtype === 'None').toBeTruthy()
  expect(infoFunc1._attributes.type === 'Function').toBeTruthy()
  expect(typeof infoFunc1._attributes.subtype === 'object').toBeTruthy()
  expect(infoVo1._attributes.type).toEqual('ValueObject')
  expect(infoVo1._attributes.subtype.length).toBe(0)
  expect(infoVo2._attributes.type).toEqual('ValueObject')
  expect(infoVo2._attributes.subtype.length).toBe(1)
  expect(infoFunc1._attributes.subtype.length).toBe(0)
  expect(infoFunc2._attributes.type).toEqual('Function')
  expect(infoFunc2._attributes.subtype.length).toEqual(3)
})
