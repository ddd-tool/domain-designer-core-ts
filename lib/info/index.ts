import { genId, useInternalContext } from '../common'
import type {
  DomainDesignDesc,
  DomainDesignInfo,
  DomainDesignInfoProvider,
  DomainDesignInfoType,
  DomainDesignInfoFuncDependsOn,
} from '../define'
import { createInfoFieldProvider } from './field'

export function createInfoProvider(designId: string): DomainDesignInfoProvider {
  return () => {
    return {
      field: createInfoFieldProvider(designId),
      doc(name: string, desc?: string | DomainDesignDesc): DomainDesignInfo<'Document'> {
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
      func(
        name: string,
        dependOn: DomainDesignInfoFuncDependsOn,
        desc?: string | DomainDesignDesc
      ): DomainDesignInfo<'Function'> {
        const context = useInternalContext(designId)
        return {
          _attributes: {
            __code: genId(),
            rule: 'Info',
            type: 'Function',
            subtype: dependOn,
            name,
            description: context.createDesc(desc as any),
          },
        }
      },
    }
  }
}

export function isDomainDesignInfoFunc(
  info: DomainDesignInfo<DomainDesignInfoType>
): info is DomainDesignInfo<'Function'> {
  return info._attributes.rule === 'Info' && info._attributes.type === 'Function'
}
