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

  const infoFieldProvider = createProviderBySubtype('Unknown')
  const provider = infoFieldProvider as DomainDesignInfoFieldProvider
  provider.str = createProviderBySubtype('String')
  provider.num = createProviderBySubtype('Number')
  provider.bool = createProviderBySubtype('Boolean')
  provider.time = createProviderBySubtype('Time')
  provider.enum = createProviderBySubtype('Enum')
  provider.id = createProviderBySubtype('Id')

  return infoFieldProvider as DomainDesignInfoFieldProvider
}
