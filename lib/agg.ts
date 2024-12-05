import { genId, useInternalContext } from './common'
import {
  DomainDesignAgg,
  DomainDesignAggProvider,
  DomainDesignDesc,
  DomainDesignEvent,
  DomainDesignFields,
} from './define'

export function aggProvider(designCode: string): DomainDesignAggProvider {
  return <FIELDS extends DomainDesignFields>(
    name: string,
    fields: FIELDS,
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<FIELDS> => {
    const context = useInternalContext(designCode)
    const _code = genId()

    function event<EVENT extends DomainDesignEvent<any>>(e: EVENT): EVENT
    function event<FIELDS extends DomainDesignFields>(
      name: string,
      fields: FIELDS,
      desc?: string | DomainDesignDesc
    ): DomainDesignEvent<FIELDS>
    function event<EVENT extends DomainDesignEvent<any>, FIELDS extends DomainDesignFields>(
      param1: EVENT | string,
      fields?: DomainDesignFields,
      desc?: string | DomainDesignDesc
    ): EVENT | DomainDesignEvent<FIELDS> {
      if (typeof param1 !== 'string') {
        context.link(_code, param1._attributes._code)
        return param1
      }
      const e = context.createEvent(param1, fields!, desc)
      context.link(_code, e._attributes._code)
      return e as DomainDesignEvent<FIELDS>
    }
    const agg: DomainDesignAgg<FIELDS> = {
      _attributes: {
        _code,
        rule: 'Agg',
        name,
        fields,
        description: context.createDesc(desc as any),
      },
      inner: fields,
      event,
    }
    context.registerAgg(agg)
    return agg
  }
}
