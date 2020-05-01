import { Arrayish, FunctionDescription } from 'ethers/utils'
import { MulticallContract } from './MulticallContract';

export class Call {
  constructor(
    public readonly caller: MulticallContract,
    public readonly fd: FunctionDescription,
    public readonly to: string,
    public readonly data: Arrayish,
    public readonly resolve: Function,
    public readonly reject: Function
  ) {}
}
