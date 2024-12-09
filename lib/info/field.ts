import { genId, useInternalContext } from '../common'
import { DomainDesignDesc, DomainDesignInfo, DomainDesignInfoFieldProvider, DomainDesignInfoSubtype } from '../define'

export function createInfoFieldProvider(designId: string): DomainDesignInfoFieldProvider {
  function createProviderBySubtype(subtype: DomainDesignInfoSubtype<'Field'>) {
    return (name: string, desc?: string | DomainDesignDesc): DomainDesignInfo<'Field'> => {
      const context = useInternalContext(designId)
      return {
        _attributes: {
          __code: genId(),
          rule: 'Info',
          type: 'Field',
          subtype,
          name,
          description: context.createDesc(desc as any),
        },
      }
    }
  }

  return {
    any: createProviderBySubtype('Any'),
    str: createProviderBySubtype('String'),
    num: createProviderBySubtype('Number'),
    bool: createProviderBySubtype('Boolean'),
    time: createProviderBySubtype('Time'),
    enum: createProviderBySubtype('Enum'),
    id: createProviderBySubtype('Id'),
  }
}
