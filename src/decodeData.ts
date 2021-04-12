import { decodeCalls } from './decodeCalls'
import { decodeFunctionResults } from './decodeFunctionResults'

export function decodeData(result, calls, callResponse) {
  const [blockNumber, returnValues] = decodeCalls(callResponse)

  const decodedData = decodeFunctionResults(result, calls, returnValues)

  return decodedData
}
