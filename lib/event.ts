import { genId, useInternalContext } from './common'
import {
  DomainDesignEvent,
  DomainDesignDesc,
  DomainDesignPolicy,
  DomainDesignSystem,
  DomainDesignEventProvider,
  DomainDesignReadModel,
  NonEmptyInitFunc,
  NonEmptyArray,
  CustomInfoArrayToInfoObject,
  CustomInfo,
} from './define'

export function eventProvider(designId: string): DomainDesignEventProvider {
  const RULE = 'Event'
  return <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infoInitializer: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignEvent<CustomInfoArrayToInfoObject<ARR>> => {
    const context = useInternalContext(designId)
    const infos = context.customInfoArrToInfoObj(
      infoInitializer instanceof Function ? infoInitializer() : infoInitializer
    )
    const __id = genId()

    function policy(param: DomainDesignPolicy): DomainDesignPolicy
    function policy(name: string, desc?: string | DomainDesignDesc): DomainDesignPolicy
    function policy(param1: DomainDesignPolicy | string, desc?: string | DomainDesignDesc): DomainDesignPolicy {
      if (typeof param1 === 'object') {
        context.linkTo(RULE, __id, param1._attributes.rule, param1._attributes.__id)
        return param1
      }
      const p = context.createPolicy(param1, desc)
      context.linkTo(RULE, __id, p._attributes.rule, p._attributes.__id)
      return p
    }

    function system(param: DomainDesignSystem): DomainDesignSystem
    function system(name: string, desc?: string | DomainDesignDesc): DomainDesignSystem
    function system(param1: DomainDesignSystem | string, desc?: string | DomainDesignDesc): DomainDesignSystem {
      if (typeof param1 === 'object') {
        context.linkTo(RULE, __id, param1._attributes.rule, param1._attributes.__id)
        return param1
      }
      const s = context.createSystem(param1, desc)
      context.linkTo(RULE, __id, s._attributes.rule, s._attributes.__id)
      return s
    }

    function readModel<READ_MODEL extends DomainDesignReadModel<any>>(param: READ_MODEL): READ_MODEL
    function readModel<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
      name: string,
      infos: ARR | NonEmptyInitFunc<() => ARR>,
      desc?: string | DomainDesignDesc
    ): DomainDesignReadModel<CustomInfoArrayToInfoObject<ARR>>
    function readModel<
      READ_MODEL extends DomainDesignReadModel<any>,
      G_NAME extends string,
      ARR extends NonEmptyArray<CustomInfo<G_NAME>>
    >(
      param1: READ_MODEL | string,
      infos?: ARR | NonEmptyInitFunc<() => ARR>,
      desc?: string | DomainDesignDesc
    ): READ_MODEL | DomainDesignReadModel<CustomInfoArrayToInfoObject<ARR>> {
      if (typeof param1 === 'object') {
        context.linkTo(RULE, __id, param1._attributes.rule, param1._attributes.__id, 'Aggregation')
        return param1
      }
      const c = context.createReadModel(name, infos!, desc)
      context.linkTo(RULE, __id, c._attributes.rule, c._attributes.__id, 'Aggregation')
      return c
    }
    const event: DomainDesignEvent<CustomInfoArrayToInfoObject<ARR>> = {
      _attributes: {
        __id,
        rule: RULE,
        name,
        infos,
        description: context.createDesc(desc as any),
      },
      inner: infos,
      policy,
      system,
      readModel,
      toFormat() {
        return context.toFormat(this)
      },
    }
    context.registerEvent(event)
    return event
  }
}
