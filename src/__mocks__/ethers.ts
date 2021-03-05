const ethersOriginal = jest.requireActual('ethers')

export const ethers = {
  utils: {
    Interface: ethersOriginal.utils.Interface,
    defaultAbiCoder: ethersOriginal.utils.defaultAbiCoder,
    getAddress: ethersOriginal.utils.getAddress,
    hexlify: ethersOriginal.utils.hexlify,
    getDefaultProvider: () => jest.fn()
  },
  Contract: ethersOriginal.Contract,
  BigNumber: ethersOriginal.BigNumber.from,
  providers: ethersOriginal.providers
}
