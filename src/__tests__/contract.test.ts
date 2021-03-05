import { contract } from '../contract'
import ERC20Abi from '../__mocks__/ERC20Abi'

describe('contract', () => {
  let address = '0x7d6dabd6b5c75291a3258c29b418f5805792a875'

  it('should take a contract', () => {
    let c = { address, abi: ERC20Abi }

    // @ts-ignore
    let mc = contract('TestContract', c)

    // Note: Ethers formats the ABI slightly differently
    // Ex. outputs: [{ name: "", type: "bool" }] will result in outputs: [{ type: "bool" }]
    expect(JSON.parse(mc.__interface.format('json')).length).toEqual(ERC20Abi.length)
    expect(mc.__address).toEqual(address)
  })

  it('should take explicit args', () => {
    // @ts-ignore
    let mc = contract('TestContract', ERC20Abi, address)
    
    // Note: Ethers formats the ABI slightly differently
    // Ex. outputs: [{ name: "", type: "bool" }] will result in outputs: [{ type: "bool" }]
    expect(JSON.parse(mc.__interface.format('json')).length).toEqual(ERC20Abi.length)
    expect(mc.__address).toEqual(address)
  })
})