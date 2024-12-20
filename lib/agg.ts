import { genId, useInternalContext } from './common'
import {
  DomainDesignAgg,
  DomainDesignAggProvider,
  DomainDesignDesc,
  DomainDesignEvent,
  NonEmptyArray,
  NonEmptyInitFunc,
  NonEmptyObject,
  CustomInfoArrayToInfoObject,
  CustomInfo,
} from './define'

export function createAggProvider(designId: string): DomainDesignAggProvider {
  const RULE = 'Agg'
  return <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infoInitializer: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>> => {
    const context = useInternalContext(designId)
    const infos = context.customInfoArrToInfoObj(
      infoInitializer instanceof Function ? infoInitializer() : infoInitializer
    )
    const __id = genId()

    function event<EVENT extends DomainDesignEvent<any>>(e: EVENT): EVENT
    function event<G_NAME extends string, INFOS extends NonEmptyArray<CustomInfo<G_NAME>>>(
      name: string,
      infos: NonEmptyObject<INFOS>,
      desc?: string | DomainDesignDesc
    ): DomainDesignEvent<CustomInfoArrayToInfoObject<INFOS>>
    function event<
      EVENT extends DomainDesignEvent<any>,
      G_NAME extends string,
      ARR extends NonEmptyArray<CustomInfo<G_NAME>>
    >(
      param1: EVENT | string,
      infos?: ARR,
      desc?: string | DomainDesignDesc
    ): EVENT | DomainDesignEvent<CustomInfoArrayToInfoObject<ARR>> {
      if (typeof param1 === 'object') {
        context.linkTo(RULE, __id, param1._attributes.rule, param1._attributes.__id)
        return param1
      }
      const e = context.createEvent(param1, infos!, desc)
      context.linkTo(RULE, __id, e._attributes.rule, e._attributes.__id)
      return e
    }

    const agg: DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>> = {
      _attributes: {
        __id,
        rule: RULE,
        name,
        infos,
        description: context.createDesc(desc as any),
      },
      inner: infos,
      event,
      toFormat() {
        return context.toFormat(this)
      },
    }
    context.registerAgg(agg)
    return agg
  }
}
