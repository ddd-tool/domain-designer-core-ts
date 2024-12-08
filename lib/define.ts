// ========================== 描述 ==========================
export interface DomainDesignDescProvider {
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
  | DomainDesignInfo<any>
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
  field: DomainDesignInfoFieldProvider
  doc: (name: string, desc?: string | DomainDesignDesc) => DomainDesignInfo<'Document'>
  func: (
    name: string,
    dependsOn: DomainDesignInfoFuncDependsOn,
    desc?: string | DomainDesignDesc
  ) => DomainDesignInfo<'Function'>
}
export type DomainDesignInfoType = 'Field' | 'Document' | 'Function'
export type DomainDesignInfoSubtype<TYPE extends DomainDesignInfoType> = TYPE extends 'Field'
  ? 'Id' | 'Time' | 'Enum' | 'Unknown' | 'Number' | 'String' | 'Boolean'
  : TYPE extends 'Document'
  ? 'None'
  : TYPE extends 'Function'
  ? DomainDesignInfoFuncDependsOn
  : never
export type DomainDesignInfo<TYPE extends DomainDesignInfoType> = Readonly<{
  _attributes: {
    __code: string
    rule: 'Info'
    type: TYPE
    subtype: DomainDesignInfoSubtype<TYPE>
    name: string
    description?: DomainDesignDesc
  }
}>
export type DomainDesignInfoFuncDependsOn = NonEmptyArray<DomainDesignInfo<Exclude<DomainDesignInfoType, 'Function'>>>
export type DomainDesignInfos = NonEmptyObject<Record<string, DomainDesignInfo<DomainDesignInfoType>>>
export interface DomainDesignInfoFieldProvider {
  (name: string, desc?: string | DomainDesignDesc): DomainDesignInfo<'Field'>
  id(name: string, desc?: string | DomainDesignDesc): DomainDesignInfo<'Field'>
  time(name: string, desc?: string | DomainDesignDesc): DomainDesignInfo<'Field'>
  enum(name: string, desc?: string | DomainDesignDesc): DomainDesignInfo<'Field'>
  num(name: string, desc?: string | DomainDesignDesc): DomainDesignInfo<'Field'>
  str(name: string, desc?: string | DomainDesignDesc): DomainDesignInfo<'Field'>
  bool(name: string, desc?: string | DomainDesignDesc): DomainDesignInfo<'Field'>
}

// ========================== 参与者 ==========================
export type DomainDesignActorProvider = (name: string, desc?: string | DomainDesignDesc) => DomainDesignActor
export type DomainDesignActor = Readonly<{
  readonly _attributes: {
    __code: string
    rule: 'Actor'
    name: string
    description?: DomainDesignDesc
  }
  command<COMMAND extends DomainDesignCommand<any>>(command: COMMAND): COMMAND
  command<INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS>,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<INFOS>
  facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(command: FACADECMD): FACADECMD
  facadeCmd<INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS>,
    desc?: string | DomainDesignDesc
  ): DomainDesignFacadeCommand<INFOS>
  readModel<READ_MODEL extends DomainDesignReadModel<any>>(readModel: READ_MODEL): READ_MODEL
  readModel<INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS> | NonEmptyInitFunc<() => INFOS>
  ): DomainDesignReadModel<INFOS>
}>

// ========================== 指令 ==========================
export type DomainDesignCommandProvider = <INFOS extends DomainDesignInfos>(
  name: string,
  infos: NonEmptyObject<INFOS>,
  desc?: string | DomainDesignDesc
) => DomainDesignCommand<INFOS>
export type DomainDesignCommand<INFOS extends DomainDesignInfos> = Readonly<{
  readonly _attributes: {
    __code: string
    rule: 'Command'
    name: string
    infos: INFOS
    description?: DomainDesignDesc
  }
  inner: INFOS
  agg<AGG extends DomainDesignAgg<any>>(agg: AGG): AGG
}>

export type DomainDesignFacadeCommandProvider = <INFOS extends DomainDesignInfos>(
  name: string,
  infos: NonEmptyObject<INFOS>,
  desc?: string | DomainDesignDesc
) => DomainDesignFacadeCommand<INFOS>
export type DomainDesignFacadeCommand<INFOS extends DomainDesignInfos> = Readonly<{
  readonly _attributes: {
    __code: string
    rule: 'FacadeCommand'
    name: string
    infos: INFOS
    description?: DomainDesignDesc
  }
  inner: INFOS
  agg<AGG extends DomainDesignAgg<any>>(agg: AGG): AGG
  service(service: DomainDesignService): DomainDesignService
  service(name: string, desc?: string | DomainDesignDesc): DomainDesignService
}>

// ========================== 事件 ==========================
export type DomainDesignEventProvider = <INFOS extends DomainDesignInfos>(
  name: string,
  infos: NonEmptyObject<INFOS>,
  desc?: string | DomainDesignDesc
) => DomainDesignEvent<INFOS>
export type DomainDesignEvent<INFOS extends DomainDesignInfos> = Readonly<{
  readonly _attributes: {
    __code: string
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
  readModel<INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS> | NonEmptyInitFunc<() => INFOS>
  ): DomainDesignReadModel<INFOS>
}>

// ========================== 聚合 ==========================
export type DomainDesignAggProvider = <INFOS extends DomainDesignInfos>(
  name: string,
  infos: NonEmptyObject<INFOS> | NonEmptyInitFunc<() => INFOS>,
  desc?: string | DomainDesignDesc
) => DomainDesignAgg<INFOS>
export type DomainDesignAgg<INFOS extends DomainDesignInfos> = Readonly<{
  readonly _attributes: {
    __code: string
    rule: 'Agg'
    name: string
    infos: INFOS
    description?: DomainDesignDesc
  }
  inner: INFOS
  event<EVENT extends DomainDesignEvent<any>>(event: EVENT): EVENT
  event<INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS>,
    desc?: string | DomainDesignDesc
  ): DomainDesignEvent<INFOS>
}>

// ========================== 策略 ==========================
export type DomainDesignPolicyProvider = (name: string, desc?: string | DomainDesignDesc) => DomainDesignPolicy
export type DomainDesignPolicy = Readonly<{
  readonly _attributes: {
    __code: string
    rule: 'Policy'
    name: string
    description?: DomainDesignDesc
  }
  service(service: DomainDesignService): DomainDesignService
  service(name: string, desc?: string | DomainDesignDesc): DomainDesignService
}>

// ========================== 外部系统 ==========================
export type DomainDesignSystemProvider = (name: string, desc?: string | DomainDesignDesc) => DomainDesignSystem
export type DomainDesignSystem = Readonly<{
  readonly _attributes: {
    __code: string
    rule: 'System'
    name: string
    description?: DomainDesignDesc
  }
  command<COMMAND extends DomainDesignCommand<any>>(command: COMMAND): COMMAND
  command<INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS>,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<INFOS>
  facadeCmd<FACADECMD extends DomainDesignFacadeCommand<any>>(facadeCmd: FACADECMD): FACADECMD
  facadeCmd<INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS>,
    desc?: string | DomainDesignDesc
  ): DomainDesignFacadeCommand<INFOS>
}>

// ========================== 服务 ==========================
export type DomainDesignServiceProvider = (name: string, desc?: string | DomainDesignDesc) => DomainDesignService
export type DomainDesignService = Readonly<{
  readonly _attributes: {
    __code: string
    rule: 'Service'
    name: string
    description?: DomainDesignDesc
  }
  command<COMMAND extends DomainDesignCommand<any>>(command: COMMAND): COMMAND
  command<INFOS extends DomainDesignInfos>(
    name: string,
    infos: NonEmptyObject<INFOS>,
    desc?: string | DomainDesignDesc
  ): DomainDesignCommand<INFOS>
  agg<AGG extends DomainDesignAgg<any>>(agg: AGG): AGG
}>

// ========================== 读模型 ==========================
export type DomainDesignReadModelProvider = <INFOS extends DomainDesignInfos>(
  name: string,
  infos: NonEmptyObject<INFOS> | NonEmptyInitFunc<() => INFOS>,
  desc?: string | DomainDesignDesc
) => DomainDesignReadModel<INFOS>
export type DomainDesignReadModel<INFOS extends DomainDesignInfos> = Readonly<{
  readonly _attributes: {
    __code: string
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
