'use strict';

var MulticallContract = require('./MulticallContract.js');

function contract(name, abiOrContract, address) {
    var result;
    if (address) {
        result = new MulticallContract.MulticallContract(name, abiOrContract, address);
    }
    else {
        var abi = abiOrContract.abi;
        address = abiOrContract.address;
        result = new MulticallContract.MulticallContract(name, abi, address);
    }
    return result;
}

exports.contract = contract;
