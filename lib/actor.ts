import { genId, useInternalContext } from './common'
import {
  DomainDesignCommand,
  DomainDesignDesc,
  DomainDesignFacadeCommand,
  DomainDesignInfos,
  DomainDesignActor,
  DomainDesignActorProvider,
  NonEmptyObject,
} from './define'

export function createActorProvider(designId: string): DomainDesignActorProvider {
  return (name: string, desc?: string | DomainDesignDesc) => {
    const context = useInternalContext(designId)
    const __code = genId()
    function command<COMMAND extends DomainDesignCommand<any>>(c: COMMAND): COMMAND
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
      if (typeof param1 !== 'string') {
        context.link(__code, param1._attributes.__code)
        return param1
      }
      const c = context.createCommand(name, infos!, desc)
      context.link(__code, c._attributes.__code)
      return c
    }

    function facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(param: FACADECMD): FACADECMD
    function facadeCmd<INFOS extends DomainDesignInfos>(
      name: string,
      infos: NonEmptyObject<INFOS>,
      desc?: string | DomainDesignDesc
    ): INFOS
    function facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>, INFOS extends DomainDesignInfos>(
      param1: FACADECMD | string,
      infos?: NonEmptyObject<INFOS>,
      desc?: string | DomainDesignDesc
    ): FACADECMD | DomainDesignFacadeCommand<INFOS> {
      if (typeof param1 !== 'string') {
        context.link(__code, param1._attributes.__code)
        return param1
      }
      const c = context.createFacadeCommand(name, infos!, desc)
      context.link(__code, c._attributes.__code)
      return c
    }
    const actor: DomainDesignActor = {
      _attributes: {
        __code,
        rule: 'Actor',
        name,
        description: context.createDesc(desc as any),
      },
      command,
      facadeCmd,
    }
    context.registerActor(actor)
    return actor
  }
}
