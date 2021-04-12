export const MULTICALL_ADDRESSES = {
  1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441', // MULTICALL_ADDRESS_MAINNET
  4: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821', // MULTICALL_ADDRESS_RINKEBY
  5: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e', // MULTICALL_ADDRESS_GOERLI
  42: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a', // MULTICALL_ADDRESS_KOVAN
  56: '0xbEDe4875F56aaAB7a6aBbF9E423e0ba9E0a90b2A', // MULTICALL_ADDRESS_BSC
  100: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a', // MULTICALL_ADDRESS_XDAI
  137: '0x95028E5B8a734bb7E2071F96De89BABe75be9C8E', // MULTICALL_ADDRESS_MATIC
  80001: '0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc' // MULTICALL_ADDRESS_MUMBAI
}

export async function multicallAddressOrThrow(chainId) {
  const address = MULTICALL_ADDRESSES[chainId]
  if (address === undefined) {
    const msg = `multicall is not available on the network ${chainId}`
    console.error(msg)
    throw new Error(msg)
  }
  return address
}

export async function networkSupportsMulticall(chainId) {
  const address = MULTICALL_ADDRESSES[chainId]
  return address !== undefined
}
