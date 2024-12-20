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
  CustomInfoArrayToInfoObject,
  NonEmptyInitFunc,
  CustomInfo,
} from './define'

export function createCommandProvider(designId: string): DomainDesignCommandProvider {
  const RULE = 'Command'
  return <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infoInitializer: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>> => {
    const context = useInternalContext(designId)
    const infos = context.customInfoArrToInfoObj(
      infoInitializer instanceof Function ? infoInitializer() : infoInitializer
    )
    const __id = genId()

    function agg<AGG extends DomainDesignAgg<any>>(a: AGG): AGG
    function agg<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
      name: string,
      agg: ARR,
      desc?: string | DomainDesignDesc
    ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
    function agg<
      AGG extends DomainDesignAgg<any>,
      G_NAME extends string,
      ARR extends NonEmptyArray<CustomInfo<G_NAME>>
    >(
      param1: AGG | string,
      infos?: ARR,
      desc?: string | DomainDesignDesc
    ): AGG | DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>> {
      if (typeof param1 === 'object') {
        context.linkTo(RULE, __id, param1._attributes.rule, param1._attributes.__id)
        return param1
      } else {
        const agg = context.createAgg(param1, infos!, desc)
        context.linkTo(RULE, __id, agg._attributes.rule, agg._attributes.__id)
        return agg
      }
    }
    const command: DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>> = {
      _attributes: {
        __id,
        rule: RULE,
        name,
        infos,
        description: context.createDesc(desc as any),
      },
      inner: infos,
      agg,
      toFormat() {
        return context.toFormat(this)
      },
    }
    context.registerCommand(command)
    return command
  }
}

export function createFacadeCmdProvider(designId: string): DomainDesignFacadeCommandProvider {
  const RULE = 'FacadeCommand'
  return <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infoInitializer: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>> => {
    const context = useInternalContext(designId)
    const infos = context.customInfoArrToInfoObj(
      infoInitializer instanceof Function ? infoInitializer() : infoInitializer
    )
    const __id = genId()

    function agg<AGG extends DomainDesignAgg<any>>(a: AGG): AGG
    function agg<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
      name: string,
      agg: ARR,
      desc?: string | DomainDesignDesc
    ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
    function agg<
      AGG extends DomainDesignAgg<any>,
      G_NAME extends string,
      ARR extends NonEmptyArray<CustomInfo<G_NAME>>
    >(
      param1: AGG | string,
      infos?: ARR,
      desc?: string | DomainDesignDesc
    ): AGG | DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>> {
      if (typeof param1 === 'object') {
        context.linkTo(RULE, __id, param1._attributes.rule, param1._attributes.__id)
        return param1
      } else {
        const agg = context.createAgg(param1, infos!, desc)
        context.linkTo(RULE, __id, agg._attributes.rule, agg._attributes.__id)
        return agg
      }
    }

    function service(param: DomainDesignService): DomainDesignService
    function service(name: string, desc?: string | DomainDesignDesc): DomainDesignService
    function service(param1: DomainDesignService | string, desc?: string | DomainDesignDesc): DomainDesignService {
      if (typeof param1 === 'object') {
        context.linkTo(RULE, __id, param1._attributes.rule, param1._attributes.__id)
        return param1
      }
      const s = context.createService(param1, desc)
      context.linkTo(RULE, __id, s._attributes.rule, s._attributes.__id)
      return s
    }
    const facadeCmd: DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>> = {
      _attributes: {
        __id,
        rule: RULE,
        name,
        infos,
        description: context.createDesc(desc as any),
      },
      inner: infos,
      agg,
      service,
      toFormat() {
        return context.toFormat(this)
      },
    }
    context.registerFacadeCommand(facadeCmd)
    return facadeCmd
  }
}
