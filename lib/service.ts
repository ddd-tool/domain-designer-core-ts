import { genId, useInternalContext } from './common'
import {
  DomainDesignAgg,
  DomainDesignCommand,
  DomainDesignDesc,
  DomainDesignFields,
  DomainDesignService,
  DomainDesignServiceProvider,
} from './define'

export function serviceProvider(designCode: string): DomainDesignServiceProvider {
  return (name: string, desc?: string | DomainDesignDesc) => {
    const context = useInternalContext(designCode)
    const _code = genId()

    function agg<AGG extends DomainDesignAgg<any>>(param: AGG): AGG
    function agg<FIELDS extends DomainDesignFields>(
      name: string,
      fields: FIELDS,
      desc?: string | DomainDesignDesc
    ): DomainDesignAgg<FIELDS>
    function agg<AGG extends DomainDesignAgg<any>, FIELDS extends DomainDesignFields>(
      param1: AGG | string,
      fields?: FIELDS,
      desc?: string | DomainDesignDesc
    ): AGG | DomainDesignAgg<FIELDS> {
      if (typeof param1 === 'object') {
        context.link(_code, param1._attributes._code)
        return param1
      }
      const a = context.createAgg(param1, fields!, desc)
      context.link(_code, a._attributes._code)
      return a
    }

    function command<COMMAND extends DomainDesignCommand<any>>(param: COMMAND): COMMAND
    function command<FIELDS extends DomainDesignFields>(
      name: string,
      fields: FIELDS,
      desc?: string | DomainDesignDesc
    ): FIELDS
    function command<COMMAND extends DomainDesignCommand<any>, FIELDS extends DomainDesignFields>(
      param1: COMMAND | string,
      fields?: DomainDesignFields,
      desc?: string | DomainDesignDesc
    ): COMMAND | DomainDesignCommand<FIELDS> {
      if (typeof param1 === 'object') {
        context.link(_code, param1._attributes._code)
        return param1
      }
      const a = context.createCommand(param1, fields!, desc)
      context.link(_code, a._attributes._code)
      return a
    }
    const service: DomainDesignService = {
      _attributes: {
        _code,
        rule: 'Service',
        name,
        description: context.createDesc(desc as any),
      },
      agg,
      command,
    }
    context.registerService(service)
    return service
  }
}
