import { expect, it } from 'vitest'
import { createDomainDesigner } from '..'

it('info类型', () => {
  const d = createDomainDesigner()
  const infoDoc = d.info.document('infoDoc')
  const infoId = d.info.id('infoId')
  const infoVo1 = d.info.valueObj('infoVo', '备注')
  const infoVo2 = d.info.valueObj('infoVo', '备注')
  const infoFunc1 = d.info.func('infoFunc', '')
  const infoFunc2 = d.info.func('infoFunc', [infoId, infoVo1, infoDoc])

  const map = d._getContext().getIdMap()

  expect(infoDoc._attributes.type === 'Document').toBeTruthy()
  expect(infoDoc._attributes.subtype === 'None').toBeTruthy()
  expect(map[infoDoc._attributes.__id]).instanceOf(Object)
  expect(infoId._attributes.type === 'Id').toBeTruthy()
  expect(infoId._attributes.subtype === 'None').toBeTruthy()
  expect(map[infoId._attributes.__id]).instanceOf(Object)
  expect(infoVo1._attributes.type).toEqual('ValueObject')
  expect(infoVo1._attributes.subtype).toBe('None')
  expect(map[infoVo1._attributes.__id]).instanceOf(Object)
  expect(infoVo2._attributes.type).toEqual('ValueObject')
  expect(infoVo2._attributes.subtype).toBe('None')
  expect(map[infoVo2._attributes.__id]).instanceOf(Object)
  expect(infoVo2._attributes.description).instanceOf(Object)
  expect(infoFunc1._attributes.type === 'Function').toBeTruthy()
  expect(typeof infoFunc1._attributes.subtype === 'object').toBeTruthy()
  expect(infoFunc1._attributes.subtype.length).toBe(0)
  expect(map[infoFunc1._attributes.__id]).instanceOf(Object)
  expect(infoFunc2._attributes.type).toEqual('Function')
  expect(infoFunc2._attributes.subtype.length).toEqual(3)
  expect(map[infoFunc2._attributes.__id]).instanceOf(Object)
})

it('info.func 糖', () => {
  const d = createDomainDesigner()
  const func = d.info.func('func', ['field1', ['field2', '']])
  expect(func._attributes.subtype.length).toBe(2)
  expect(func._attributes.subtype[0]._attributes.name).toBe('field1')
  expect(func._attributes.subtype[1]._attributes.name).toBe('field2')
})
