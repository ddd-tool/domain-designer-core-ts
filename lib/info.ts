import { genId, useInternalContext } from './common'
import type {
  DomainDesignDesc,
  DomainDesignInfo,
  DomainDesignInfoProvider,
  DomainDesignInfoFuncDependsOn,
  NonEmptyArray,
} from './define'

export function createInfoProvider(designId: string): DomainDesignInfoProvider {
  return () => {
    function func<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Function', NAME>
    function func<NAME extends string>(
      name: NAME,
      dependsOn: NonEmptyArray<DomainDesignInfoFuncDependsOn | string | [string, string | DomainDesignDesc]>,
      desc?: string | DomainDesignDesc
    ): DomainDesignInfo<'Function', NAME>
    function func<NAME extends string>(
      name: NAME,
      p2?:
        | NonEmptyArray<DomainDesignInfoFuncDependsOn | string | [string, string | DomainDesignDesc]>
        | string
        | DomainDesignDesc,
      p3?: string | DomainDesignDesc
    ): DomainDesignInfo<'Function', NAME> {
      const context = useInternalContext(designId)
      let subtype: Array<DomainDesignInfoFuncDependsOn> = []
      let desc: DomainDesignDesc | undefined = undefined
      if (p2 instanceof Array) {
        subtype = context.customInfoArrToInfoArr(p2 as any) as DomainDesignInfoFuncDependsOn[]
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
        toFormat() {
          return context.toFormat(this)
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
          toFormat() {
            return context.toFormat(this)
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
          toFormat() {
            return context.toFormat(this)
          },
        }
        context.registerInfo(result)
        return result
      },
      valueObj<NAME extends string>(
        name: NAME,
        desc?: string | DomainDesignDesc
      ): DomainDesignInfo<'ValueObject', NAME> {
        const context = useInternalContext(designId)
        const result: DomainDesignInfo<'ValueObject', NAME> = {
          _attributes: {
            __id: genId(),
            rule: 'Info' as const,
            type: 'ValueObject' as const,
            subtype: 'None' as const,
            name,
            description: context.createDesc(desc as any),
          },
          toFormat() {
            return context.toFormat(this)
          },
        }
        context.registerInfo(result)
        return result
      },
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
          toFormat() {
            return context.toFormat(this)
          },
        }
        context.registerInfo(result)
        return result
      },
    }
  }
}
