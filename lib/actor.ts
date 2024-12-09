import { genId, useInternalContext } from './common'
import {
  DomainDesignCommand,
  DomainDesignDesc,
  DomainDesignFacadeCommand,
  DomainDesignActor,
  DomainDesignActorProvider,
  DomainDesignReadModel,
  NonEmptyInitFunc,
  NonEmptyArray,
  DomainDesignInfo,
  DomainDesignInfoType,
  CustomInfoArrayToInfoObject,
} from './define'

export function createActorProvider(designId: string): DomainDesignActorProvider {
  const RULE = 'Actor'
  return (name: string, desc?: string | DomainDesignDesc) => {
    const context = useInternalContext(designId)
    const __code = genId()
    function command<COMMAND extends DomainDesignCommand<any>>(c: COMMAND): COMMAND
    function command<
      G_NAME extends string,
      ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>
    >(name: string, infos: ARR, desc?: string | DomainDesignDesc): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
    function command<
      COMMAND extends DomainDesignCommand<any>,
      G_NAME extends string,
      ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>
    >(
      param1: COMMAND | string,
      infos?: ARR,
      desc?: string | DomainDesignDesc
    ): COMMAND | DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>> {
      if (typeof param1 !== 'string') {
        context.linkTo(RULE, __code, param1._attributes.rule, param1._attributes.__code)
        return param1
      }
      const c = context.createCommand(name, infos!, desc)
      context.linkTo(RULE, __code, c._attributes.rule, c._attributes.__code)
      return c
    }

    function facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(param: FACADECMD): FACADECMD
    function facadeCmd<
      G_NAME extends string,
      ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>
    >(
      name: string,
      infos: ARR,
      desc?: string | DomainDesignDesc
    ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>>
    function facadeCmd<
      FACADECMD extends DomainDesignFacadeCommand<any>,
      G_NAME extends string,
      ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>
    >(
      param1: FACADECMD | string,
      infos?: ARR,
      desc?: string | DomainDesignDesc
    ): FACADECMD | DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>> {
      if (typeof param1 !== 'string') {
        context.linkTo(RULE, __code, param1._attributes.rule, param1._attributes.__code)
        return param1
      }
      const c = context.createFacadeCommand(name, infos!, desc)
      context.linkTo(RULE, __code, c._attributes.rule, c._attributes.__code)
      return c
    }

    function readModel<READ_MODEL extends DomainDesignReadModel<any>>(param: READ_MODEL): READ_MODEL
    function readModel<
      G_NAME extends string,
      ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>
    >(
      name: string,
      infos: ARR | NonEmptyInitFunc<() => ARR>,
      desc?: string | DomainDesignDesc
    ): DomainDesignReadModel<CustomInfoArrayToInfoObject<ARR>>
    function readModel<
      READ_MODEL extends DomainDesignReadModel<any>,
      G_NAME extends string,
      ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>
    >(
      param1: READ_MODEL | string,
      infos?: ARR | NonEmptyInitFunc<() => ARR>,
      desc?: string | DomainDesignDesc
    ): READ_MODEL | DomainDesignReadModel<CustomInfoArrayToInfoObject<ARR>> {
      if (typeof param1 !== 'string') {
        context.linkTo(RULE, __code, param1._attributes.rule, param1._attributes.__code, 'Dependency')
        return param1
      }
      const c = context.createReadModel(name, infos!, desc)
      context.linkTo(RULE, __code, c._attributes.rule, c._attributes.__code, 'Dependency')
      return c
    }
    const actor: DomainDesignActor = {
      _attributes: {
        __code,
        rule: RULE,
        name,
        description: context.createDesc(desc as any),
      },
      command,
      facadeCmd,
      readModel,
    }
    context.registerActor(actor)
    return actor
  }
}
