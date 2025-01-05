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
import { DomainDesigner, DomainDesignOptions } from './define'

export function createDomainDesigner(opts?: DomainDesignOptions): DomainDesigner {
  const designId = genId()
  const createDesc = createDescProvider(designId)
  const createInfo = createInfoProvider(designId)
  const createActor = createActorProvider(designId)
  const createCommand = createCommandProvider(designId)
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
      options: opts,
      createDesc,
      createInfo,
      createActor,
      createCommand,
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
    actor: createActor,
    command: createCommand,
    facadeCmd: createFacadeCommand,
    agg: createAgg,
    event: createEvent,
    system: createSystem,
    policy: createPolicy,
    service: createService,
    readModel: createReadModel,
    _getContext: () => context,
  }
}

export {
  type DomainDesigner,
  type DomainDesignAgg,
  type DomainDesignCommand,
  type DomainDesignFacadeCommand,
  type DomainDesignDesc,
  type DomainDesignEvent,
  type DomainDesignInfo,
  type DomainDesignInfoType,
  type DomainDesignActor,
  type DomainDesignSystem,
  type DomainDesignService,
  type DomainDesignPolicy,
  type DomainDesignInfoRecord,
  type DomainDesignReadModel,
  type DomainDesignObject,
  isDomainDesignInfo,
  isDomainDesignInfoFunc,
  isDomainDesignActor,
  isDomainDesignAgg,
  isDomainDesignCommand,
  isDomainDesignFacadeCommand,
  isDomainDesignEvent,
  isDomainDesignPolicy,
  isDomainDesignReadModel,
  isDomainDesignService,
  isDomainDesignSystem,
  isDomainDesigner,
} from './define'
