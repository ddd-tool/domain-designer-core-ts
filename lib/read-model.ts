import { genId, useInternalContext } from './common'
import {
  DomainDesignDesc,
  DomainDesignInfos,
  DomainDesignReadModel,
  DomainDesignReadModelProvider,
  NonEmptyInitFunc,
  NonEmptyObject,
} from './define'

export function createReadModelProvider(designId: string): DomainDesignReadModelProvider {
  return <INFOS extends DomainDesignInfos>(
    name: string,
    infosInitializer: NonEmptyObject<INFOS> | NonEmptyInitFunc<() => INFOS>,
    desc?: string | DomainDesignDesc
  ) => {
    const context = useInternalContext(designId)
    const __code = genId()
    const infos = infosInitializer instanceof Function ? infosInitializer() : infosInitializer
    const readModel: DomainDesignReadModel<INFOS> = {
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
