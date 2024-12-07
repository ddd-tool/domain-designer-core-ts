import { nanoid } from 'nanoid'
import {
  ArrowType,
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
  DomainDesignPerson,
  DomainDesignPersonProvider,
  DomainDesignPolicy,
  DomainDesignPolicyProvider,
  DomainDesignService,
  DomainDesignServiceProvider,
  DomainDesignSystem,
  DomainDesignSystemProvider,
} from './define'

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
  createPerson: DomainDesignPersonProvider
  createCommand: DomainDesignCommandProvider
  createFacadeCommand: DomainDesignFacadeCommandProvider
  createAgg: DomainDesignAggProvider
  createEvent: DomainDesignEventProvider
  createPolicy: DomainDesignPolicyProvider
  createService: DomainDesignServiceProvider
  createSystem: DomainDesignSystemProvider
}

export type DomainDesignInternalContext = ReturnType<typeof createInternalContext>
const _internalContextMap: Record<string, DomainDesignInternalContext> = {}

function createInternalContext(initFn: ContextInitializer) {
  const initResult = initFn()

  //NOTE: arrows的键为"srcid,destid"
  const arrows: Record<string, ArrowType> = {}
  const idMap: Record<string, object> = {}
  const commands: DomainDesignCommand<any>[] = []
  const facadeCommands: DomainDesignFacadeCommand<any>[] = []
  const persons: DomainDesignPerson[] = []
  const events: DomainDesignEvent<any>[] = []
  const policies: DomainDesignPolicy[] = []
  const services: DomainDesignService[] = []
  const systems: DomainDesignSystem[] = []
  const aggs: DomainDesignAgg<any>[] = []

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
    setUserStory(name: string, workflowNames: string[]): void {
      if (workflows[name] !== undefined) {
        throw new Error(`flow ${name} already exists`)
      }
      userStories[name] = workflowNames
    },
    link(from: string, to: string, arrowType: ArrowType = 'Normal') {
      if (currentWorkflowName && workflows[currentWorkflowName]) {
        if (
          workflows[currentWorkflowName].length === 0 ||
          workflows[currentWorkflowName][workflows[currentWorkflowName].length - 1] !== from
        ) {
          workflows[currentWorkflowName].push(from)
        }
        workflows[currentWorkflowName].push(to)
      }
      arrows[`${from},${to}`] = arrowType
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
    getArrows() {
      return arrows
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
    getPersons() {
      return persons
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
    registerCommand(command: DomainDesignCommand<any>) {
      idMap[command._attributes.__code] = command
      commands.push(command)
    },
    registerFacadeCommand(command: DomainDesignFacadeCommand<any>) {
      idMap[command._attributes.__code] = command
      facadeCommands.push(command)
    },
    registerPerson(person: DomainDesignPerson) {
      idMap[person._attributes.__code] = person
      persons.push(person)
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
    createDesc: initResult.createDesc,
    info: initResult.createInfo(),
    createPersion: initResult.createPerson,
    createCommand: initResult.createCommand,
    createFacadeCommand: initResult.createFacadeCommand,
    createAgg: initResult.createAgg,
    createEvent: initResult.createEvent,
    createPolicy: initResult.createPolicy,
    createService: initResult.createService,
    createSystem: initResult.createSystem,
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
