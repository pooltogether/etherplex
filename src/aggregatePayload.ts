import { Call } from "./Call";
import { encodeCalls } from "./encodeCalls";
// import { BaseProvider } from "@ethersproject/providers";
import { Context } from "./MulticallContract";
import { networkSupportsMulticall } from "./multicallAddresses";

const debug = require("debug")("etherplex:PayloadAggregator");

export const AGGREGATE_SELECTOR = "0x252dba42";

export const aggregatePayload = (...contexts: Context[]) => {
  let result = {};

  let calls: Array<Call> = [];

  contexts.forEach((caller) => {
    result[caller.contract.__name] = {};
    calls = calls.concat(caller.flush());
  });

  debug(`Found ${calls.length} calls...`);
  debug(`Multicall is supported`);

  const data = encodeCalls(calls);
  debug(`Encoded data: ${data}`);

  return data;
};
