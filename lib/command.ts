import { genId, useInternalContext } from './common'
import {
  DomainDesignInfos,
  DomainDesignCommand,
  DomainDesignDesc,
  DomainDesignCommandProvider,
  DomainDesignAgg,
  DomainDesignFacadeCommandProvider,
  DomainDesignFacadeCommand,
  DomainDesignService,
  NonEmptyObject,
} from './define'

export function createCommandProvider(designId: string): DomainDesignCommandProvider {
  return <INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS>,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<INFOS> => {
    const context = useInternalContext(designId)
    const __code = genId()
    function agg<AGG extends DomainDesignAgg<any>>(a: AGG): AGG {
      context.link(__code, a._attributes.__code)
      return a
    }
    const command: DomainDesignCommand<INFOS> = {
      _attributes: {
        __code,
        rule: 'Command',
        name,
        infos,
        description: context.createDesc(desc as any),
      },
      inner: infos,
      agg,
    }
    context.registerCommand(command)
    return command
  }
}

export function createFacadeCmdProvider(designId: string): DomainDesignFacadeCommandProvider {
  return <INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS>,
    desc?: string | DomainDesignDesc
  ) => {
    const context = useInternalContext(designId)
    const __code = genId()
    function agg<AGG extends DomainDesignAgg<any>>(a: AGG): AGG {
      context.link(__code, a._attributes.__code)
      return a
    }

    function service(param: DomainDesignService): DomainDesignService
    function service(name: string, desc?: string | DomainDesignDesc): DomainDesignService
    function service(param1: DomainDesignService | string, desc?: string | DomainDesignDesc): DomainDesignService {
      if (typeof param1 === 'object') {
        context.link(__code, param1._attributes.__code)
        return param1
      }
      const s = context.createService(param1, desc)
      context.link(__code, s._attributes.__code)
      return s
    }
    const facadeCmd: DomainDesignFacadeCommand<INFOS> = {
      _attributes: {
        __code,
        rule: 'FacadeCommand',
        name,
        infos,
        description: context.createDesc(desc as any),
      },
      inner: infos,
      agg,
      service,
    }
    context.registerFacadeCommand(facadeCmd)
    return facadeCmd
  }
}
