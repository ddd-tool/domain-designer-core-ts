import { genId, useInternalContext } from './common'
import { DomainDesignDesc, DomainDesignPolicy, DomainDesignPolicyProvider, DomainDesignService } from './define'

export function createPolicyProvider(designId: string): DomainDesignPolicyProvider {
  const RULE = 'Policy'
  return (name: string, desc?: string | DomainDesignDesc) => {
    const context = useInternalContext(designId)
    const __id = genId()
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
    const policy: DomainDesignPolicy = {
      _attributes: {
        __id,
        rule: RULE,
        name,
        description: context.createDesc(desc as any),
      },
      service,
      toFormat() {
        return context.toFormat(this)
      },
    }
    context.registerPolicy(policy)
    return policy
  }
}
