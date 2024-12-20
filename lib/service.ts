import { genId, useInternalContext } from './common'
import {
  CustomInfo,
  CustomInfoArrayToInfoObject,
  DomainDesignAgg,
  DomainDesignCommand,
  DomainDesignDesc,
  DomainDesignFacadeCommand,
  DomainDesignService,
  DomainDesignServiceProvider,
  NonEmptyArray,
} from './define'

export function createServiceProvider(designId: string): DomainDesignServiceProvider {
  const RULE = 'Service'
  return (name: string, desc?: string | DomainDesignDesc) => {
    const context = useInternalContext(designId)
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

    function command<COMMAND extends DomainDesignCommand<any>>(param: COMMAND): COMMAND
    function command<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
      name: string,
      infos: ARR,
      desc?: string | DomainDesignDesc
    ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
    function command<
      COMMAND extends DomainDesignCommand<any>,
      G_NAME extends string,
      ARR extends NonEmptyArray<CustomInfo<G_NAME>>
    >(
      param1: COMMAND | string,
      infos?: ARR,
      desc?: string | DomainDesignDesc
    ): COMMAND | DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>> {
      if (typeof param1 === 'object') {
        context.linkTo(RULE, __id, param1._attributes.rule, param1._attributes.__id)
        return param1
      }
      const a = context.createCommand(param1, infos!, desc)
      context.linkTo(RULE, __id, a._attributes.rule, a._attributes.__id)
      return a
    }

    function facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(param: FACADECMD): FACADECMD
    function facadeCmd<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
      name: string,
      infos: ARR,
      desc?: string | DomainDesignDesc
    ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>>
    function facadeCmd<
      FACADECMD extends DomainDesignFacadeCommand<any>,
      G_NAME extends string,
      ARR extends NonEmptyArray<CustomInfo<G_NAME>>
    >(
      param1: FACADECMD | string,
      infos?: ARR,
      desc?: string | DomainDesignDesc
    ): FACADECMD | DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>> {
      if (typeof param1 === 'object') {
        context.linkTo(RULE, __id, param1._attributes.rule, param1._attributes.__id)
        return param1
      } else {
        const c = context.createFacadeCommand(param1, infos!, desc)
        context.linkTo(RULE, __id, c._attributes.rule, c._attributes.__id)
        return c
      }
    }
    const service: DomainDesignService = {
      _attributes: {
        __id,
        rule: RULE,
        name,
        description: context.createDesc(desc as any),
      },
      agg,
      command,
      facadeCmd,
      toFormat() {
        return context.toFormat(this)
      },
    }
    context.registerService(service)
    return service
  }
}
