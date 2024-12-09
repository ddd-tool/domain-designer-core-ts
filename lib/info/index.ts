import { genId, useInternalContext } from '../common'
import type {
  DomainDesignDesc,
  DomainDesignInfo,
  DomainDesignInfoProvider,
  DomainDesignInfoType,
  DomainDesignInfoFuncDependsOn,
  NonEmptyArray,
} from '../define'
import { createInfoFieldProvider } from './field'

export function createInfoProvider(designId: string): DomainDesignInfoProvider {
  return () => {
    return {
      any<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Any', NAME> {
        const context = useInternalContext(designId)
        return {
          _attributes: {
            __code: genId(),
            rule: 'Info',
            type: 'Any',
            subtype: 'None',
            name,
            description: context.createDesc(desc as any),
          },
        }
      },
      doc<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Document', NAME> {
        const context = useInternalContext(designId)
        return {
          _attributes: {
            __code: genId(),
            rule: 'Info',
            type: 'Document',
            subtype: 'None',
            name,
            description: context.createDesc(desc as any),
          },
        }
      },
      func<NAME extends string>(
        name: NAME,
        dependOn: NonEmptyArray<DomainDesignInfoFuncDependsOn | string>, //DomainDesignInfoFuncDependsOn,
        desc?: string | DomainDesignDesc
      ): DomainDesignInfo<'Function', NAME> {
        const context = useInternalContext(designId)
        const subtype = dependOn.reduce((arr, item) => {
          if (typeof item === 'string') {
            arr.push(context.info.any(item))
          } else {
            arr.push(item)
          }
          return arr
        }, [] as DomainDesignInfoFuncDependsOn[])
        return {
          _attributes: {
            __code: genId(),
            rule: 'Info',
            type: 'Function',
            subtype,
            name,
            description: context.createDesc(desc as any),
          },
        }
      },
      field: createInfoFieldProvider(designId),
    }
  }
}

export function isDomainDesignInfoFunc<NAME extends string>(
  info: DomainDesignInfo<DomainDesignInfoType, NAME>
): info is DomainDesignInfo<'Function', NAME> {
  return info._attributes.rule === 'Info' && info._attributes.type === 'Function'
}
