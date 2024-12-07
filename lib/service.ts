import { genId, useInternalContext } from './common'
import {
  DomainDesignAgg,
  DomainDesignCommand,
  DomainDesignDesc,
  DomainDesignInfos,
  DomainDesignService,
  DomainDesignServiceProvider,
} from './define'

export function createServiceProvider(designId: string): DomainDesignServiceProvider {
  return (name: string, desc?: string | DomainDesignDesc) => {
    const context = useInternalContext(designId)
    const __code = genId()

    function agg<AGG extends DomainDesignAgg<any>>(param: AGG): AGG
    function agg<INFOS extends DomainDesignInfos>(
      name: string,
      infos: INFOS,
      desc?: string | DomainDesignDesc
    ): DomainDesignAgg<INFOS>
    function agg<AGG extends DomainDesignAgg<any>, INFOS extends DomainDesignInfos>(
      param1: AGG | string,
      infos?: INFOS,
      desc?: string | DomainDesignDesc
    ): AGG | DomainDesignAgg<INFOS> {
      if (typeof param1 === 'object') {
        context.link(__code, param1._attributes.__code)
        return param1
      }
      const a = context.createAgg(param1, infos!, desc)
      context.link(__code, a._attributes.__code)
      return a
    }

    function command<COMMAND extends DomainDesignCommand<any>>(param: COMMAND): COMMAND
    function command<INFOS extends DomainDesignInfos>(
      name: string,
      infos: INFOS,
      desc?: string | DomainDesignDesc
    ): INFOS
    function command<COMMAND extends DomainDesignCommand<any>, INFOS extends DomainDesignInfos>(
      param1: COMMAND | string,
      infos?: INFOS,
      desc?: string | DomainDesignDesc
    ): COMMAND | DomainDesignCommand<INFOS> {
      if (typeof param1 === 'object') {
        context.link(__code, param1._attributes.__code)
        return param1
      }
      const a = context.createCommand(param1, infos!, desc)
      context.link(__code, a._attributes.__code)
      return a
    }
    const service: DomainDesignService = {
      _attributes: {
        __code,
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
