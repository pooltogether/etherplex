const ethersOriginal = jest.requireActual('ethers')

export const ethers = {
  utils: {
    Interface: ethersOriginal.utils.Interface,
    BigNumber: ethersOriginal.BigNumber,
    defaultAbiCoder: ethersOriginal.utils.defaultAbiCoder,
    getAddress: ethersOriginal.utils.getAddress,
    hexlify: ethersOriginal.utils.hexlify,
    getDefaultProvider: () => jest.fn()
  },
  Contract: ethersOriginal.Contract,
  providers: ethersOriginal.providers
}