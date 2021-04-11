const ERC20Abi = require("./ERC20Abi");

var {
  contract,
  encodeData,
  decodeData,
  prepareTransaction,
} = require("./dist/index");
// } = require("@pooltogether/etherplex");

var chainId = 1;
// var INFURA_API_ID = process.env.INFURA_ID;
var fetch = require("node-fetch");

const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
const EOA_ADDRESS = "0x5E6CC2397EcB33e6041C15360E17c777555A5E63";
const etherplexTokenContract = contract("token", ERC20Abi, DAI);
const batchCalls = etherplexTokenContract.balanceOf(EOA_ADDRESS).decimals();
// const values = await batch(provider, calls);

// TODO: currently we assume any PoolTogether pool is on a network which supports multicall
// so make sure to handle calls differently if the network doesn't support multicall!
// see Etherplex for calls fallback for non-multicall networks
const [result, calls, data] = encodeData(batchCalls);

const t = async () => {
  const tx = {
    params: [await prepareTransaction(chainId, data), "latest"],
    jsonrpc: "2.0",
    id: 1,
    method: "eth_call",
  };

  const callResponse = await fetch(
    "https://mainnet.infura.io/v3/a0a574aaa9fc4fa8ad117dc7bc6ffc19",
    {
      method: "POST",
      body: JSON.stringify(tx),
      headers: { "Content-Type": "application/json" },
    }
  ); // make provider call
  const body = await callResponse.json();
  const decoded = decodeData(result, calls, body.result);
  console.log(decoded);
};

t();
