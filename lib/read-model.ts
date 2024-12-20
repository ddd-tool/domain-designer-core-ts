import { genId, useInternalContext } from './common'
import {
  CustomInfo,
  CustomInfoArrayToInfoObject,
  DomainDesignDesc,
  DomainDesignReadModel,
  DomainDesignReadModelProvider,
  NonEmptyArray,
  NonEmptyInitFunc,
} from './define'

export function createReadModelProvider(designId: string): DomainDesignReadModelProvider {
  return <G_NAME extends string, ARR extends NonEmptyArray<CustomInfo<G_NAME>>>(
    name: string,
    infosInitializer: ARR | NonEmptyInitFunc<() => ARR>,
    desc?: string | DomainDesignDesc
  ) => {
    const context = useInternalContext(designId)
    const __id = genId()
    const infos = context.customInfoArrToInfoObj(
      infosInitializer instanceof Function ? infosInitializer() : infosInitializer
    )
    const readModel: DomainDesignReadModel<CustomInfoArrayToInfoObject<ARR>> = {
      _attributes: {
        __id,
        rule: 'ReadModel',
        name,
        infos,
        description: context.createDesc(desc as any),
      },
      inner: infos,
      toFormat() {
        return context.toFormat(this)
      },
    }
    context.registerReadModel(readModel)
    return readModel
  }
}
