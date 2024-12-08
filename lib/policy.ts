import { genId, useInternalContext } from './common'
import { DomainDesignDesc, DomainDesignPolicy, DomainDesignPolicyProvider, DomainDesignService } from './define'

export function createPolicyProvider(designId: string): DomainDesignPolicyProvider {
  return (name: string, desc?: string | DomainDesignDesc) => {
    const context = useInternalContext(designId)
    const __code = genId()
    function service(param: DomainDesignService): DomainDesignService
    function service(name: string, desc?: string | DomainDesignDesc): DomainDesignService
    function service(param1: DomainDesignService | string, desc?: string | DomainDesignDesc): DomainDesignService {
      if (typeof param1 === 'object') {
        context.linkTo(__code, param1._attributes.__code)
        return param1
      }
      const s = context.createService(param1, desc)
      context.linkTo(__code, s._attributes.__code)
      return s
    }
    const policy: DomainDesignPolicy = {
      _attributes: {
        __code,
        rule: 'Policy',
        name,
        description: context.createDesc(desc as any),
      },
      service,
    }
    context.registerPolicy(policy)
    return policy
  }
}
