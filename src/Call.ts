import { BytesLike } from 'ethers'
import { FunctionFragment } from '@ethersproject/abi'
import { MulticallContract } from './MulticallContract'

export class Call {
  constructor(
    public readonly caller: MulticallContract,
    public readonly fd: FunctionFragment,
    public readonly to: string,
    public readonly data: BytesLike,
    public readonly resolve: Function,
    public readonly reject: Function
  ) {}
}
