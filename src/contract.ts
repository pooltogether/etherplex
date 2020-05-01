import { MulticallContract } from "./MulticallContract";

export function contract(name: string, abi: Array<any>, address: string) {
  return new MulticallContract(name, abi, address)
}