import { decodeData } from "../decodeData";
import expectedCallsJson from "../__mocks__/expectedCallsJson";

describe("decodeData", () => {
  it("takes data called from the chain and make it a human readable multicall response", async () => {
    const callResponse = "0x0009098908";

    const decodedData = decodeData(
      { ERC20: {} },
      JSON.parse(expectedCallsJson),
      callResponse
    );

    expect(decodedData).toEqual({ ERC20: {} });
  });
});
