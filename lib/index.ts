import { createInfoProvider } from './info'
import { createCommandProvider, createFacadeCmdProvider } from './command'
import { eventProvider } from './event'
import { createPersonProvider } from './person'
import { createDescProvider } from './desc'
import { createAggProvider } from './agg'
import { createSystemProvider } from './system'
import { createPolicyProvider } from './policy'
import { createServiceProvider } from './service'
import { genId, useInternalContext } from './common'

export function createDomainDesigner() {
  const designId = genId()
  const createDesc = createDescProvider(designId)
  const infoProvider = createInfoProvider(designId)
  const personProvider = createPersonProvider(designId)
  const commandProvider = createCommandProvider(designId)
  const createFacadeCommand = createFacadeCmdProvider(designId)
  const createAgg = createAggProvider(designId)
  const createEvent = eventProvider(designId)
  const createSystem = createSystemProvider(designId)
  const createPolicy = createPolicyProvider(designId)
  const createService = createServiceProvider(designId)
  const context = useInternalContext(designId, () => {
    return {
      id: designId,
      createDesc,
      createInfo: infoProvider,
      createPerson: personProvider,
      createCommand: commandProvider,
      createFacadeCommand,
      createAgg,
      createEvent,
      createSystem,
      createPolicy,
      createService,
    }
  })

  return {
    startWorkflow: context.startWorkflow,
    setUserStory: context.setUserStory,
    desc: createDesc,
    info: context.info,
    person: personProvider,
    facadeCmd: createFacadeCommand,
    command: commandProvider,
    agg: createAgg,
    event: createEvent,
    system: createSystem,
    policy: createPolicy,
    service: createService,
    _getContext: () => context,
  }
}

export type DomainDesigner = ReturnType<typeof createDomainDesigner>

export type {
  DomainDesignAgg,
  DomainDesignCommand,
  DomainDesignFacadeCommand,
  DomainDesignDesc,
  DomainDesignEvent,
  DomainDesignInfo,
  DomainDesignInfoType,
  DomainDesignPerson,
  DomainDesignSystem,
  DomainDesignService,
  DomainDesignPolicy,
} from './define'

export { isDomainDesignInfoFunc } from './info'
