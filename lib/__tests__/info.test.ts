import { expect, it } from 'vitest'
import { createDomainDesigner } from '..'

it('info类型', () => {
  const d = createDomainDesigner()
  const infoField = d.info.field.any('infoField')
  const infoFieldId = d.info.field.id('infoFieldId')
  const infoFieldTime = d.info.field.time('infoFieldTime')
  const infoFieldBool = d.info.field.bool('infoFieldBool')
  const infoFieldNum = d.info.field.num('infoFieldNum')
  const infoFieldStr = d.info.field.str('infoFieldStr')
  const infoFieldEnum = d.info.field.enum('infoFieldEnum')

  expect(infoField._attributes.type === 'Field').toBeTruthy()
  expect(infoField._attributes.subtype === 'Any').toBeTruthy()
  expect(infoFieldId._attributes.type === 'Field').toBeTruthy()
  expect(infoFieldId._attributes.subtype === 'Id').toBeTruthy()
  expect(infoFieldTime._attributes.type === 'Field').toBeTruthy()
  expect(infoFieldTime._attributes.subtype === 'Time').toBeTruthy()
  expect(infoFieldBool._attributes.type === 'Field').toBeTruthy()
  expect(infoFieldBool._attributes.subtype === 'Boolean').toBeTruthy()
  expect(infoFieldNum._attributes.type === 'Field').toBeTruthy()
  expect(infoFieldNum._attributes.subtype === 'Number').toBeTruthy()
  expect(infoFieldStr._attributes.type === 'Field').toBeTruthy()
  expect(infoFieldStr._attributes.subtype === 'String').toBeTruthy()
  expect(infoFieldEnum._attributes.type === 'Field').toBeTruthy()
  expect(infoFieldEnum._attributes.subtype === 'Enum').toBeTruthy()

  const infoDoc = d.info.doc('infoDoc')
  expect(infoDoc._attributes.type).toEqual('Document')

  const infoFunc = d.info.func('infoFunc', [infoFieldId, infoDoc, infoField])
  expect(infoFunc._attributes.type).toEqual('Function')
  expect(infoFunc._attributes.subtype.length).toEqual(3)
})

it('info func类型', () => {
  const d = createDomainDesigner()
  expect(d._getContext()).not.toBeUndefined()
  const infoFieldId = d.info.field.id('infoFieldId')
  const infoFieldTime = d.info.field.time('infoFieldTime')
  const infoFunc = d.info.func('infoFunc', [infoFieldId, infoFieldTime])
  expect(infoFunc._attributes.type).toEqual('Function')
  expect(infoFunc._attributes.subtype.length).toEqual(2)
})
