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

export {
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
} from './define'

function isDomainDesigner(param: any): param is DomainDesigner {
  const d = param as ReturnType<typeof createDomainDesigner>
  if (
    d &&
    typeof d.actor === 'function' &&
    typeof d.startWorkflow === 'function' &&
    typeof d.defineUserStory === 'function' &&
    typeof d._getContext === 'function' &&
    typeof d.desc === 'function' &&
    typeof d.info === 'object' &&
    typeof d.command === 'function' &&
    typeof d.facadeCmd === 'function' &&
    typeof d.agg === 'function' &&
    typeof d.event === 'function' &&
    typeof d.system === 'function' &&
    typeof d.policy === 'function' &&
    typeof d.service === 'function' &&
    typeof d.readModel === 'function'
  ) {
    return true
  }
  return false
}

export { isDomainDesigner }

export { match_string } from './wasm'
