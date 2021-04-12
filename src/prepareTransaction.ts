import { multicallAddressOrThrow } from './multicallAddresses'

export const AGGREGATE_SELECTOR = '0x252dba42'

export async function prepareTransaction(chainId: number, data: string) {
  const address = await multicallAddressOrThrow(chainId)

  const callData = AGGREGATE_SELECTOR + data.substr(2)

  return {
    to: address,
    data: callData
  }
}
