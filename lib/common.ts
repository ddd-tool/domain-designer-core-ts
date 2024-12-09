import { nanoid } from 'nanoid'
import {
  NonEmptyArray,
  DomainDesignAgg,
  DomainDesignAggProvider,
  DomainDesignCommand,
  DomainDesignCommandProvider,
  DomainDesignDescProvider,
  DomainDesignEvent,
  DomainDesignEventProvider,
  DomainDesignFacadeCommand,
  DomainDesignFacadeCommandProvider,
  DomainDesignInfoProvider,
  DomainDesignActor,
  DomainDesignActorProvider,
  DomainDesignPolicy,
  DomainDesignPolicyProvider,
  DomainDesignService,
  DomainDesignServiceProvider,
  DomainDesignSystem,
  DomainDesignSystemProvider,
  DomainDesignReadModel,
  DomainDesignReadModelProvider,
  CustomInfoArrayToInfoObject,
  DomainDesignInfo,
  DomainDesignInfoType,
} from './define'

export type LinkType = 'Association' | 'Dependency' | 'Aggregation' | 'Composition'
type Rule =
  | 'Info'
  | 'Actor'
  | 'Command'
  | 'FacadeCommand'
  | 'Agg'
  | 'Event'
  | 'Policy'
  | 'Service'
  | 'System'
  | 'ReadModel'

export function genId(): string {
  const id = nanoid()
  if (id === undefined) {
    throw new Error('id is undefined')
  }
  return id
}

type ContextInitializer = () => {
  id: string
  createDesc: DomainDesignDescProvider
  createInfo: DomainDesignInfoProvider
  createActor: DomainDesignActorProvider
  createCommand: DomainDesignCommandProvider
  createFacadeCommand: DomainDesignFacadeCommandProvider
  createAgg: DomainDesignAggProvider
  createEvent: DomainDesignEventProvider
  createPolicy: DomainDesignPolicyProvider
  createService: DomainDesignServiceProvider
  createSystem: DomainDesignSystemProvider
  createReadModel: DomainDesignReadModelProvider
}

export type DomainDesignInternalContext = ReturnType<typeof createInternalContext>
const _internalContextMap: Record<string, DomainDesignInternalContext> = {}

function createInternalContext(initFn: ContextInitializer) {
  const initResult = initFn()
  const info = initResult.createInfo()

  //NOTE: arrows的键为"srcid,destid"
  const links: Record<string, LinkType> = {}
  const idMap: Record<string, object> = {}
  const commands: DomainDesignCommand<any>[] = []
  const facadeCommands: DomainDesignFacadeCommand<any>[] = []
  const actors: DomainDesignActor[] = []
  const events: DomainDesignEvent<any>[] = []
  const policies: DomainDesignPolicy[] = []
  const services: DomainDesignService[] = []
  const systems: DomainDesignSystem[] = []
  const aggs: DomainDesignAgg<any>[] = []
  const readModels: DomainDesignReadModel<any>[] = []

  const workflows: Record<string, Array<string>> = {}
  const userStories: Record<string, Array<string>> = {}
  let currentWorkflowName: string | undefined = undefined
  return {
    startWorkflow(name: string): string {
      if (workflows[name] !== undefined) {
        throw new Error(`flow ${name} already exists`)
      }
      workflows[name] = []
      currentWorkflowName = name
      return name
    },
    defineUserStory(name: string, workflowNames: NonEmptyArray<string>): void {
      if (workflows[name] !== undefined) {
        throw new Error(`flow ${name} already exists`)
      }
      userStories[name] = workflowNames
    },
    linkTo(srcRule: Rule, srcCode: string, targetRule: Rule, targetCode: string, linkType: LinkType = 'Association') {
      if (currentWorkflowName && workflows[currentWorkflowName]) {
        if (
          workflows[currentWorkflowName].length === 0 ||
          workflows[currentWorkflowName][workflows[currentWorkflowName].length - 1] !== srcCode
        ) {
          workflows[currentWorkflowName].push(srcCode)
        }
        workflows[currentWorkflowName].push(targetCode)
      }
      links[`${srcRule},${srcCode},${targetRule},${targetCode}`] = linkType
    },
    getId() {
      return initResult.id
    },
    getWorkflows() {
      return workflows
    },
    getUserStories() {
      return userStories
    },
    getLinks() {
      return links
    },
    getIdMap() {
      return idMap
    },
    getCommands() {
      return commands
    },
    getFacadeCommands() {
      return facadeCommands
    },
    getActors() {
      return actors
    },
    getEvents() {
      return events
    },
    getPolicies() {
      return policies
    },
    getServices() {
      return services
    },
    getSystems() {
      return systems
    },
    getAggs() {
      return aggs
    },
    getReadModels() {
      return readModels
    },
    registerCommand(command: DomainDesignCommand<any>) {
      idMap[command._attributes.__code] = command
      commands.push(command)
    },
    registerFacadeCommand(command: DomainDesignFacadeCommand<any>) {
      idMap[command._attributes.__code] = command
      facadeCommands.push(command)
    },
    registerActor(actor: DomainDesignActor) {
      idMap[actor._attributes.__code] = actor
      actors.push(actor)
    },
    registerEvent(event: DomainDesignEvent<any>) {
      idMap[event._attributes.__code] = event
      events.push(event)
    },
    registerPolicy(policy: DomainDesignPolicy) {
      idMap[policy._attributes.__code] = policy
      policies.push(policy)
    },
    registerService(service: DomainDesignService) {
      idMap[service._attributes.__code] = service
      services.push(service)
    },
    registerSystem(system: DomainDesignSystem) {
      idMap[system._attributes.__code] = system
      systems.push(system)
    },
    registerAgg(agg: DomainDesignAgg<any>) {
      idMap[agg._attributes.__code] = agg
      aggs.push(agg)
    },
    registerReadModel(readModel: DomainDesignReadModel<any>) {
      idMap[readModel._attributes.__code] = readModel
      readModels.push(readModel)
    },
    customInfoArrToInfoObj<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<any, G_NAME> | G_NAME>>(
      arr: ARR
    ): CustomInfoArrayToInfoObject<ARR> {
      type T = Record<string, DomainDesignInfo<DomainDesignInfoType, G_NAME>>
      return arr.reduce((map, v) => {
        if (typeof v === 'string') {
          ;(map as T)[v] = info.any(v)
        } else {
          ;(map as T)[v._attributes.name] = v
        }
        return map
      }, {} as CustomInfoArrayToInfoObject<ARR>)
    },
    createDesc: initResult.createDesc,
    info,
    createPersion: initResult.createActor,
    createCommand: initResult.createCommand,
    createFacadeCommand: initResult.createFacadeCommand,
    createAgg: initResult.createAgg,
    createEvent: initResult.createEvent,
    createPolicy: initResult.createPolicy,
    createService: initResult.createService,
    createSystem: initResult.createSystem,
    createReadModel: initResult.createReadModel,
  }
}

export function useInternalContext(designId: string, initFn?: ContextInitializer): DomainDesignInternalContext {
  if (_internalContextMap[designId]) {
    return _internalContextMap[designId]
  }
  if (!_internalContextMap[designId] && initFn) {
    _internalContextMap[designId] = createInternalContext(initFn)
    return _internalContextMap[designId]
  }
  throw new Error('initFn is required')
}
