import { BaseProvider } from '@ethersproject/providers'
import { Call } from './Call'
import { Context } from './MulticallContract'
import { aggregateCalls } from './aggregateCalls'
import { decodeCalls } from './decodeCalls'
import { decodeFunctionResults } from './decodeFunctionResults'
import { encodeCalls } from './encodeCalls'
import { prepareTransaction } from './prepareTransaction'
import { networkSupportsMulticall } from './multicallAddresses'

const debug = require('debug')('etherplex:MulticallExecutor')

export class MulticallExecutor {
  constructor(private readonly provider: BaseProvider) {}

  async executeCallers(...contexts: Context[]) {
    const [result, calls] = aggregateCalls(...contexts)

    const [blockNumber, returnValues] = await this.executeCalls(calls)

    const decoded = decodeFunctionResults(result, calls, returnValues)

    return decoded
  }

  async executeCalls(calls: Call[]) {
    if (await this.multicallSupported()) {
      debug(`Multicall is supported`)
      const data = encodeCalls(calls)
      debug(`Encoded data: ${data}`)
      debug(calls)
      const result = await this.executeMulticallData(data)
      return decodeCalls(result)
    } else {
      const values = await Promise.all(
        calls.map(async (call) => await this.provider.call({ to: call.to, data: call.data }))
      )
      return [null, values]
    }
  }

  async multicallSupported() {
    const network = await this.provider.getNetwork()
    return await networkSupportsMulticall(network.chainId)
  }

  async executeMulticallData(data: string) {
    const network = await this.provider.getNetwork()
    const tx = await prepareTransaction(network.chainId, data)
    const result = await this.provider.call(tx)

    return result
  }

  async executeRegularCalls(calls: Call[]) {
    const values = await Promise.all(
      calls.map(async (call) => await this.provider.call({ to: call.to, data: call.data }))
    )
    return values
  }
}
