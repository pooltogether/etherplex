'use strict';

var ethers = require('ethers');

function encodeCalls(calls) {
    return ethers.ethers.utils.defaultAbiCoder.encode([
        {
            components: [{ type: 'address' }, { type: 'bytes' }],
            name: 'data',
            type: 'tuple[]'
        }
    ], [
        calls.map(function (call) { return [
            call.to,
            call.data
        ]; })
    ]);
}

exports.encodeCalls = encodeCalls;
