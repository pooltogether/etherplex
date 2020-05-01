import { Call } from './Call'
import { encodeCalls } from './encodeCalls'
import { decodeCalls } from './decodeCalls'
import { BaseProvider } from 'ethers/providers'
import { Context } from './MulticallContract'

const debug = require('debug')('etherplex:MulticallExecutor')

export const MULTICALL_ADDRESS_MAINNET = "0xeefba1e63905ef1d7acba5a8513c70307c1ce441"
export const MULTICALL_ADDRESS_KOVAN = "0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a"
export const MULTICALL_ADDRESS_RINKEBY = "0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821"
export const MULTICALL_ADDRESS_GOERLI = "0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e"
export const AGGREGATE_SELECTOR = '0x252dba42';

export class MulticallExecutor {

  constructor(
    private readonly provider: BaseProvider
  ) {}

  async executeCallers(...contexts: Context[]) {
    let result = {}

    let calls: Array<Call> = []

    contexts.forEach((caller) => {
      result[caller.contract.name] = {}
      calls = calls.concat(caller.flush())
    })

    debug(`Found ${calls.length} calls...`)

    const [blockNumber, returnValues] = await this.executeCalls(calls)

    debug(`Got return values: ${returnValues}`)

    for (let i = 0; i < returnValues.length; i++) {
      let call = calls[i]
      let decoded = call.fd.decode(returnValues[i])
      
      result[call.caller.name][call.fd.name] = decoded
      result[call.caller.name][call.fd.signature] = decoded
    }

    return result
  }

  async executeCalls(calls: Call[]) {
    if (await this.networkSupportsMulticall()) {
      debug(`Multicall is supported`)
      const data = encodeCalls(calls)
      debug(`Encoded data: ${data}`)
      debug(calls)
      const result = await this.executeMulticallData(data)
      return decodeCalls(result)
    } else {
      const values = await Promise.all(calls.map(async (call) => (
        await this.provider.call({ to: call.to, data: call.data })
      )))
      return [null, values]
    }
  }

  async executeMulticallData(data: string) {
    const address = await this.multicallAddressOrThrow()

    const callData = AGGREGATE_SELECTOR + data.substr(2)

    const tx = {
      to: address,
      data: callData
    }

    const result = await this.provider.call(tx)

    return result
  }

  async multicallAddressOrThrow() {
    const network = await this.provider.getNetwork()
    const address = this.multicallAddress(network.chainId)
    if (address === null) {
      const msg = `multicall is not available on the network ${network.chainId}`
      console.error(msg)
      throw new Error(msg)
    }
    return address
  }

  async networkSupportsMulticall() {
    const network = await this.provider.getNetwork()
    const address = this.multicallAddress(network.chainId)
    return address !== null
  }

  multicallAddress(chainId: number) {
    switch (chainId) {
      case 1:
        return MULTICALL_ADDRESS_MAINNET
      case 42:
        return MULTICALL_ADDRESS_KOVAN
      case 4:
        return MULTICALL_ADDRESS_RINKEBY
      case 5:
        return MULTICALL_ADDRESS_GOERLI
      default:
        return null
    }
  }
}
