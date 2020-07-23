import { MulticallContract } from '../MulticallContract'
import ERC20Abi from '../__mocks__/ERC20Abi'
import PrizeStrategyAbi from '../__mocks__/PrizeStrategyAbi'

const ADDRESS = '0xb197f346ec436e1fa89ed8b4ce58696364ab232c'

describe('MulticallContract', () => {
  it('should create functions on construction', () => {
    let contract = new MulticallContract('ERC20', ERC20Abi, '0x1234')
    // @ts-ignore    
    expect(contract.balanceOf).toBeDefined()
    // @ts-ignore    
    expect(contract.totalSupply).toBeDefined()
    // @ts-ignore    
    expect(contract.totalSupply).toBeDefined()
  })

  it('should support non-constant functions as well', () => {
    const prizeStrategyContract = new MulticallContract('PrizeStrategy', PrizeStrategyAbi, '0x1234')
    // @ts-ignore    
    expect(prizeStrategyContract.estimatePrize).toBeDefined()
  })
  
  it('should encode for the callbacks', () => {
    let contract = new MulticallContract('ERC20', ERC20Abi, '0x1234')

    // @ts-ignore
    let context = contract.balanceOf(ADDRESS)

    expect(context.calls.length).toEqual(1)

    let firstCall = context.calls[0]

    expect(firstCall.data).toEqual('0x70a08231000000000000000000000000b197f346ec436e1fa89ed8b4ce58696364ab232c')
    expect(firstCall.to).toEqual('0x1234')
  })

  it('should flush when needed', () => {
    let contract = new MulticallContract('ERC20', ERC20Abi, '0x1234')
    // @ts-ignore
    let context = contract.balanceOf(ADDRESS)
    context.flush()
    expect(context.calls.length).toEqual(0)
  })
})