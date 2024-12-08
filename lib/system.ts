import { genId, useInternalContext } from './common'
import {
  DomainDesignCommand,
  DomainDesignDesc,
  DomainDesignFacadeCommand,
  DomainDesignInfos,
  DomainDesignSystem,
  DomainDesignSystemProvider,
  NonEmptyObject,
} from './define'

export function createSystemProvider(designId: string): DomainDesignSystemProvider {
  return (name: string, desc?: string | DomainDesignDesc) => {
    const context = useInternalContext(designId)
    const __code = genId()
    function command<COMMAND extends DomainDesignCommand<any>>(param: COMMAND): COMMAND
    function command<INFOS extends DomainDesignInfos>(
      name: string,
      infos: NonEmptyObject<INFOS>,
      desc?: string | DomainDesignDesc
    ): DomainDesignCommand<INFOS>
    function command<COMMAND extends DomainDesignCommand<any>, INFOS extends DomainDesignInfos>(
      param1: COMMAND | string,
      infos?: NonEmptyObject<INFOS>,
      desc?: string | DomainDesignDesc
    ): COMMAND | DomainDesignCommand<INFOS> {
      if (typeof param1 === 'object') {
        context.linkTo(__code, param1._attributes.__code)
        return param1
      } else {
        const c = context.createCommand(param1, infos!, desc)
        context.linkTo(__code, c._attributes.__code)
        return c
      }
    }

    function facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(param: FACADECMD): FACADECMD
    function facadeCmd<INFOS extends DomainDesignInfos>(
      name: string,
      infos: NonEmptyObject<INFOS>,
      desc?: string | DomainDesignDesc
    ): DomainDesignFacadeCommand<INFOS>
    function facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>, INFOS extends DomainDesignInfos>(
      param1: FACADECMD | string,
      infos?: NonEmptyObject<INFOS>,
      desc?: string | DomainDesignDesc
    ): FACADECMD | DomainDesignFacadeCommand<INFOS> {
      if (typeof param1 === 'object') {
        context.linkTo(__code, param1._attributes.__code)
        return param1
      } else {
        const c = context.createFacadeCommand(param1, infos!, desc)
        context.linkTo(__code, c._attributes.__code)
        return c
      }
    }
    const system: DomainDesignSystem = {
      _attributes: {
        __code,
        rule: 'System',
        name,
        description: context.createDesc(desc as any),
      },
      command,
      facadeCmd,
    }
    context.registerSystem(system)
    return system
  }
}
