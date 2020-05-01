import { ethers } from 'ethers'

export function decodeCalls(returnData: string) {
  const [blockNumber, results] = ethers.utils.defaultAbiCoder.decode(
    ['uint256', 'bytes[]'],
    returnData
  );
  return [blockNumber, results]
}