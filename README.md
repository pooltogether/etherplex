# Etherplex

[Ethers.js](https://github.com/ethers-io/ethers.js) + [Multicall](https://github.com/makerdao/multicall)

Batch multiple Ethereum JSON RPC calls into a single RPC call.

Features:

- Uses the Multicall contract when available
- Falls back to individual RPC requests when not available

# Setup

```bash
$ yarn add @pooltogether/etherplex
```

# Usage

1. First create a contract wrapper using the `contract` function
2. Chain calls on the contract and pass the results into the `batch` function

```javascript
import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

// Assuming ERC20Abi is an ABI
// Assume the DAI_ADDRESS and USDC_ADDRESS constants are Ethereum addresses

let daiContract = contract('Dai', ERC20Abi, DAI_ADDRESS)

// Alternatively, you can just pass in an ethers.Contract instance
let ethersContract = new ethers.Contract(USDC_ADDRESS, ERC20Abi, provider)
let usdcContract = contract('Usdc', ethersContract)

let results = await batch(
  ethers.getDefaultProvider(),
  daiContract
    .balanceOf(address)
    .totalSupply(),
  usdcContract
    .balanceOf(address)
    .totalSupply()
)
/*
Will yield:

{
  Dai: {
    'balanceOf(address)': [BigNumber],
    balanceOf: [BigNumber],
  },
  Usdc: {
    'balanceOf(address)': [BigNumber],
    balanceOf: [BigNumber],
  }
}

*/
```
