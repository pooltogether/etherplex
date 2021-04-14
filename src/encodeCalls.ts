import { ethers } from 'ethers'
import { ParamType } from '@ethersproject/abi'
import { Call } from './Call'

export function encodeCalls(calls: Array<Call>): string {
  return ethers.utils.defaultAbiCoder.encode(
    [
      ParamType.fromObject({
        components: [
          { name: 'target', type: 'address' },
          { name: 'callData', type: 'bytes' }
        ],
        name: 'data',
        type: 'tuple[]'
      })
    ],
    [calls.map((call) => [call.to, call.data])]
  )
}
