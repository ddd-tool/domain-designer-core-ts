export class DomainObjectSet<T extends DomainDesignObject> implements Iterable<T> {
  private record: Record<string, T> = {}

  add(item: T): void {
    const key = item._attributes.__id
    if (this.record[key] !== undefined) {
      this.record[key] = item
    }
  }
  has(item: T): boolean {
    return this.record[item._attributes.__id] !== undefined
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
  | 'Desc'
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
  _attributes: { rule: DomainDesignRule; __id: string; name: string }
}
// ========================== 描述 ==========================
export type DomainDesignDescProvider = {
  (temp: undefined): undefined
  (temp: string): DomainDesignDesc
  (temp: DomainDesignDesc): DomainDesignDesc
  (temp: TemplateStringsArray, ...values: DomainDesignDescInject[]): DomainDesignDesc
}
export type DomainDesignDesc = Readonly<{
  readonly _attributes: {
    rule: Extract<DomainDesignRule, 'Desc'>
    readonly template: TemplateStringsArray
    readonly inject: DomainDesignDescInject[]
  }
}>
export type DomainDesignDescInject =
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
  document<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Document', NAME>
  func<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Function', NAME>
  func<NAME extends string>(
    name: NAME,
    dependsOn: NonEmptyArray<DomainDesignInfoFuncDependsOn | string | [string, string | DomainDesignDesc]>,
    desc?: string | DomainDesignDesc
  ): DomainDesignInfo<'Function', NAME>
  id<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Id', NAME>
  valueObj<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'ValueObject', NAME>
  version<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Version', NAME>
}
export type DomainDesignInfoType = 'Document' | 'Function' | 'Id' | 'ValueObject' | 'Version'
export type DomainDesignInfoSimplify<NAME extends string> = NAME | [NAME, string | DomainDesignDesc]
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
    readonly description?: DomainDesignDesc
  }
  toFormat(): string
}
export type DomainDesignInfoFuncDependsOn = DomainDesignInfo<Exclude<DomainDesignInfoType, 'Function'>, string>

export type DomainDesignInfoRecord = NonEmptyObject<Record<string, DomainDesignInfo<DomainDesignInfoType, string>>>

export type CustomInfo<G_NAME extends string> =
  | DomainDesignInfo<DomainDesignInfoType, G_NAME>
  | G_NAME
  | [G_NAME, string | DomainDesignDesc]
export type CustomInfoArrayToInfoObject<
  ARR extends Array<DomainDesignInfo<any, any> | string | [string, string | DomainDesignDesc]>
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
  (name: string, desc?: string | DomainDesignDesc): DomainDesignActor
}
export interface DomainDesignActor extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Actor'>
    readonly name: string
    readonly description?: DomainDesignDesc
  }
  command<COMMAND extends DomainDesignCommand<any>>(command: COMMAND): COMMAND
  command<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
  facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(command: FACADECMD): FACADECMD
  facadeCmd<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
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
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
}
export interface DomainDesignCommand<INFOS extends DomainDesignInfoRecord> extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Command'>
    readonly name: string
    readonly infos: INFOS
    readonly description?: DomainDesignDesc
  }
  readonly inner: INFOS
  agg<AGG extends DomainDesignAgg<any>>(agg: AGG): AGG
  agg<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    agg: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
  toFormat(): string
}

export type DomainDesignFacadeCommandProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>>
}
export interface DomainDesignFacadeCommand<INFOS extends DomainDesignInfoRecord> extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'FacadeCommand'>
    readonly name: string
    readonly infos: INFOS
    readonly description?: DomainDesignDesc
  }
  readonly inner: INFOS
  agg<AGG extends DomainDesignAgg<any>>(agg: AGG): AGG
  agg<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    agg: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
  service(service: DomainDesignService): DomainDesignService
  service(name: string, desc?: string | DomainDesignDesc): DomainDesignService
  toFormat(): string
}

// ========================== 事件 ==========================
export type DomainDesignEventProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignEvent<CustomInfoArrayToInfoObject<ARR>>
}
export interface DomainDesignEvent<INFOS extends DomainDesignInfoRecord> extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Event'>
    readonly name: string
    readonly infos: INFOS
    readonly description?: DomainDesignDesc
  }
  readonly inner: INFOS
  policy(policy: DomainDesignPolicy): DomainDesignPolicy
  policy(name: string, desc?: string | DomainDesignDesc): DomainDesignPolicy
  system(system: DomainDesignSystem): DomainDesignSystem
  system(name: string, desc?: string | DomainDesignDesc): DomainDesignSystem
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
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
}
export interface DomainDesignAgg<INFOS extends DomainDesignInfoRecord> extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Agg'>
    readonly name: string
    readonly infos: INFOS
    readonly description?: DomainDesignDesc
  }
  readonly inner: INFOS
  event<EVENT extends DomainDesignEvent<any>>(event: EVENT): EVENT
  event<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignEvent<CustomInfoArrayToInfoObject<ARR>>
  toFormat(): string
}

// ========================== 策略 ==========================
export type DomainDesignPolicyProvider = {
  (name: string, desc?: string | DomainDesignDesc): DomainDesignPolicy
}
export interface DomainDesignPolicy extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Policy'>
    readonly name: string
    readonly description?: DomainDesignDesc
  }
  service(service: DomainDesignService): DomainDesignService
  service(name: string, desc?: string | DomainDesignDesc): DomainDesignService
  toFormat(): string
}

// ========================== 外部系统 ==========================
export type DomainDesignSystemProvider = {
  (name: string, desc?: string | DomainDesignDesc): DomainDesignSystem
}
export interface DomainDesignSystem extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'System'>
    readonly name: string
    readonly description?: DomainDesignDesc
  }
  command<COMMAND extends DomainDesignCommand<any>>(command: COMMAND): COMMAND
  command<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
  facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(facadeCmd: FACADECMD): FACADECMD
  facadeCmd<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>>
  toFormat(): string
}

// ========================== 服务 ==========================
export type DomainDesignServiceProvider = (name: string, desc?: string | DomainDesignDesc) => DomainDesignService
export interface DomainDesignService extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'Service'>
    readonly name: string
    readonly description?: DomainDesignDesc
  }
  command<COMMAND extends DomainDesignCommand<any>>(command: COMMAND): COMMAND
  command<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
  facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(facadeCmd: FACADECMD): FACADECMD
  facadeCmd<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>>
  agg<AGG extends DomainDesignAgg<any>>(agg: AGG): AGG
  agg<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    agg: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
  toFormat(): string
}

// ========================== 读模型 ==========================
export type DomainDesignReadModelProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignReadModel<CustomInfoArrayToInfoObject<ARR>>
}
export interface DomainDesignReadModel<INFOS extends DomainDesignInfoRecord> extends DomainDesignObject {
  readonly _attributes: {
    readonly __id: string
    readonly rule: Extract<DomainDesignRule, 'ReadModel'>
    readonly name: string
    readonly infos: INFOS
    readonly description?: DomainDesignDesc
  }
  readonly inner: INFOS
  toFormat(): string
}

// ========================== 配置 ==========================

export type DomainDesignOptions = {
  toFormatType?: 'BngleBrackets' | 'JSON' | 'JSONPretty'
}

export type Warning = {
  _attributes: {
    rule: 'CheckResult'
  }
  type: 'warning'
  message: string
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

export type DomainDesigner = {
  startWorkflow: (name: string) => string
  defineUserStory: (name: string, workflowNames: import('./define').NonEmptyArray<string>) => void
  desc: import('./define').DomainDesignDescProvider
  info: {
    document<NAME extends string>(
      name: NAME,
      desc?: string | import('./define').DomainDesignDesc
    ): import('./define').DomainDesignInfo<'Document', NAME>
    func<NAME extends string>(
      name: NAME,
      desc?: string | import('./define').DomainDesignDesc
    ): import('./define').DomainDesignInfo<'Function', NAME>
    func<NAME extends string>(
      name: NAME,
      dependsOn: import('./define').NonEmptyArray<
        | import('./define').DomainDesignInfoFuncDependsOn
        | string
        | [string, string | import('./define').DomainDesignDesc]
      >,
      desc?: string | import('./define').DomainDesignDesc
    ): import('./define').DomainDesignInfo<'Function', NAME>
    id<NAME extends string>(
      name: NAME,
      desc?: string | import('./define').DomainDesignDesc
    ): import('./define').DomainDesignInfo<'Id', NAME>
    valueObj<NAME extends string>(
      name: NAME,
      desc?: string | import('./define').DomainDesignDesc
    ): import('./define').DomainDesignInfo<'ValueObject', NAME>
    version<NAME extends string>(
      name: NAME,
      desc?: string | import('./define').DomainDesignDesc
    ): import('./define').DomainDesignInfo<'Version', NAME>
  }
  actor: import('./define').DomainDesignActorProvider
  command: import('./define').DomainDesignCommandProvider
  facadeCmd: import('./define').DomainDesignFacadeCommandProvider
  agg: import('./define').DomainDesignAggProvider
  event: import('./define').DomainDesignEventProvider
  system: import('./define').DomainDesignSystemProvider
  policy: import('./define').DomainDesignPolicyProvider
  service: import('./define').DomainDesignServiceProvider
  readModel: import('./define').DomainDesignReadModelProvider
  _getContext: () => {
    startWorkflow(name: string): string
    defineUserStory(name: string, workflowNames: import('./define').NonEmptyArray<string>): void
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
    getWorkflows(): Record<string, string[]>
    getUserStories(): Record<string, string[]>
    getLinks(): Record<string, import('./common').LinkType>
    getIdMap(): Record<string, import('./define').DomainDesignObject>
    getAssociationMap(): Record<string, import('./define').DomainObjectSet<import('./define').DomainDesignObject>>
    getCommands(): import('./define').DomainDesignCommand<any>[]
    getFacadeCommands(): import('./define').DomainDesignFacadeCommand<any>[]
    getActors(): import('./define').DomainDesignActor[]
    getEvents(): import('./define').DomainDesignEvent<any>[]
    getPolicies(): import('./define').DomainDesignPolicy[]
    getServices(): import('./define').DomainDesignService[]
    getSystems(): import('./define').DomainDesignSystem[]
    getAggs(): import('./define').DomainDesignAgg<any>[]
    getReadModels(): import('./define').DomainDesignReadModel<any>[]
    registerInfo(info: import('./define').DomainDesignInfo<any, any>): void
    registerCommand(command: import('./define').DomainDesignCommand<any>): void
    registerFacadeCommand(command: import('./define').DomainDesignFacadeCommand<any>): void
    registerActor(actor: import('./define').DomainDesignActor): void
    registerEvent(event: import('./define').DomainDesignEvent<any>): void
    registerPolicy(policy: import('./define').DomainDesignPolicy): void
    registerService(service: import('./define').DomainDesignService): void
    registerSystem(system: import('./define').DomainDesignSystem): void
    registerAgg(agg: import('./define').DomainDesignAgg<any>): void
    registerReadModel(readModel: import('./define').DomainDesignReadModel<any>): void
    customInfoArrToInfoObj<
      G_NAME extends string,
      ARR extends import('./define').NonEmptyArray<import('./define').CustomInfo<G_NAME>>
    >(
      arr: ARR
    ): import('./define').CustomInfoArrayToInfoObject<ARR>
    customInfoArrToInfoArr<
      G_NAME extends string,
      ARR extends import('./define').NonEmptyArray<import('./define').CustomInfo<G_NAME>>
    >(
      arr: ARR
    ): import('./define').DomainDesignInfo<import('./define').DomainDesignInfoType, string>[]
    toFormat<OBJ extends { _attributes: { __id: string; name: string } }>(obj: OBJ): string
    createDesc: import('./define').DomainDesignDescProvider
    info: {
      document<NAME extends string>(
        name: NAME,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignInfo<'Document', NAME>
      func<NAME extends string>(
        name: NAME,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignInfo<'Function', NAME>
      func<NAME extends string>(
        name: NAME,
        dependsOn: import('./define').NonEmptyArray<
          | import('./define').DomainDesignInfoFuncDependsOn
          | string
          | [string, string | import('./define').DomainDesignDesc]
        >,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignInfo<'Function', NAME>
      id<NAME extends string>(
        name: NAME,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignInfo<'Id', NAME>
      valueObj<NAME extends string>(
        name: NAME,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignInfo<'ValueObject', NAME>
      version<NAME extends string>(
        name: NAME,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignInfo<'Version', NAME>
    }
    createPersion: import('./define').DomainDesignActorProvider
    createCommand: import('./define').DomainDesignCommandProvider
    createFacadeCommand: import('./define').DomainDesignFacadeCommandProvider
    createAgg: import('./define').DomainDesignAggProvider
    createEvent: import('./define').DomainDesignEventProvider
    createPolicy: import('./define').DomainDesignPolicyProvider
    createService: import('./define').DomainDesignServiceProvider
    createSystem: import('./define').DomainDesignSystemProvider
    createReadModel: import('./define').DomainDesignReadModelProvider
  }
}
