const ERC20Abi = require("./ERC20Abi");

// var {
//   MulticallContract,
//   encodeData,
//   decodeData,
//   prepareTransaction,
// } = require("@pooltogether/etherplex");

var {
  MulticallContract,
  encodeData,
  decodeData,
  prepareTransaction,
} = require("./dist/index");

var ethers = require("ethers");
var chainId = 1;
// var INFURA_API_ID = process.env.INFURA_ID;
var fetch = require("node-fetch");

// var ERC20Abi = require("./fakeabi");
// var DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
// let daiContract = contract("Dai", ERC20Abi, DAI_ADDRESS);
// var batchCalls = [daiContract.totalSupply()];

const ADDRESS = "0xb197f346ec436e1fa89ed8b4ce58696364ab232c";

let contract = new MulticallContract("ERC20", ERC20Abi, ADDRESS);
let batchCalls = contract.balanceOf(ADDRESS).totalSupply();
// context.totalSupply();

// TODO: currently we assume any PoolTogether pool is on a network which supports multicall
// so make sure to handle calls differently if the network doesn't support multicall!
// see Etherplex for calls fallback for non-multicall networks

const [result, calls, data] = encodeData(batchCalls);

const t = async () => {
  // await prov.ready;
  const tx = prepareTransaction(chainId, data);

  // const body = JSON.stringify({
  //   ...request,
  //   jsonrpc: "2.0",
  //   id: 1,
  // });
  console.log({ tx });
  const callResponse = await fetch(
    "https://mainnet.infura.io/v3/a0a574aaa9fc4fa8ad117dc7bc6ffc19",
    {
      method: "POST",
      body: tx,
      headers: { "Content-Type": "application/json" },
    }
  ); // make provider call
  // balance = await prov.getBalance("ethers.eth");
  // console.log(balance.toString());

  const decoded = decodeData(result, calls, callResponse);

  console.log(decoded);
};

t();
