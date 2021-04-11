import { networkSupportsMulticall } from "../multicallAddresses";

describe("multicallAddresses", () => {
  describe("networkSupportsMulticall()", () => {
    it("should be true for mainnet", async () => {
      const chainId = 1;
      expect(await networkSupportsMulticall(chainId)).toBeTruthy();
    });

    it("should be false otherwise", async () => {
      const chainId = 999;
      expect(await networkSupportsMulticall(chainId)).toBeFalsy();
    });
  });
});
