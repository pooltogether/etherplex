import { ethers, BytesLike } from 'ethers'
import { FunctionFragment, Interface } from '@ethersproject/abi'
import { Call } from './Call'

export class Context {
  public calls = new Array<Call>()

  constructor(public contract: MulticallContract) {}

  call(to: string, fd: FunctionFragment, data: BytesLike) {
    let resolveCb: Function
    let rejectCb: Function

    const promise = new Promise((resolve, reject) => {
      resolveCb = resolve
      rejectCb = reject
    })

    const call = new Call(this.contract, fd, to, data, resolveCb, rejectCb)

    this.calls.push(call)

    return promise
  }

  flush() {
    let oldCalls = this.calls
    this.calls = new Array<Call>()
    return oldCalls
  }
}

export class MulticallContract {
  public __interface: Interface
  public __functionContext: Function

  constructor(public readonly __name: string, abi: Array<any>, private readonly __address: string) {
    this.__interface = new ethers.utils.Interface(abi)

    this.__functionContext = class FunctionContext extends Context {}

    Object.keys(this.__interface.functions).forEach((functionName) => {
      let fd = this.__interface.functions[functionName]

      if (/function/i.test(fd.type)) {
        this.addFunction(fd)
        this.addPrototypeFunction(fd)
      }
    })
  }

  addFunction(fd: FunctionFragment) {
    let that = this
    let callback = (...params) => {
      // create a new context and return it
      // @ts-ignore
      let context = new this.__functionContext(that)
      return context[fd.name](...params)
    }

    this[fd.name] = callback
    this[fd.format()] = callback
  }

  addPrototypeFunction(fd: FunctionFragment) {
    let that = this
    let callback = function (...params) {
      let data = that.__interface.encodeFunctionData(fd, params)
      this.call(this.contract.__address, fd, data)
      return this
    }

    this.__functionContext.prototype[fd.name] = callback
    this.__functionContext.prototype[fd.format()] = callback
  }
}
