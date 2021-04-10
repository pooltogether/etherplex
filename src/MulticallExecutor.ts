import { Call } from "./Call";
import { decodeCalls } from "./decodeCalls";
import { BaseProvider } from "@ethersproject/providers";
import { Context } from "./MulticallContract";
import {
  networkSupportsMulticall,
  multicallAddressOrThrow,
} from "./multicallAddresses";

const debug = require("debug")("etherplex:MulticallExecutor");

export const AGGREGATE_SELECTOR = "0x252dba42";

export class MulticallExecutor {
  constructor(private readonly provider: BaseProvider) {}

  async executeCallers(...contexts: Context[]) {
    let result = {};

    let calls: Array<Call> = [];

    contexts.forEach((caller) => {
      result[caller.contract.__name] = {};
      calls = calls.concat(caller.flush());
    });

    debug(`Found ${calls.length} calls...`);

    const [blockNumber, returnValues] = await this.executeCalls(calls);

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

  async executeCalls(calls: Call[]) {
    const network = await this.provider.getNetwork();
    if (await networkSupportsMulticall(network.chainId)) {
      debug(`Multicall is supported`);
      const data = encodeCalls(calls);
      debug(`Encoded data: ${data}`);
      debug(calls);
      const result = await this.executeMulticallData(data);
      return decodeCalls(result);
    } else {
      const values = await Promise.all(
        calls.map(
          async (call) =>
            await this.provider.call({ to: call.to, data: call.data })
        )
      );
      return [null, values];
    }
  }

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
