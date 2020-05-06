import { contract } from '../contract'
import { ethers } from 'ethers'
import ERC20Abi from '../__mocks__/ERC20Abi'

describe('contract', () => {
  let address = '0x7d6dabd6b5c75291a3258c29b418f5805792a875'

  it('should take a contract', () => {
    let c = { address, abi: ERC20Abi }

    // @ts-ignore
    let mc = contract('TestContract', c)

    expect(mc.__interface.abi).toEqual(ERC20Abi)
    expect(mc.__address).toEqual(address)
  })

  it('should take explicit args', () => {
    // @ts-ignore
    let mc = contract('TestContract', ERC20Abi, address)

    expect(mc.__interface.abi).toEqual(ERC20Abi)
    expect(mc.__address).toEqual(address)
  })
})