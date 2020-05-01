# Etherplex

Ethers.js + Maker's Multicall

Batch your calls together using Etherplex.

## Example

```javascript
import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

let daiContract = contract('DaiPool', PoolAbi, DAI_ADDRESS)
let usdcContract = contract('UsdcPool', PoolAbi, USDC_ADDRESS)

batch(
  ethers.getDefaultProvider(),
  daiContract
    .totalBalanceOf(address),
  usdcContract
    .totalBalanceOf(address)
).then(results => {
  console.log('Your data', results)
}).catch(e => {
  console.error('Uh-or read error', e)
})
/*
Will yield:

{
  DaiPool: {
    'totalBalanceOf(address)': [BigNumber],
    totalBalanceOf: [BigNumber],
  },
  UsdcPool: {
    'totalBalanceOf(address)': [BigNumber],
    totalBalanceOf: [BigNumber],
  }
}

*/
```
