import { aggregateCalls } from './aggregateCalls'
import { encodeCalls } from './encodeCalls'
import { Context } from './MulticallContract'

export function encodeData(...contexts: Context[]) {
  const [result, calls] = aggregateCalls(...contexts)
  const data = encodeCalls(calls)

  return [result, calls, data]
}
