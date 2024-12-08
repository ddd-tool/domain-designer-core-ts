import { genId, useInternalContext } from './common'
import {
  DomainDesignAgg,
  DomainDesignCommand,
  DomainDesignDesc,
  DomainDesignInfos,
  DomainDesignService,
  DomainDesignServiceProvider,
  NonEmptyObject,
} from './define'

export function createServiceProvider(designId: string): DomainDesignServiceProvider {
  return (name: string, desc?: string | DomainDesignDesc) => {
    const context = useInternalContext(designId)
    const __code = genId()

    function agg<AGG extends DomainDesignAgg<any>>(a: AGG): AGG {
      context.linkTo(__code, a._attributes.__code)
      return a
    }

    function command<COMMAND extends DomainDesignCommand<any>>(param: COMMAND): COMMAND
    function command<INFOS extends DomainDesignInfos>(
      name: string,
      infos: NonEmptyObject<INFOS>,
      desc?: string | DomainDesignDesc
    ): INFOS
    function command<COMMAND extends DomainDesignCommand<any>, INFOS extends DomainDesignInfos>(
      param1: COMMAND | string,
      infos?: NonEmptyObject<INFOS>,
      desc?: string | DomainDesignDesc
    ): COMMAND | DomainDesignCommand<INFOS> {
      if (typeof param1 === 'object') {
        context.linkTo(__code, param1._attributes.__code)
        return param1
      }
      const a = context.createCommand(param1, infos!, desc)
      context.linkTo(__code, a._attributes.__code)
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
