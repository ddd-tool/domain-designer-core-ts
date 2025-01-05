import {
  type DomainDesignAgg,
  type DomainDesignCommand,
  type DomainDesigner,
  type DomainDesignEvent,
  type DomainDesignFacadeCommand,
  type DomainDesignInfoRecord,
  type DomainDesignReadModel,
  type Warning,
  isDomainDesignAgg,
  isDomainDesignCommand,
  isDomainDesignEvent,
  isDomainDesignFacadeCommand,
  isDomainDesignReadModel,
} from './define'

let wasmApi: {
  matchTable: (sources: string[], targets: string[], threshold?: number) => any
}
async function loadWasm() {
  if (!wasmApi) {
    const match_table = (await import('./wasm')).match_table
    wasmApi = {
      matchTable: match_table,
    }
  }
  return wasmApi
}

export async function checkDomainDesigner(d: DomainDesigner): Promise<Record<string, Warning[]>> {
  const context = d._getContext()
  const result: Record<string, Warning[]> = {}
  for (const story of Object.keys(context.getUserStories())) {
    Object.assign(result, await checkStory(d, story, result))
  }
  return result
}

export async function checkStory(
  d: DomainDesigner,
  story: string,
  r?: Record<string, Warning[]>
): Promise<Record<string, Warning[]>> {
  const context = d._getContext()
  const workflows = context.getUserStories()[story]
  if (!workflows) {
    return {}
  }
  const result: Record<string, Warning[]> = r || {}
  for (const workflow of workflows) {
    return Object.assign(result, await checkWorkflow(d, workflow, result))
  }
  return result
}

export async function checkWorkflow(
  d: DomainDesigner,
  workflow: string,
  r?: Record<string, Warning[]>
): Promise<Record<string, Warning[]>> {
  const context = d._getContext()
  const result: Record<string, Warning[]> = r || {}
  let srcId = ''
  let i = 0
  for (const dstId of Object.values(context.getWorkflows()[workflow])) {
    if (i === 0) {
      srcId = dstId
      i++
      continue
    }
    const src = context.getIdMap()[srcId]
    const dst = context.getIdMap()[dstId]
    if (!isTable(src) || !isTable(dst)) {
      srcId = dstId
      continue
    } else if (result[`${srcId},${dstId}`] !== undefined) {
      srcId = dstId
      continue
    }
    const srcIds = Object.values(src.inner).map((v) => v._attributes.__id)
    const dstIds = Object.values(dst.inner).map((v) => v._attributes.__id)
    const symmetricDifference = [
      ...srcIds.filter((item) => !dstIds.includes(item)),
      ...dstIds.filter((item) => !srcIds.includes(item)),
    ]

    const problems = (await loadWasm()).matchTable(
      Object.values(src.inner)
        .filter((v) => symmetricDifference.includes(v._attributes.__id))
        .map((v) => v._attributes.name),
      Object.values(dst.inner)
        .filter((v) => symmetricDifference.includes(v._attributes.__id))
        .map((v) => v._attributes.name),
      0.5
    )
    const p: Warning[] = []
    for (const match of problems.matches) {
      p.push({
        _attributes: {
          rule: 'CheckResult',
        },
        type: 'warning',
        message: `<${src._attributes.name}>中的\`${match.source}\`与<${dst._attributes.name}>中的\`${
          match.target
        }\`相似度过高，建议检查是否有误（相似度 ${match.score * 100}%）`,
      })
    }
    result[`${srcId},${dstId}`] = p
    srcId = dstId
    i++
  }
  return result
}

function isTable(
  node: object
): node is
  | DomainDesignCommand<DomainDesignInfoRecord>
  | DomainDesignFacadeCommand<DomainDesignInfoRecord>
  | DomainDesignEvent<DomainDesignInfoRecord>
  | DomainDesignAgg<DomainDesignInfoRecord>
  | DomainDesignReadModel<DomainDesignInfoRecord> {
  return (
    isDomainDesignCommand(node) ||
    isDomainDesignEvent(node) ||
    isDomainDesignAgg(node) ||
    isDomainDesignReadModel(node) ||
    isDomainDesignFacadeCommand(node)
  )
}
