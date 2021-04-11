import { prepareTransaction } from "../prepareTransaction";
import expectedEncodedData from "../__mocks__/expectedEncodedData";
import expectedPreparedTx from "../__mocks__/expectedPreparedTx";

describe("prepareTransaction", () => {
  it("takes data called from the chain and make it a human readable multicall response", async () => {
    const chainId = 1;
    const encodedData = expectedEncodedData;

    const tx = await prepareTransaction(chainId, encodedData);

    expect(tx).toEqual(expectedPreparedTx);
  });
});
