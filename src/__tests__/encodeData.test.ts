import { encodeData } from "../encodeData";
import { MulticallContract } from "../MulticallContract";
import ERC20Abi from "../__mocks__/ERC20Abi";
import expectedCallsJson from "../__mocks__/expectedCallsJson";
import expectedEncodedData from "../__mocks__/expectedEncodedData";

const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
const EOA_ADDRESS = "0x5E6CC2397EcB33e6041C15360E17c777555A5E63";

describe("encodeData", () => {
  it("prepares an array of calls (typically used via batch())", async () => {
    let contract = new MulticallContract("ERC20", ERC20Abi, DAI_ADDRESS);
    // @ts-ignore
    let context = contract.balanceOf(EOA_ADDRESS).decimals();

    const [result, calls, data] = encodeData(context);

    expect(result).toEqual({ ERC20: {} });
    expect(JSON.stringify(calls)).toEqual(expectedCallsJson);
    expect(data).toEqual(expectedEncodedData);
  });
});
