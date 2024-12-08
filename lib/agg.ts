import { genId, useInternalContext } from './common'
import {
  DomainDesignAgg,
  DomainDesignAggProvider,
  DomainDesignDesc,
  DomainDesignEvent,
  DomainDesignInfos,
  NonEmptyInitFunc,
  NonEmptyObject,
} from './define'

export function createAggProvider(designId: string): DomainDesignAggProvider {
  return <INFOS extends DomainDesignInfos>(
    name: string,
    infoInitializer: NonEmptyInitFunc<() => INFOS> | NonEmptyObject<INFOS>,
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<INFOS> => {
    const context = useInternalContext(designId)
    const infos = infoInitializer instanceof Function ? infoInitializer() : infoInitializer
    const __code = genId()

    function event<EVENT extends DomainDesignEvent<any>>(e: EVENT): EVENT
    function event<INFOS extends DomainDesignInfos>(
      name: string,
      infos: NonEmptyObject<INFOS>,
      desc?: string | DomainDesignDesc
    ): DomainDesignEvent<INFOS>
    function event<EVENT extends DomainDesignEvent<any>, INFOS extends DomainDesignInfos>(
      param1: EVENT | string,
      infos?: NonEmptyObject<INFOS>,
      desc?: string | DomainDesignDesc
    ): EVENT | DomainDesignEvent<INFOS> {
      if (typeof param1 !== 'string') {
        context.linkTo(__code, param1._attributes.__code)
        return param1
      }
      const e = context.createEvent(param1, infos!, desc)
      context.linkTo(__code, e._attributes.__code)
      return e as DomainDesignEvent<INFOS>
    }
    const agg: DomainDesignAgg<INFOS> = {
      _attributes: {
        __code,
        rule: 'Agg',
        name,
        infos,
        description: context.createDesc(desc as any),
      },
      inner: infos,
      event,
    }
    context.registerAgg(agg)
    return agg
  }
}
