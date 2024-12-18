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
    dependsOn: NonEmptyArray<DomainDesignInfoFuncDependsOn | string>,
    desc?: string | DomainDesignDesc
  ): DomainDesignInfo<'Function', NAME>
  id<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Id', NAME>
  valueObj<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'ValueObject', NAME>
  valueObj<NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, string> | string>>(
    name: NAME,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignInfo<'ValueObject', NAME>
  version<NAME extends string>(name: NAME, desc?: string | DomainDesignDesc): DomainDesignInfo<'Version', NAME>
}
export type DomainDesignInfoType = 'Document' | 'Function' | 'Id' | 'ValueObject' | 'Version'
export type DomainDesignInfoSubtype<TYPE extends DomainDesignInfoType> = TYPE extends 'Document' | 'Id' | 'Version'
  ? 'None'
  : TYPE extends 'Function'
  ? DomainDesignInfoFuncDependsOn[]
  : TYPE extends 'ValueObject'
  ? DomainDesignInfo<DomainDesignInfoType, string>[]
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
}>
export type DomainDesignInfoFuncDependsOn = DomainDesignInfo<Exclude<DomainDesignInfoType, 'Function'>, string>

export type DomainDesignInfoObject = NonEmptyObject<Record<string, DomainDesignInfo<DomainDesignInfoType, string>>>
export type CustomInfoArrayToInfoObject<ARR extends Array<DomainDesignInfo<any, any> | string>> = {
  [K in ARR[number] as K extends DomainDesignInfo<any, infer U>
    ? U
    : K extends string
    ? K
    : never]: K extends DomainDesignInfo<any, any> ? K : K extends string ? DomainDesignInfo<'ValueObject', K> : never
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
}>

// ========================== 指令 ==========================
export type DomainDesignCommandProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
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
  agg<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    agg: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
}>

export type DomainDesignFacadeCommandProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
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
  agg<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    agg: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
  service(service: DomainDesignService): DomainDesignService
  service(name: string, desc?: string | DomainDesignDesc): DomainDesignService
}>

// ========================== 事件 ==========================
export type DomainDesignEventProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
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
  readModel<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infos: ARR | NonEmptyInitFunc<() => ARR>
  ): DomainDesignReadModel<CustomInfoArrayToInfoObject<ARR>>
}>

// ========================== 聚合 ==========================
export type DomainDesignAggProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
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
  event<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignEvent<CustomInfoArrayToInfoObject<ARR>>
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
  command<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
  facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(facadeCmd: FACADECMD): FACADECMD
  facadeCmd<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>>
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
  command<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<CustomInfoArrayToInfoObject<ARR>>
  facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(facadeCmd: FACADECMD): FACADECMD
  facadeCmd<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infos: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignFacadeCommand<CustomInfoArrayToInfoObject<ARR>>
  agg<AGG extends DomainDesignAgg<any>>(agg: AGG): AGG
  agg<G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    agg: ARR,
    desc?: string | DomainDesignDesc
  ): DomainDesignAgg<CustomInfoArrayToInfoObject<ARR>>
}>

// ========================== 读模型 ==========================
export type DomainDesignReadModelProvider = {
  <G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
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
}>

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
