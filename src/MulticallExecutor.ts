import { BaseProvider } from "@ethersproject/providers";
import { Call } from "./Call";
import { Context } from "./MulticallContract";
import { aggregateCalls } from "./aggregateCalls";
import { decodeCalls } from "./decodeCalls";
import { encodeCalls } from "../encodeCalls";
import {
  networkSupportsMulticall,
  multicallAddressOrThrow,
} from "./multicallAddresses";

const debug = require("debug")("etherplex:MulticallExecutor");

export const AGGREGATE_SELECTOR = "0x252dba42";

export class MulticallExecutor {
  constructor(private readonly provider: BaseProvider) {}

  async executeCallers(...contexts: Context[]) {
    const [result, calls] = aggregateCalls(...contexts);
    debug(`Got result: ${result}`);

    const data = encodeCalls(calls);

    // let [blockNumber, returnValues] = await this.executeCalls(calls, data);

    const network = await this.provider.getNetwork();
    let returnValues;
    if (await networkSupportsMulticall(network.chainId)) {
      returnValues = await this.executeCallsWithMulticall(data);
      returnValues = decodeCalls(returnValues);
    } else {
      returnValues = await this.executeRegularCalls(calls);
    }

    // returnValues = decodeCalls(returnValues);
    debug(`Got return values: ${returnValues}`);

    for (let i = 0; i < returnValues.length; i++) {
      let call = calls[i];
      let decoded = call.caller.__interface.decodeFunctionResult(
        call.fd,
        returnValues[i]
      );

      result[call.caller.__name][call.fd.name] = decoded;
      result[call.caller.__name][call.fd.format()] = decoded;
    }

    return result;
  }

  executeCallsWithMulticall = async (data) => {
    return await this.executeMulticallData(data);
  };

  executeRegularCalls = async (calls: Call[]) => {
    const values = await Promise.all(
      calls.map(
        async (call) =>
          await this.provider.call({ to: call.to, data: call.data })
      )
    );
    return values;
  };

  async executeMulticallData(data: string) {
    const network = await this.provider.getNetwork();
    const address = await multicallAddressOrThrow(network.chainId);

    const callData = AGGREGATE_SELECTOR + data.substr(2);

    const tx = {
      to: address,
      data: callData,
    };

    const result = await this.provider.call(tx);

    return result;
  }
}
