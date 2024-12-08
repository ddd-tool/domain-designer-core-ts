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
  const RULE = 'Command'
  return <INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS>,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<INFOS> => {
    const context = useInternalContext(designId)
    const __code = genId()
    function agg<AGG extends DomainDesignAgg<any>>(a: AGG): AGG {
      context.linkTo(RULE, __code, a._attributes.rule, a._attributes.__code)
      return a
    }
    const command: DomainDesignCommand<INFOS> = {
      _attributes: {
        __code,
        rule: RULE,
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
  const RULE = 'FacadeCommand'
  return <INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS>,
    desc?: string | DomainDesignDesc
  ) => {
    const context = useInternalContext(designId)
    const __code = genId()
    function agg<AGG extends DomainDesignAgg<any>>(a: AGG): AGG {
      context.linkTo(RULE, __code, a._attributes.rule, a._attributes.__code)
      return a
    }

    function service(param: DomainDesignService): DomainDesignService
    function service(name: string, desc?: string | DomainDesignDesc): DomainDesignService
    function service(param1: DomainDesignService | string, desc?: string | DomainDesignDesc): DomainDesignService {
      if (typeof param1 === 'object') {
        context.linkTo(RULE, __code, param1._attributes.rule, param1._attributes.__code)
        return param1
      }
      const s = context.createService(param1, desc)
      context.linkTo(RULE, __code, s._attributes.rule, s._attributes.__code)
      return s
    }
    const facadeCmd: DomainDesignFacadeCommand<INFOS> = {
      _attributes: {
        __code,
        rule: RULE,
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
