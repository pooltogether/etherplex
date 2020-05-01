const ethersOriginal = jest.requireActual('ethers')

export const ethers = {
  utils: {
    Interface: ethersOriginal.utils.Interface,
    bigNumberify: ethersOriginal.utils.bigNumberify,
    defaultAbiCoder: ethersOriginal.utils.defaultAbiCoder,
    getAddress: ethersOriginal.utils.getAddress,
    hexlify: ethersOriginal.utils.hexlify,
    getDefaultProvider: () => jest.fn()
  },
  Contract: jest.fn()
}