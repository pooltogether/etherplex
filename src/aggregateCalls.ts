import { Call } from './Call'
import { Context } from './MulticallContract'

const debug = require('debug')('etherplex:PayloadAggregator')

export const aggregateCalls = (...contexts: Context[]): [{}, Call[]] => {
  let result = {}

  let calls: Array<Call> = []

  contexts.forEach((caller) => {
    result[caller.contract.__name] = {}
    calls = calls.concat(caller.flush())
  })

  debug(`Result ${result}...`)
  debug(`Found ${calls.length} calls...`)

  return [result, calls]
}
