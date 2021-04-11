import { BigNumber } from "@ethersProject/bignumber";
import { MulticallExecutor } from "../MulticallExecutor";
import { AGGREGATE_SELECTOR } from "../prepareTransaction";
import { MulticallContract } from "../MulticallContract";
import { MULTICALL_ADDRESSES } from "../multicallAddresses";
import ERC20Abi from "../__mocks__/ERC20Abi";

const ADDRESS = "0xb197f346ec436e1fa89ed8b4ce58696364ab232c";

const MAINNET_CHAIN_ID = 1;
const RINKEBY_CHAIN_ID = 4;
const GOERLI_CHAIN_ID = 5;
const KOVAN_CHAIN_ID = 42;

const MULTICALL_ADDRESS_MAINNET = MULTICALL_ADDRESSES[MAINNET_CHAIN_ID];
const MULTICALL_ADDRESS_RINKEBY = MULTICALL_ADDRESSES[RINKEBY_CHAIN_ID];
const MULTICALL_ADDRESS_GOERLI = MULTICALL_ADDRESSES[GOERLI_CHAIN_ID];
const MULTICALL_ADDRESS_KOVAN = MULTICALL_ADDRESSES[KOVAN_CHAIN_ID];

describe("MulticallExecutor", () => {
  let executor;

  let provider, chainId;

  beforeEach(() => {
    chainId = 1;
    provider = {
      call: jest.fn(),
      getNetwork: jest.fn(() =>
        Promise.resolve({
          chainId,
        })
      ),
    };
    executor = new MulticallExecutor(provider);
  });

  describe("executeCallers()", () => {
    it("should collapse the calls", async () => {
      let contract = new MulticallContract("ERC20", ERC20Abi, ADDRESS);
      // @ts-ignore
      let context = contract.balanceOf(ADDRESS);
      // @ts-ignore
      context.totalSupply();

      // intercept the call
      executor.executeCalls = jest.fn(() => [
        null,
        [
          "0x00000000000000000000000000000000000000000000000000000000000004d2",
          "0x0000000000000000000000000000000000000000000000000000000000000064",
        ],
      ]);

      const result = await executor.executeCallers(context);

      expect(result).toEqual({
        ERC20: {
          balanceOf: [BigNumber.from("1234")],
          "balanceOf(address)": [BigNumber.from("1234")],
          totalSupply: [BigNumber.from("100")],
          "totalSupply()": [BigNumber.from("100")],
        },
      });
    });
  });

  describe("executeCalls()", () => {
    it("should use multicall when available", async () => {
      let contract = new MulticallContract("ERC20", ERC20Abi, ADDRESS);

      // ethers.utils.defaultAbiCoder.encode(['uint256', 'bytes[]'], [1234, [ethers.BigNumber.from('1234'), ethers.BigNumber.from('4321')]])
      executor.executeMulticallData = jest.fn(
        () =>
          "0x00000000000000000000000000000000000000000000000000000000000004d20000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000204d2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000210e1000000000000000000000000000000000000000000000000000000000000"
      );

      const result = await executor.executeCalls([
        {
          caller: contract,
          fd: contract.__interface.functions.balanceOf,
          to: ADDRESS,
          data:
            "0x70a08231000000000000000000000000b197f346ec436e1fa89ed8b4ce58696364ab232c",
        },
        {
          caller: contract,
          fd: contract.__interface.functions.totalSupply,
          to: ADDRESS,
          data: "0x18160ddd",
        },
      ]);

      expect(result).toEqual([
        BigNumber.from("1234"),
        [
          BigNumber.from("1234").toHexString(),
          BigNumber.from("4321").toHexString(),
        ],
      ]);
    });
  });

  describe("executeMulticallData()", () => {
    it("should execute against mainnet", async () => {
      chainId = 1;

      await executor.executeMulticallData("0x1234");
      expect(provider.call).toHaveBeenCalledWith({
        to: MULTICALL_ADDRESS_MAINNET,
        data: `${AGGREGATE_SELECTOR}1234`,
      });
    });

    it("should execute against kovan", async () => {
      chainId = 42;
      await executor.executeMulticallData("0x1234");
      expect(provider.call).toHaveBeenCalledWith({
        to: MULTICALL_ADDRESS_KOVAN,
        data: `${AGGREGATE_SELECTOR}1234`,
      });
    });

    it("should execute against rinkeby", async () => {
      chainId = 4;
      await executor.executeMulticallData("0x1234");
      expect(provider.call).toHaveBeenCalledWith({
        to: MULTICALL_ADDRESS_RINKEBY,
        data: `${AGGREGATE_SELECTOR}1234`,
      });
    });

    it("should execute against goerli", async () => {
      chainId = 5;
      await executor.executeMulticallData("0x1234");
      expect(provider.call).toHaveBeenCalledWith({
        to: MULTICALL_ADDRESS_GOERLI,
        data: `${AGGREGATE_SELECTOR}1234`,
      });
    });

    it("should fail with an unknown network", async () => {
      chainId = 888;
      expect(executor.executeMulticallData("0x1234")).rejects.toEqual(
        new Error("multicall is not available on the network 888")
      );
    });
  });
});
