import { genId, useInternalContext } from './common'
import type {
  DomainDesignDesc,
  DomainDesignInfo,
  DomainDesignInfoProvider,
  DomainDesignInfoType,
  DomainDesignInfoFuncDependsOn,
  NonEmptyArray,
} from './define'

export function createInfoProvider(designId: string): DomainDesignInfoProvider {
  return () => {
    function func<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Function', NAME>
    function func<NAME extends string>(
      name: NAME,
      dependsOn: NonEmptyArray<DomainDesignInfoFuncDependsOn | string>,
      desc?: string | DomainDesignDesc
    ): DomainDesignInfo<'Function', NAME>
    function func<NAME extends string>(
      name: NAME,
      p2?: NonEmptyArray<DomainDesignInfoFuncDependsOn | string> | string | DomainDesignDesc,
      p3?: string | DomainDesignDesc
    ): DomainDesignInfo<'Function', NAME> {
      const context = useInternalContext(designId)
      let subtype: Array<DomainDesignInfoFuncDependsOn> = []
      let desc: DomainDesignDesc | undefined = undefined
      if (p2 instanceof Array) {
        subtype = p2.reduce((arr, item) => {
          if (typeof item === 'string') {
            arr.push(context.info.valueObj(item))
          } else {
            arr.push(item)
          }
          return arr
        }, [] as DomainDesignInfoFuncDependsOn[])
        desc = p3 as DomainDesignDesc | undefined
      } else {
        desc = p2 as DomainDesignDesc | undefined
      }
      const result = {
        _attributes: {
          __id: genId(),
          rule: 'Info' as const,
          type: 'Function' as const,
          subtype,
          name,
          description: context.createDesc(desc as any),
        },
      }
      context.registerInfo(result)
      return result
    }

    function valueObj<NAME extends string>(
      name: NAME,
      desc?: string | DomainDesignDesc
    ): DomainDesignInfo<'ValueObject', NAME>
    function valueObj<NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, NAME>>>(
      name: NAME,
      infos: ARR,
      desc?: string | DomainDesignDesc
    ): DomainDesignInfo<'ValueObject', NAME>
    function valueObj<NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, NAME>>>(
      name: NAME,
      p2?: ARR | string | DomainDesignDesc,
      p3?: string | DomainDesignDesc
    ): DomainDesignInfo<'ValueObject', NAME> {
      const context = useInternalContext(designId)
      let subtype: Array<DomainDesignInfo<DomainDesignInfoType, string>> = []
      let desc: DomainDesignDesc | undefined = undefined
      if (p2 instanceof Array) {
        subtype = p2.reduce((arr, item) => {
          if (typeof item === 'string') {
            arr.push(context.info.valueObj(item))
          } else {
            arr.push(item)
          }
          return arr
        }, [] as DomainDesignInfo<DomainDesignInfoType, string>[])
        desc = p3 as DomainDesignDesc | undefined
      } else {
        desc = p2 as DomainDesignDesc | undefined
      }
      const result = {
        _attributes: {
          __id: genId(),
          rule: 'Info' as const,
          type: 'ValueObject' as const,
          subtype,
          name,
          description: context.createDesc(desc as any),
        },
      }
      context.registerInfo(result)
      return result
    }

    return {
      document<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Document', NAME> {
        const context = useInternalContext(designId)
        const result = {
          _attributes: {
            __id: genId(),
            rule: 'Info' as const,
            type: 'Document' as const,
            subtype: 'None' as const,
            name,
            description: context.createDesc(desc as any),
          },
        }
        context.registerInfo(result)
        return result
      },
      func,
      id<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Id', NAME> {
        const context = useInternalContext(designId)
        const result = {
          _attributes: {
            __id: genId(),
            rule: 'Info' as const,
            type: 'Id' as const,
            subtype: 'None' as const,
            name,
            description: context.createDesc(desc as any),
          },
        }
        context.registerInfo(result)
        return result
      },
      valueObj,
      version<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Version', NAME> {
        const context = useInternalContext(designId)
        const result = {
          _attributes: {
            __id: genId(),
            rule: 'Info' as const,
            type: 'Version' as const,
            subtype: 'None' as const,
            name,
            description: context.createDesc(desc as any),
          },
        }
        context.registerInfo(result)
        return result
      },
    }
  }
}
