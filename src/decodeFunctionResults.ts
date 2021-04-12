export function decodeFunctionResults(result, calls, returnValues) {
  for (let i = 0; i < returnValues.length; i++) {
    let call = calls[i]
    let decoded = call.caller.__interface.decodeFunctionResult(call.fd, returnValues[i])

    result[call.caller.__name][call.fd.name] = decoded
    result[call.caller.__name][call.fd.format()] = decoded
  }
  return result
}
