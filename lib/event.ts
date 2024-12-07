import { genId, useInternalContext } from './common'
import {
  DomainDesignInfos,
  DomainDesignEvent,
  DomainDesignDesc,
  DomainDesignPolicy,
  DomainDesignSystem,
  DomainDesignEventProvider,
} from './define'

export function eventProvider(designId: string): DomainDesignEventProvider {
  return <INFOS extends DomainDesignInfos>(
    name: string,
    infos: INFOS,
    desc?: string | DomainDesignDesc
  ): DomainDesignEvent<INFOS> => {
    const context = useInternalContext(designId)
    const __code = genId()

    function policy(param: DomainDesignPolicy): DomainDesignPolicy
    function policy(name: string, desc?: string | DomainDesignDesc): DomainDesignPolicy
    function policy(param1: DomainDesignPolicy | string, desc?: string | DomainDesignDesc): DomainDesignPolicy {
      if (typeof param1 === 'object') {
        context.link(__code, param1._attributes.__code)
        return param1
      }
      const p = context.createPolicy(param1, desc)
      context.link(__code, p._attributes.__code)
      return p
    }

    function system(param: DomainDesignSystem): DomainDesignSystem
    function system(name: string, desc?: string | DomainDesignDesc): DomainDesignSystem
    function system(param1: DomainDesignSystem | string, desc?: string | DomainDesignDesc): DomainDesignSystem {
      if (typeof param1 === 'object') {
        context.link(__code, param1._attributes.__code)
        return param1
      }
      const s = context.createSystem(param1, desc)
      context.link(__code, s._attributes.__code)
      return s
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
    }
    context.registerEvent(event)
    return event
  }
}
