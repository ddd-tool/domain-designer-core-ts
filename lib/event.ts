import { genId, useInternalContext } from './common'
import {
  DomainDesignInfos,
  DomainDesignEvent,
  DomainDesignDesc,
  DomainDesignPolicy,
  DomainDesignSystem,
  DomainDesignEventProvider,
  NonEmptyObject,
  DomainDesignReadModel,
  NonEmptyInitFunc,
} from './define'

export function eventProvider(designId: string): DomainDesignEventProvider {
  return <INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS>,
    desc?: string | DomainDesignDesc
  ): DomainDesignEvent<INFOS> => {
    const context = useInternalContext(designId)
    const __code = genId()

    function policy(param: DomainDesignPolicy): DomainDesignPolicy
    function policy(name: string, desc?: string | DomainDesignDesc): DomainDesignPolicy
    function policy(param1: DomainDesignPolicy | string, desc?: string | DomainDesignDesc): DomainDesignPolicy {
      if (typeof param1 === 'object') {
        context.linkTo(__code, param1._attributes.__code)
        return param1
      }
      const p = context.createPolicy(param1, desc)
      context.linkTo(__code, p._attributes.__code)
      return p
    }

    function system(param: DomainDesignSystem): DomainDesignSystem
    function system(name: string, desc?: string | DomainDesignDesc): DomainDesignSystem
    function system(param1: DomainDesignSystem | string, desc?: string | DomainDesignDesc): DomainDesignSystem {
      if (typeof param1 === 'object') {
        context.linkTo(__code, param1._attributes.__code)
        return param1
      }
      const s = context.createSystem(param1, desc)
      context.linkTo(__code, s._attributes.__code)
      return s
    }

    function readModel<READ_MODEL extends DomainDesignReadModel<any>>(param: READ_MODEL): READ_MODEL
    function readModel<INFOS extends DomainDesignInfos>(
      name: string,
      infos: NonEmptyObject<INFOS> | NonEmptyInitFunc<() => INFOS>,
      desc?: string | DomainDesignDesc
    ): DomainDesignReadModel<INFOS>
    function readModel<READ_MODEL extends DomainDesignReadModel<any>, INFOS extends DomainDesignInfos>(
      param1: READ_MODEL | string,
      infos?: NonEmptyObject<INFOS> | NonEmptyInitFunc<() => INFOS>,
      desc?: string | DomainDesignDesc
    ): READ_MODEL | DomainDesignReadModel<INFOS> {
      if (typeof param1 !== 'string') {
        context.linkTo(__code, param1._attributes.__code)
        return param1
      }
      const c = context.createReadModel(name, infos!, desc)
      context.linkTo(__code, c._attributes.__code)
      return c
    }
    const event: DomainDesignEvent<INFOS> = {
      _attributes: {
        __code,
        rule: 'Event',
        name,
        infos,
        description: context.createDesc(desc as any),
      },
      inner: infos,
      policy,
      system,
      readModel,
    }
    context.registerEvent(event)
    return event
  }
}
