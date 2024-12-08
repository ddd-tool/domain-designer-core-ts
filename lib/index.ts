import { createInfoProvider } from './info'
import { createCommandProvider, createFacadeCmdProvider } from './command'
import { eventProvider } from './event'
import { createActorProvider } from './actor'
import { createDescProvider } from './desc'
import { createAggProvider } from './agg'
import { createSystemProvider } from './system'
import { createPolicyProvider } from './policy'
import { createServiceProvider } from './service'
import { createReadModelProvider } from './read-model'
import { genId, useInternalContext } from './common'

export function createDomainDesigner() {
  const designId = genId()
  const createDesc = createDescProvider(designId)
  const infoProvider = createInfoProvider(designId)
  const actorProvider = createActorProvider(designId)
  const commandProvider = createCommandProvider(designId)
  const createFacadeCommand = createFacadeCmdProvider(designId)
  const createAgg = createAggProvider(designId)
  const createEvent = eventProvider(designId)
  const createSystem = createSystemProvider(designId)
  const createPolicy = createPolicyProvider(designId)
  const createService = createServiceProvider(designId)
  const createReadModel = createReadModelProvider(designId)
  const context = useInternalContext(designId, () => {
    return {
      id: designId,
      createDesc,
      createInfo: infoProvider,
      createActor: actorProvider,
      createCommand: commandProvider,
      createFacadeCommand,
      createAgg,
      createEvent,
      createSystem,
      createPolicy,
      createService,
      createReadModel,
    }
  })

  return {
    startWorkflow: context.startWorkflow,
    defineUserStory: context.defineUserStory,
    desc: createDesc,
    info: context.info,
    actor: actorProvider,
    facadeCmd: createFacadeCommand,
    command: commandProvider,
    agg: createAgg,
    event: createEvent,
    system: createSystem,
    policy: createPolicy,
    service: createService,
    readModel: createReadModel,
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
  DomainDesignActor,
  DomainDesignSystem,
  DomainDesignService,
  DomainDesignPolicy,
} from './define'

export { isDomainDesignInfoFunc } from './info'
