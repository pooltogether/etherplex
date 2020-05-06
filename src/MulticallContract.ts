import { ethers } from 'ethers'
import { FunctionDescription, Arrayish, Interface } from 'ethers/utils'
import { Call } from './Call'

export class Context {
  public calls = new Array<Call>()

  constructor (
    public contract: MulticallContract
  ) {}

  call (to: string, fd: FunctionDescription, data: Arrayish) {
    let resolveCb: Function
    let rejectCb: Function
    
    const promise = new Promise((resolve, reject) => {
      resolveCb = resolve
      rejectCb = reject
    })
    
    const call = new Call(
      this.contract,
      fd,
      to,
      data,
      resolveCb,
      rejectCb
    )

    this.calls.push(call)

    return promise
  }

  flush() {
    let oldCalls = this.calls
    this.calls = new Array<Call>();
    return oldCalls
  }
}

export class MulticallContract {
  public __interface: Interface
  public __functionContext: Function

  constructor (
    public readonly __name: string,
    abi: Array<any>,
    private readonly __address: string
  ) {
    this.__interface = new ethers.utils.Interface(abi)

    this.__functionContext = class FunctionContext extends Context {}

    Object.keys(this.__interface.functions).forEach(functionName => {
      let fd = this.__interface.functions[functionName]
      if (fd.type === 'call') {
        this.addFunction(fd)
        this.addPrototypeFunction(fd)
      }
    })
  }

  addFunction (fd: FunctionDescription) {
    let that = this
    let callback = (...params) => {
      // create a new context and return it
      // @ts-ignore
      let context = new this.__functionContext(that)
      return context[fd.name](...params)
    }

    this[fd.name] = callback
    this[fd.signature] = callback
  }

  addPrototypeFunction(fd) {
    let callback = function (...params) {
      let data = fd.encode(params)
      this.call(this.contract.__address, fd, data)
      return this
    }

    this.__functionContext.prototype[fd.name] = callback
    this.__functionContext.prototype[fd.signature] = callback
  }
}
