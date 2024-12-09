import { genId, useInternalContext } from './common'
import {
  CustomInfoArrayToInfoObject,
  DomainDesignDesc,
  DomainDesignInfo,
  DomainDesignInfoType,
  DomainDesignReadModel,
  DomainDesignReadModelProvider,
  NonEmptyArray,
  NonEmptyInitFunc,
} from './define'

export function createReadModelProvider(designId: string): DomainDesignReadModelProvider {
  return <G_NAME extends string, ARR extends NonEmptyArray<DomainDesignInfo<DomainDesignInfoType, G_NAME> | G_NAME>>(
    name: string,
    infosInitializer: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ) => {
    const context = useInternalContext(designId)
    const __code = genId()
    const infos = context.customInfoArrToInfoObj(
      infosInitializer instanceof Function ? infosInitializer() : infosInitializer
    )
    const readModel: DomainDesignReadModel<CustomInfoArrayToInfoObject<ARR>> = {
      _attributes: {
        __code,
        rule: 'ReadModel',
        name,
        infos,
        description: context.createDesc(desc as any),
      },
      inner: infos,
    }
    context.registerReadModel(readModel)
    return readModel
  }
}
