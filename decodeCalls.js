'use strict';

var ethers = require('ethers');

function decodeCalls(returnData) {
    var _a = ethers.ethers.utils.defaultAbiCoder.decode(['uint256', 'bytes[]'], returnData), blockNumber = _a[0], results = _a[1];
    return [blockNumber, results];
}

exports.decodeCalls = decodeCalls;
