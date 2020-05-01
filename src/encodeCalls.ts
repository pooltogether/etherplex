import { ethers } from 'ethers'
import { Call } from './Call'

export function encodeCalls(calls: Array<Call>): string {
  return ethers.utils.defaultAbiCoder.encode(
    [
      {
        components: [{ type: 'address' }, { type: 'bytes' }],
        name: 'data',
        type: 'tuple[]'
      }
    ],
    [
      calls.map(call => [
        call.to,
        call.data
      ])
    ]
  );  
}