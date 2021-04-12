import { MulticallContract } from './MulticallContract'
import { Contract } from 'ethers'

type AbiOrContract = Array<any> | Contract

export function contract(name: string, abiOrContract: AbiOrContract, address?: string) {
  let result
  if (address) {
    result = new MulticallContract(name, <Array<any>>abiOrContract, address)
  } else {
    let abi = (<Contract>abiOrContract).abi
    address = (<Contract>abiOrContract).address
    result = new MulticallContract(name, abi, address)
  }
  return result
}
