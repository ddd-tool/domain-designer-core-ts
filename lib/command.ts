import { genId, useInternalContext } from './common'
import {
  DomainDesignCommand,
  DomainDesignDesc,
  DomainDesignCommandProvider,
  DomainDesignAgg,
  DomainDesignFacadeCommandProvider,
  DomainDesignFacadeCommand,
  DomainDesignService,
  NonEmptyArray,
  DomainDesignInfoType,
  DomainDesignInfo,
  CustomInfoArrayToInfoObject,
  NonEmptyInitFunc,
} from './define'

export function createCommandProvider(designId: string): DomainDesignCommandProvider {
  const RULE = 'Command'
  return <G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infoInitializer: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>> => {
    const context = useInternalContext(designId)
    const infos = context.customInfoArrToInfoObj(
      infoInitializer instanceof Function ? infoInitializer() : infoInitializer
    )
    const __code = genId()

    function agg<AGG extends DomainDesignAgg<any>>(a: AGG): AGG
    function agg<
      G_NAME extends string,
      ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>
    >(name: string, agg: ARR, desc?: string | DomainDesignDesc): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
    function agg<
      AGG extends DomainDesignAgg<any>,
      G_NAME extends string,
      ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>
    >(
      param1: AGG | string,
      infos?: ARR,
      desc?: string | DomainDesignDesc
    ): AGG | DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>> {
      if (typeof param1 === 'object') {
        context.linkTo(RULE, __code, param1._attributes.rule, param1._attributes.__code)
        return param1
      } else {
        const agg = context.createAgg(param1, infos!, desc)
        context.linkTo(RULE, __code, agg._attributes.rule, agg._attributes.__code)
        return agg
      }
    }
    const command: DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>> = {
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
  return <G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infoInitializer: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>> => {
    const context = useInternalContext(designId)
    const infos = context.customInfoArrToInfoObj(
      infoInitializer instanceof Function ? infoInitializer() : infoInitializer
    )
    const __code = genId()

    function agg<AGG extends DomainDesignAgg<any>>(a: AGG): AGG
    function agg<
      G_NAME extends string,
      ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>
    >(name: string, agg: ARR, desc?: string | DomainDesignDesc): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
    function agg<
      AGG extends DomainDesignAgg<any>,
      G_NAME extends string,
      ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>
    >(
      param1: AGG | string,
      infos?: ARR,
      desc?: string | DomainDesignDesc
    ): AGG | DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>> {
      if (typeof param1 === 'object') {
        context.linkTo(RULE, __code, param1._attributes.rule, param1._attributes.__code)
        return param1
      } else {
        const agg = context.createAgg(param1, infos!, desc)
        context.linkTo(RULE, __code, agg._attributes.rule, agg._attributes.__code)
        return agg
      }
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
    const facadeCmd: DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>> = {
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
