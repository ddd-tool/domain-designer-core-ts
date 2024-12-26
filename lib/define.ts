// ========================== 描述 ==========================
export type DomainDesignDescProvider = {
  (temp: undefined): undefined
  (temp: string): DomainDesignDesc
  (temp: DomainDesignDesc): DomainDesignDesc
  (temp: TemplateStringsArray, ...values: DomainDesignDescValue[]): DomainDesignDesc
}
export type DomainDesignDesc = Readonly<{
  readonly _attributes: {
    rule: 'Desc'
    readonly template: TemplateStringsArray
    readonly values: DomainDesignDescValue[]
  }
}>
export type DomainDesignDescValue =
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
export type DomainDesignInfo<TYPE extends DomainDesignInfoType, NAME extends string> = Readonly<{
  _attributes: {
    __id: string
    rule: 'Info'
    type: TYPE
    subtype: DomainDesignInfoSubtype<TYPE>
    name: NAME
    description?: DomainDesignDesc
  }
  toFormat(): string
}>
export type DomainDesignInfoFuncDependsOn = DomainDesignInfo<Exclude<DomainDesignInfoType, 'Function'>, string>

export type DomainDesignInfoObject = NonEmptyObject<Record<string, DomainDesignInfo<DomainDesignInfoType, string>>>

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
export type DomainDesignActor = Readonly<{
  readonly _attributes: {
    __id: string
    rule: 'Actor'
    name: string
    description?: DomainDesignDesc
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
}>

// ========================== 指令 ==========================
export type DomainDesignCommandProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
}
export type DomainDesignCommand<INFOS extends DomainDesignInfoObject> = Readonly<{
  readonly _attributes: {
    __id: string
    rule: 'Command'
    name: string
    infos: INFOS
    description?: DomainDesignDesc
  }
  inner: INFOS
  agg<AGG extends DomainDesignAgg<any>>(agg: AGG): AGG
  agg<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    agg: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
  toFormat(): string
}>

export type DomainDesignFacadeCommandProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>>
}
export type DomainDesignFacadeCommand<INFOS extends DomainDesignInfoObject> = Readonly<{
  readonly _attributes: {
    __id: string
    rule: 'FacadeCommand'
    name: string
    infos: INFOS
    description?: DomainDesignDesc
  }
  inner: INFOS
  agg<AGG extends DomainDesignAgg<any>>(agg: AGG): AGG
  agg<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    agg: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
  service(service: DomainDesignService): DomainDesignService
  service(name: string, desc?: string | DomainDesignDesc): DomainDesignService
  toFormat(): string
}>

// ========================== 事件 ==========================
export type DomainDesignEventProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignEvent<CustomInfoArrayToInfoObject<ARR>>
}
export type DomainDesignEvent<INFOS extends DomainDesignInfoObject> = Readonly<{
  readonly _attributes: {
    __id: string
    rule: 'Event'
    name: string
    infos: INFOS
    description?: DomainDesignDesc
  }
  inner: INFOS
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
}>

// ========================== 聚合 ==========================
export type DomainDesignAggProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
}
export type DomainDesignAgg<INFOS extends DomainDesignInfoObject> = Readonly<{
  readonly _attributes: {
    __id: string
    rule: 'Agg'
    name: string
    infos: INFOS
    description?: DomainDesignDesc
  }
  inner: INFOS
  event<EVENT extends DomainDesignEvent<any>>(event: EVENT): EVENT
  event<G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignEvent<CustomInfoArrayToInfoObject<ARR>>
  toFormat(): string
}>

// ========================== 策略 ==========================
export type DomainDesignPolicyProvider = {
  (name: string, desc?: string | DomainDesignDesc): DomainDesignPolicy
}
export type DomainDesignPolicy = Readonly<{
  readonly _attributes: {
    __id: string
    rule: 'Policy'
    name: string
    description?: DomainDesignDesc
  }
  service(service: DomainDesignService): DomainDesignService
  service(name: string, desc?: string | DomainDesignDesc): DomainDesignService
  toFormat(): string
}>

// ========================== 外部系统 ==========================
export type DomainDesignSystemProvider = {
  (name: string, desc?: string | DomainDesignDesc): DomainDesignSystem
}
export type DomainDesignSystem = Readonly<{
  readonly _attributes: {
    __id: string
    rule: 'System'
    name: string
    description?: DomainDesignDesc
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
}>

// ========================== 服务 ==========================
export type DomainDesignServiceProvider = (name: string, desc?: string | DomainDesignDesc) => DomainDesignService
export type DomainDesignService = Readonly<{
  readonly _attributes: {
    __id: string
    rule: 'Service'
    name: string
    description?: DomainDesignDesc
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
}>

// ========================== 读模型 ==========================
export type DomainDesignReadModelProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ): DomainDesignReadModel<CustomInfoArrayToInfoObject<ARR>>
}
export type DomainDesignReadModel<INFOS extends DomainDesignInfoObject> = Readonly<{
  readonly _attributes: {
    __id: string
    rule: 'ReadModel'
    name: string
    infos: INFOS
    description?: DomainDesignDesc
  }
  inner: INFOS
  toFormat(): string
}>

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
  return param._attributes && param._attributes.rule === 'Info'
}
export function isDomainDesignInfoFunc<NAME extends string>(
  info: DomainDesignInfo<DomainDesignInfoType, NAME>
): info is DomainDesignInfo<'Function', NAME> {
  return info._attributes.rule === 'Info' && info._attributes.type === 'Function'
}
export function isDomainDesignActor(param: any): param is DomainDesignActor {
  return param._attributes && param._attributes.rule === 'Actor'
}
export function isDomainDesignAgg(param: any): param is DomainDesignAgg<any> {
  return param._attributes && param._attributes.rule === 'Agg'
}
export function isDomainDesignCommand(param: any): param is DomainDesignCommand<any> {
  return param._attributes && param._attributes.rule === 'Command'
}
export function isDomainDesignFacadeCommand(param: any): param is DomainDesignFacadeCommand<any> {
  return param._attributes && param._attributes.rule === 'FacadeCommand'
}
export function isDomainDesignEvent(param: any): param is DomainDesignEvent<any> {
  return param._attributes && param._attributes.rule === 'Event'
}
export function isDomainDesignPolicy(param: any): param is DomainDesignPolicy {
  return param._attributes && param._attributes.rule === 'Policy'
}
export function isDomainDesignReadModel(param: any): param is DomainDesignReadModel<any> {
  return param._attributes && param._attributes.rule === 'ReadModel'
}
export function isDomainDesignService(param: any): param is DomainDesignService {
  return param._attributes && param._attributes.rule === 'Service'
}
export function isDomainDesignSystem(param: any): param is DomainDesignSystem {
  return param._attributes && param._attributes.rule === 'System'
}

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

// *********************************************************
//
// *********************************************************

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
      srcCode: string,
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
      targetCode: string,
      linkType?: import('./common').LinkType
    ): void
    getId(): string
    getWorkflows(): Record<string, string[]>
    getUserStories(): Record<string, string[]>
    getLinks(): Record<string, import('./common').LinkType>
    getIdMap(): Record<string, object>
    getCommands(): Readonly<{
      readonly _attributes: {
        __id: string
        rule: 'Command'
        name: string
        infos: any
        description?:
          | Readonly<{
              readonly _attributes: {
                rule: 'Desc'
                readonly template: TemplateStringsArray
                readonly values: import('./define').DomainDesignDescValue[]
              }
            }>
          | undefined
      }
      inner: any
      agg<AGG extends import('./define').DomainDesignAgg<any>>(agg: AGG): AGG
      agg<G_NAME extends string, ARR extends import('./define').NonEmptyArray<import('./define').CustomInfo<G_NAME>>>(
        name: string,
        agg: ARR,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignAgg<import('./define').CustomInfoArrayToInfoObject<ARR>>
      toFormat(): string
    }>[]
    getFacadeCommands(): Readonly<{
      readonly _attributes: {
        __id: string
        rule: 'FacadeCommand'
        name: string
        infos: any
        description?:
          | Readonly<{
              readonly _attributes: {
                rule: 'Desc'
                readonly template: TemplateStringsArray
                readonly values: import('./define').DomainDesignDescValue[]
              }
            }>
          | undefined
      }
      inner: any
      agg<AGG extends import('./define').DomainDesignAgg<any>>(agg: AGG): AGG
      agg<G_NAME extends string, ARR extends import('./define').NonEmptyArray<import('./define').CustomInfo<G_NAME>>>(
        name: string,
        agg: ARR,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignAgg<import('./define').CustomInfoArrayToInfoObject<ARR>>
      service(service: import('./define').DomainDesignService): import('./define').DomainDesignService
      service(name: string, desc?: string | import('./define').DomainDesignDesc): import('./define').DomainDesignService
      toFormat(): string
    }>[]
    getActors(): Readonly<{
      readonly _attributes: {
        __id: string
        rule: 'Actor'
        name: string
        description?: import('./define').DomainDesignDesc
      }
      command<COMMAND extends import('./define').DomainDesignCommand<any>>(command: COMMAND): COMMAND
      command<
        G_NAME extends string,
        ARR extends import('./define').NonEmptyArray<
          import('./define').DomainDesignInfo<import('./define').DomainDesignInfoType, G_NAME> | G_NAME
        >
      >(
        name: string,
        infos: ARR,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignCommand<import('./define').CustomInfoArrayToInfoObject<ARR>>
      facadeCmd<FACADECMD extends import('./define').DomainDesignFacadeCommand<any>>(command: FACADECMD): FACADECMD
      facadeCmd<
        G_NAME extends string,
        ARR extends import('./define').NonEmptyArray<
          import('./define').DomainDesignInfo<import('./define').DomainDesignInfoType, G_NAME> | G_NAME
        >
      >(
        name: string,
        infos: ARR,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignFacadeCommand<import('./define').CustomInfoArrayToInfoObject<ARR>>
      readModel<READ_MODEL extends import('./define').DomainDesignReadModel<any>>(readModel: READ_MODEL): READ_MODEL
      readModel<
        G_NAME extends string,
        ARR extends import('./define').NonEmptyArray<
          import('./define').DomainDesignInfo<import('./define').DomainDesignInfoType, G_NAME> | G_NAME
        >
      >(
        name: string,
        infos: ARR | import('./define').NonEmptyInitFunc<() => ARR>
      ): import('./define').DomainDesignReadModel<import('./define').CustomInfoArrayToInfoObject<ARR>>
      toFormat(): string
    }>[]
    getEvents(): Readonly<{
      readonly _attributes: {
        __id: string
        rule: 'Event'
        name: string
        infos: any
        description?:
          | Readonly<{
              readonly _attributes: {
                rule: 'Desc'
                readonly template: TemplateStringsArray
                readonly values: import('./define').DomainDesignDescValue[]
              }
            }>
          | undefined
      }
      inner: any
      policy(policy: import('./define').DomainDesignPolicy): import('./define').DomainDesignPolicy
      policy(name: string, desc?: string | import('./define').DomainDesignDesc): import('./define').DomainDesignPolicy
      system(system: import('./define').DomainDesignSystem): import('./define').DomainDesignSystem
      system(name: string, desc?: string | import('./define').DomainDesignDesc): import('./define').DomainDesignSystem
      readModel<READ_MODEL extends import('./define').DomainDesignReadModel<any>>(readModel: READ_MODEL): READ_MODEL
      readModel<
        G_NAME extends string,
        ARR extends import('./define').NonEmptyArray<import('./define').CustomInfo<G_NAME>>
      >(
        name: string,
        infos: ARR | import('./define').NonEmptyInitFunc<() => ARR>
      ): import('./define').DomainDesignReadModel<import('./define').CustomInfoArrayToInfoObject<ARR>>
      toFormat(): string
    }>[]
    getPolicies(): Readonly<{
      readonly _attributes: {
        __id: string
        rule: 'Policy'
        name: string
        description?: import('./define').DomainDesignDesc
      }
      service(service: import('./define').DomainDesignService): import('./define').DomainDesignService
      service(name: string, desc?: string | import('./define').DomainDesignDesc): import('./define').DomainDesignService
      toFormat(): string
    }>[]
    getServices(): Readonly<{
      readonly _attributes: {
        __id: string
        rule: 'Service'
        name: string
        description?: import('./define').DomainDesignDesc
      }
      command<COMMAND extends import('./define').DomainDesignCommand<any>>(command: COMMAND): COMMAND
      command<
        G_NAME extends string,
        ARR extends import('./define').NonEmptyArray<import('./define').CustomInfo<G_NAME>>
      >(
        name: string,
        infos: ARR,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignCommand<import('./define').CustomInfoArrayToInfoObject<ARR>>
      facadeCmd<FACADECMD extends import('./define').DomainDesignFacadeCommand<any>>(facadeCmd: FACADECMD): FACADECMD
      facadeCmd<
        G_NAME extends string,
        ARR extends import('./define').NonEmptyArray<import('./define').CustomInfo<G_NAME>>
      >(
        name: string,
        infos: ARR,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignFacadeCommand<import('./define').CustomInfoArrayToInfoObject<ARR>>
      agg<AGG extends import('./define').DomainDesignAgg<any>>(agg: AGG): AGG
      agg<G_NAME extends string, ARR extends import('./define').NonEmptyArray<import('./define').CustomInfo<G_NAME>>>(
        name: string,
        agg: ARR,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignAgg<import('./define').CustomInfoArrayToInfoObject<ARR>>
      toFormat(): string
    }>[]
    getSystems(): Readonly<{
      readonly _attributes: {
        __id: string
        rule: 'System'
        name: string
        description?: import('./define').DomainDesignDesc
      }
      command<COMMAND extends import('./define').DomainDesignCommand<any>>(command: COMMAND): COMMAND
      command<
        G_NAME extends string,
        ARR extends import('./define').NonEmptyArray<import('./define').CustomInfo<G_NAME>>
      >(
        name: string,
        infos: ARR,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignCommand<import('./define').CustomInfoArrayToInfoObject<ARR>>
      facadeCmd<FACADECMD extends import('./define').DomainDesignFacadeCommand<any>>(facadeCmd: FACADECMD): FACADECMD
      facadeCmd<
        G_NAME extends string,
        ARR extends import('./define').NonEmptyArray<import('./define').CustomInfo<G_NAME>>
      >(
        name: string,
        infos: ARR,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignFacadeCommand<import('./define').CustomInfoArrayToInfoObject<ARR>>
      toFormat(): string
    }>[]
    getAggs(): Readonly<{
      readonly _attributes: {
        __id: string
        rule: 'Agg'
        name: string
        infos: any
        description?:
          | Readonly<{
              readonly _attributes: {
                rule: 'Desc'
                readonly template: TemplateStringsArray
                readonly values: import('./define').DomainDesignDescValue[]
              }
            }>
          | undefined
      }
      inner: any
      event<EVENT extends import('./define').DomainDesignEvent<any>>(event: EVENT): EVENT
      event<G_NAME extends string, ARR extends import('./define').NonEmptyArray<import('./define').CustomInfo<G_NAME>>>(
        name: string,
        infos: ARR,
        desc?: string | import('./define').DomainDesignDesc
      ): import('./define').DomainDesignEvent<import('./define').CustomInfoArrayToInfoObject<ARR>>
      toFormat(): string
    }>[]
    getReadModels(): Readonly<{
      readonly _attributes: {
        __id: string
        rule: 'ReadModel'
        name: string
        infos: any
        description?:
          | Readonly<{
              readonly _attributes: {
                rule: 'Desc'
                readonly template: TemplateStringsArray
                readonly values: import('./define').DomainDesignDescValue[]
              }
            }>
          | undefined
      }
      inner: any
      toFormat(): string
    }>[]
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
