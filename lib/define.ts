export class DomainObjectSet<T extends DomainDesignObject> implements Iterable<T> {
  private record: Record<string, T> = {}

  add(item: T): void {
    const key = item._attributes.__id
    if (this.record[key] === undefined) {
      this.record[key] = item
    }
  }
  has(item: T): boolean {
    return this.record[item._attributes.__id] !== undefined
  }
  getById(__id: string) {
    return this.record[__id]
  }
  delete(item: T): boolean {
    return delete this.record[item._attributes.__id]
  }
  [Symbol.iterator](): Iterator<T> {
    let index = 0
    const items = Object.values(this.record)
    return {
      next(): IteratorResult<T> {
        if (index < items.length) {
          return { value: items[index++], done: false }
        } else {
          return { value: undefined as any, done: true }
        }
      },
    }
  }
}
export type DomainDesignRule =
  | 'Note'
  | 'Info'
  | 'Actor'
  | 'Command'
  | 'FacadeCommand'
  | 'Event'
  | 'Agg'
  | 'System'
  | 'Policy'
  | 'Service'
  | 'ReadModel'

export interface DomainDesignObject {
  readonly _attributes: {
    readonly rule: DomainDesignRule
    readonly __id: string
    readonly name: string
    readonly note?: DomainDesignNote
  }
}
// ========================== 描述 ==========================
export type DomainDesignNoteProvider = {
  (temp: undefined): undefined
  (temp: string): DomainDesignNote
  (temp: DomainDesignNote): DomainDesignNote
  (temp: TemplateStringsArray, ...values: DomainDesignNoteInject[]): DomainDesignNote
}
export type DomainDesignNote = Readonly<{
  readonly _attributes: {
    rule: Extract<DomainDesignRule, 'Note'>
    readonly template: TemplateStringsArray
    readonly inject: DomainDesignNoteInject[]
  }
}>
export type DomainDesignNoteInject =
  | DomainDesignInfo<any, any>
  | DomainDesignCommand<any>
  | DomainDesignFacadeCommand<any>
  | DomainDesignEvent<any>
  | DomainDesignAgg<any>
  | DomainDesignActor
  | DomainDesignSystem
  | DomainDesignPolicy
  | DomainDesignService

// ========================== 信息 ==========================
export type DomainDesignInfoProvider = () => {
  document<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'Document', NAME>
  func<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'Function', NAME>
  func<NAME extends string>(
    name: NAME,
    dependsOn: NonEmptyArray<DomainDesignInfoFuncDependsOn | string | [string, string | DomainDesignNote]>,
    note?: string | DomainDesignNote
  ): DomainDesignInfo<'Function', NAME>
  id<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'Id', NAME>
  valueObj<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'ValueObject', NAME>
  version<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'Version', NAME>
}
export type DomainDesignInfoType = 'Document' | 'Function' | 'Id' | 'ValueObject' | 'Version'
export type DomainDesignInfoSimplify<NAME extends string> = NAME | [NAME, string | DomainDesignNote]
export type DomainDesignInfoSubtype<TYPE extends DomainDesignInfoType> = TYPE extends
  | 'Document'
  | 'Id'
  | 'Version'
  | 'ValueObject'
  ? 'None'
  : TYPE extends 'Function'
  ? DomainDesignInfoFuncDependsOn[]
  : never
export interface DomainDesignInfo<TYPE extends DomainDesignInfoType, NAME extends string> extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Info'>
    readonly type: TYPE
    readonly subtype: DomainDesignInfoSubtype<TYPE>
    readonly name: NAME
    readonly note?: DomainDesignNote
  }
  toFormat(): string
}
export type DomainDesignInfoFuncDependsOn = DomainDesignInfo<Exclude<DomainDesignInfoType, 'Function'>, string>

export type DomainDesignInfoRecord = NonEmptyObject<Record<string, DomainDesignInfo<DomainDesignInfoType, string>>>

export type CustomInfo<G_NAME extends string> =
  | DomainDesignInfo<DomainDesignInfoType, G_NAME>
  | G_NAME
  | [G_NAME, string | DomainDesignNote]
export type CustomInfoArrayToInfoObject<
  ARR extends Array<DomainDesignInfo<any, any> | string | [string, string | DomainDesignNote]>
> = {
  [K in ARR[number] as K extends DomainDesignInfo<any, infer U>
    ? U
    : K extends string
    ? K
    : K extends [infer U, any]
    ? U
    : never]: K extends DomainDesignInfo<any, any>
    ? K
    : K extends string
    ? DomainDesignInfo<'ValueObject', K>
    : K extends [infer U extends string, any]
    ? DomainDesignInfo<'ValueObject', U>
    : never
}

// ========================== 参与者 ==========================
export type DomainDesignActorProvider = {
  (name: string, note?: string | DomainDesignNote): DomainDesignActor
}
export interface DomainDesignActor extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Actor'>
    readonly name: string
    readonly note?: DomainDesignNote
  }
  command<COMMAND extends DomainDesignCommand<any>>(command: COMMAND): COMMAND
  command<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infos: ARR,
    note?: string | DomainDesignNote
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
  facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(command: FACADECMD): FACADECMD
  facadeCmd<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infos: ARR,
    note?: string | DomainDesignNote
  ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>>
  readModel<READ_MODEL extends DomainDesignReadModel<any>>(readModel: READ_MODEL): READ_MODEL
  readModel<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>
  ): DomainDesignReadModel<CustomInfoArrayToInfoObject<ARR>>
  toFormat(): string
}

// ========================== 指令 ==========================
export type DomainDesignCommandProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    note?: string | DomainDesignNote
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
}
export interface DomainDesignCommand<INFOS extends DomainDesignInfoRecord> extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Command'>
    readonly name: string
    readonly infos: INFOS
    readonly note?: DomainDesignNote
  }
  readonly inner: INFOS
  agg<AGG extends DomainDesignAgg<any>>(agg: AGG): AGG
  agg<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    agg: ARR,
    note?: string | DomainDesignNote
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
  toFormat(): string
}

export type DomainDesignFacadeCommandProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    note?: string | DomainDesignNote
  ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>>
}
export interface DomainDesignFacadeCommand<INFOS extends DomainDesignInfoRecord> extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'FacadeCommand'>
    readonly name: string
    readonly infos: INFOS
    readonly note?: DomainDesignNote
  }
  readonly inner: INFOS
  agg<AGG extends DomainDesignAgg<any>>(agg: AGG): AGG
  agg<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    agg: ARR,
    note?: string | DomainDesignNote
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
  service(service: DomainDesignService): DomainDesignService
  service(name: string, note?: string | DomainDesignNote): DomainDesignService
  toFormat(): string
}

// ========================== 事件 ==========================
export type DomainDesignEventProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    note?: string | DomainDesignNote
  ): DomainDesignEvent<CustomInfoArrayToInfoObject<ARR>>
}
export interface DomainDesignEvent<INFOS extends DomainDesignInfoRecord> extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Event'>
    readonly name: string
    readonly infos: INFOS
    readonly note?: DomainDesignNote
  }
  readonly inner: INFOS
  policy(policy: DomainDesignPolicy): DomainDesignPolicy
  policy(name: string, note?: string | DomainDesignNote): DomainDesignPolicy
  system(system: DomainDesignSystem): DomainDesignSystem
  system(name: string, note?: string | DomainDesignNote): DomainDesignSystem
  readModel<READ_MODEL extends DomainDesignReadModel<any>>(readModel: READ_MODEL): READ_MODEL
  readModel<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>
  ): DomainDesignReadModel<CustomInfoArrayToInfoObject<ARR>>
  toFormat(): string
}

// ========================== 聚合 ==========================
export type DomainDesignAggProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    note?: string | DomainDesignNote
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
}
export interface DomainDesignAgg<INFOS extends DomainDesignInfoRecord> extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Agg'>
    readonly name: string
    readonly infos: INFOS
    readonly note?: DomainDesignNote
  }
  readonly inner: INFOS
  event<EVENT extends DomainDesignEvent<any>>(event: EVENT): EVENT
  event<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR,
    note?: string | DomainDesignNote
  ): DomainDesignEvent<CustomInfoArrayToInfoObject<ARR>>
  toFormat(): string
}

// ========================== 策略 ==========================
export type DomainDesignPolicyProvider = {
  (name: string, note?: string | DomainDesignNote): DomainDesignPolicy
}
export interface DomainDesignPolicy extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Policy'>
    readonly name: string
    readonly note?: DomainDesignNote
  }
  service(service: DomainDesignService): DomainDesignService
  service(name: string, note?: string | DomainDesignNote): DomainDesignService
  toFormat(): string
}

// ========================== 外部系统 ==========================
export type DomainDesignSystemProvider = {
  (name: string, note?: string | DomainDesignNote): DomainDesignSystem
}
export interface DomainDesignSystem extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'System'>
    readonly name: string
    readonly note?: DomainDesignNote
  }
  command<COMMAND extends DomainDesignCommand<any>>(command: COMMAND): COMMAND
  command<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR,
    note?: string | DomainDesignNote
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
  facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(facadeCmd: FACADECMD): FACADECMD
  facadeCmd<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR,
    note?: string | DomainDesignNote
  ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>>
  event<EVENT extends DomainDesignEvent<any>>(event: EVENT): EVENT
  event<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR,
    note?: string | DomainDesignNote
  ): DomainDesignEvent<CustomInfoArrayToInfoObject<ARR>>
  toFormat(): string
}

// ========================== 服务 ==========================
export type DomainDesignServiceProvider = (name: string, note?: string | DomainDesignNote) => DomainDesignService
export interface DomainDesignService extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Service'>
    readonly name: string
    readonly note?: DomainDesignNote
  }
  command<COMMAND extends DomainDesignCommand<any>>(command: COMMAND): COMMAND
  command<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR,
    note?: string | DomainDesignNote
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
  facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(facadeCmd: FACADECMD): FACADECMD
  facadeCmd<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR,
    note?: string | DomainDesignNote
  ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>>
  agg<AGG extends DomainDesignAgg<any>>(agg: AGG): AGG
  agg<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    agg: ARR,
    note?: string | DomainDesignNote
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
  toFormat(): string
}

// ========================== 读模型 ==========================
export type DomainDesignReadModelProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    note?: string | DomainDesignNote
  ): DomainDesignReadModel<CustomInfoArrayToInfoObject<ARR>>
}
export interface DomainDesignReadModel<INFOS extends DomainDesignInfoRecord> extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'ReadModel'>
    readonly name: string
    readonly infos: INFOS
    readonly note?: DomainDesignNote
  }
  readonly inner: INFOS
  toFormat(): string
}

// ========================== 配置 ==========================

export type DomainDesignOptions = {
  moduleName?: string
  ignoreValueObjects?: string[]
  __toFormatType?: 'BngleBrackets' | 'JSON' | 'JSONPretty'
}

// ========================== 其他 ==========================
export type NonEmptyArray<T> = [T, ...T[]]
export type NonEmptyObject<T extends object> = keyof T extends never ? never : T
export type NonEmptyInitFunc<T extends () => object> = keyof ReturnType<T> extends never ? never : T

export function isDomainDesignInfo(param: any): param is DomainDesignInfo<any, any> {
  return param && param._attributes && param._attributes.rule === 'Info'
}
export function isDomainDesignInfoFunc<NAME extends string>(
  info: DomainDesignInfo<DomainDesignInfoType, NAME>
): info is DomainDesignInfo<'Function', NAME> {
  return info._attributes.rule === 'Info' && info._attributes.type === 'Function'
}
export function isDomainDesignActor(param: any): param is DomainDesignActor {
  return param && param._attributes && param._attributes.rule === 'Actor'
}
export function isDomainDesignAgg(param: any): param is DomainDesignAgg<any> {
  return param && param._attributes && param._attributes.rule === 'Agg'
}
export function isDomainDesignCommand(param: any): param is DomainDesignCommand<any> {
  return param && param._attributes && param._attributes.rule === 'Command'
}
export function isDomainDesignFacadeCommand(param: any): param is DomainDesignFacadeCommand<any> {
  return param && param._attributes && param._attributes.rule === 'FacadeCommand'
}
export function isDomainDesignEvent(param: any): param is DomainDesignEvent<any> {
  return param && param._attributes && param._attributes.rule === 'Event'
}
export function isDomainDesignPolicy(param: any): param is DomainDesignPolicy {
  return param && param._attributes && param._attributes.rule === 'Policy'
}
export function isDomainDesignReadModel(param: any): param is DomainDesignReadModel<any> {
  return param && param._attributes && param._attributes.rule === 'ReadModel'
}
export function isDomainDesignService(param: any): param is DomainDesignService {
  return param && param._attributes && param._attributes.rule === 'Service'
}
export function isDomainDesignSystem(param: any): param is DomainDesignSystem {
  return param && param._attributes && param._attributes.rule === 'System'
}
export function isAnyDomainDesignObject(param: any): param is DomainDesignObject {
  return param && param._attributes && param._attributes.rule && typeof param._attributes.__id === 'string'
}

// *********************************************************
// ide推导 DomainDesigner类型
// *********************************************************
export function isDomainDesigner(param: any): param is DomainDesigner {
  const d = param as DomainDesigner
  return (
    d &&
    typeof d.actor === 'function' &&
    typeof d.startWorkflow === 'function' &&
    typeof d.defineUserStory === 'function' &&
    typeof d._getContext === 'function' &&
    typeof d.note === 'function' &&
    typeof d.info === 'object' &&
    typeof d.command === 'function' &&
    typeof d.facadeCmd === 'function' &&
    typeof d.agg === 'function' &&
    typeof d.event === 'function' &&
    typeof d.system === 'function' &&
    typeof d.policy === 'function' &&
    typeof d.service === 'function' &&
    typeof d.readModel === 'function'
  )
}

export type DomainDesigner = {
  startWorkflow: (name: string) => string
  defineUserStory: (name: string, workflowNames: NonEmptyArray<string>) => void
  note: DomainDesignNoteProvider
  info: {
    document<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'Document', NAME>
    func<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'Function', NAME>
    func<NAME extends string>(
      name: NAME,
      dependsOn: NonEmptyArray<DomainDesignInfoFuncDependsOn | string | [string, string | DomainDesignNote]>,
      note?: string | DomainDesignNote
    ): DomainDesignInfo<'Function', NAME>
    id<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'Id', NAME>
    valueObj<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'ValueObject', NAME>
    version<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'Version', NAME>
  }
  actor: DomainDesignActorProvider
  command: DomainDesignCommandProvider
  facadeCmd: DomainDesignFacadeCommandProvider
  agg: DomainDesignAggProvider
  event: DomainDesignEventProvider
  system: DomainDesignSystemProvider
  policy: DomainDesignPolicyProvider
  service: DomainDesignServiceProvider
  readModel: DomainDesignReadModelProvider
  _getContext: () => {
    startWorkflow(name: string): string
    defineUserStory(name: string, workflowNames: NonEmptyArray<string>): void
    linkTo(
      srcRule:
        | 'Info'
        | 'Actor'
        | 'Command'
        | 'FacadeCommand'
        | 'Agg'
        | 'Event'
        | 'Policy'
        | 'Service'
        | 'System'
        | 'ReadModel',
      srcId: string,
      targetRule:
        | 'Info'
        | 'Actor'
        | 'Command'
        | 'FacadeCommand'
        | 'Agg'
        | 'Event'
        | 'Policy'
        | 'Service'
        | 'System'
        | 'ReadModel',
      targetId: string,
      linkType?: import('./common').LinkType
    ): void
    getDesignerId(): string
    getDesignerOptions(): Required<DomainDesignOptions>
    getWorkflows(): Record<string, string[]>
    getUserStories(): Record<string, string[]>
    getLinks(): Record<string, import('./common').LinkType>
    getIdMap(): Record<string, DomainDesignObject>
    getAssociationMap(): Record<string, DomainObjectSet<DomainDesignObject>>
    getCommands(): DomainDesignCommand<any>[]
    getFacadeCommands(): DomainDesignFacadeCommand<any>[]
    getActors(): DomainDesignActor[]
    getEvents(): DomainDesignEvent<any>[]
    getPolicies(): DomainDesignPolicy[]
    getServices(): DomainDesignService[]
    getSystems(): DomainDesignSystem[]
    getAggs(): DomainDesignAgg<any>[]
    getReadModels(): DomainDesignReadModel<any>[]
    registerInfo(info: DomainDesignInfo<any, any>): void
    registerCommand(command: DomainDesignCommand<any>): void
    registerFacadeCommand(command: DomainDesignFacadeCommand<any>): void
    registerActor(actor: DomainDesignActor): void
    registerEvent(event: DomainDesignEvent<any>): void
    registerPolicy(policy: DomainDesignPolicy): void
    registerService(service: DomainDesignService): void
    registerSystem(system: DomainDesignSystem): void
    registerAgg(agg: DomainDesignAgg<any>): void
    registerReadModel(readModel: DomainDesignReadModel<any>): void
    customInfoArrToInfoObj<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
      arr: ARR
    ): CustomInfoArrayToInfoObject<ARR>
    customInfoArrToInfoArr<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
      arr: ARR
    ): DomainDesignInfo<DomainDesignInfoType, string>[]
    toFormat<OBJ extends { _attributes: { __id: string; name: string } }>(obj: OBJ): string
    createNote: DomainDesignNoteProvider
    info: {
      document<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'Document', NAME>
      func<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'Function', NAME>
      func<NAME extends string>(
        name: NAME,
        dependsOn: NonEmptyArray<DomainDesignInfoFuncDependsOn | string | [string, string | DomainDesignNote]>,
        note?: string | DomainDesignNote
      ): DomainDesignInfo<'Function', NAME>
      id<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'Id', NAME>
      valueObj<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'ValueObject', NAME>
      version<NAME extends string>(name: NAME, note?: string | DomainDesignNote): DomainDesignInfo<'Version', NAME>
    }
    createPersion: DomainDesignActorProvider
    createCommand: DomainDesignCommandProvider
    createFacadeCommand: DomainDesignFacadeCommandProvider
    createAgg: DomainDesignAggProvider
    createEvent: DomainDesignEventProvider
    createPolicy: DomainDesignPolicyProvider
    createService: DomainDesignServiceProvider
    createSystem: DomainDesignSystemProvider
    createReadModel: DomainDesignReadModelProvider
  }
}
