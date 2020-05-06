'use strict';

var _tslib = require('./_virtual/_tslib');
var encodeCalls = require('./encodeCalls.js');
var decodeCalls = require('./decodeCalls.js');

var debug = require('debug')('etherplex:MulticallExecutor');
var MULTICALL_ADDRESS_MAINNET = "0xeefba1e63905ef1d7acba5a8513c70307c1ce441";
var MULTICALL_ADDRESS_KOVAN = "0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a";
var MULTICALL_ADDRESS_RINKEBY = "0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821";
var MULTICALL_ADDRESS_GOERLI = "0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e";
var AGGREGATE_SELECTOR = '0x252dba42';
var MulticallExecutor = /** @class */ (function () {
    function MulticallExecutor(provider) {
        this.provider = provider;
    }
    MulticallExecutor.prototype.executeCallers = function () {
        var contexts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            contexts[_i] = arguments[_i];
        }
        return _tslib.__awaiter(this, void 0, void 0, function () {
            var result, calls, _a, blockNumber, returnValues, i, call, decoded;
            return _tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = {};
                        calls = [];
                        contexts.forEach(function (caller) {
                            result[caller.contract.__name] = {};
                            calls = calls.concat(caller.flush());
                        });
                        debug("Found " + calls.length + " calls...");
                        return [4 /*yield*/, this.executeCalls(calls)];
                    case 1:
                        _a = _b.sent(), blockNumber = _a[0], returnValues = _a[1];
                        debug("Got return values: " + returnValues);
                        for (i = 0; i < returnValues.length; i++) {
                            call = calls[i];
                            decoded = call.fd.decode(returnValues[i]);
                            result[call.caller.__name][call.fd.name] = decoded;
                            result[call.caller.__name][call.fd.signature] = decoded;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    MulticallExecutor.prototype.executeCalls = function (calls) {
        return _tslib.__awaiter(this, void 0, void 0, function () {
            var data, result, values;
            var _this = this;
            return _tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.networkSupportsMulticall()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        debug("Multicall is supported");
                        data = encodeCalls.encodeCalls(calls);
                        debug("Encoded data: " + data);
                        debug(calls);
                        return [4 /*yield*/, this.executeMulticallData(data)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, decodeCalls.decodeCalls(result)];
                    case 3: return [4 /*yield*/, Promise.all(calls.map(function (call) { return _tslib.__awaiter(_this, void 0, void 0, function () {
                            return _tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.provider.call({ to: call.to, data: call.data })];
                                    case 1: return [2 /*return*/, (_a.sent())];
                                }
                            });
                        }); }))];
                    case 4:
                        values = _a.sent();
                        return [2 /*return*/, [null, values]];
                }
            });
        });
    };
    MulticallExecutor.prototype.executeMulticallData = function (data) {
        return _tslib.__awaiter(this, void 0, void 0, function () {
            var address, callData, tx, result;
            return _tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.multicallAddressOrThrow()];
                    case 1:
                        address = _a.sent();
                        callData = AGGREGATE_SELECTOR + data.substr(2);
                        tx = {
                            to: address,
                            data: callData
                        };
                        return [4 /*yield*/, this.provider.call(tx)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    MulticallExecutor.prototype.multicallAddressOrThrow = function () {
        return _tslib.__awaiter(this, void 0, void 0, function () {
            var network, address, msg;
            return _tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.getNetwork()];
                    case 1:
                        network = _a.sent();
                        address = this.multicallAddress(network.chainId);
                        if (address === null) {
                            msg = "multicall is not available on the network " + network.chainId;
                            console.error(msg);
                            throw new Error(msg);
                        }
                        return [2 /*return*/, address];
                }
            });
        });
    };
    MulticallExecutor.prototype.networkSupportsMulticall = function () {
        return _tslib.__awaiter(this, void 0, void 0, function () {
            var network, address;
            return _tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.getNetwork()];
                    case 1:
                        network = _a.sent();
                        address = this.multicallAddress(network.chainId);
                        return [2 /*return*/, address !== null];
                }
            });
        });
    };
    MulticallExecutor.prototype.multicallAddress = function (chainId) {
        switch (chainId) {
            case 1:
                return MULTICALL_ADDRESS_MAINNET;
            case 42:
                return MULTICALL_ADDRESS_KOVAN;
            case 4:
                return MULTICALL_ADDRESS_RINKEBY;
            case 5:
                return MULTICALL_ADDRESS_GOERLI;
            default:
                return null;
        }
    };
    return MulticallExecutor;
}());

exports.AGGREGATE_SELECTOR = AGGREGATE_SELECTOR;
exports.MULTICALL_ADDRESS_GOERLI = MULTICALL_ADDRESS_GOERLI;
exports.MULTICALL_ADDRESS_KOVAN = MULTICALL_ADDRESS_KOVAN;
exports.MULTICALL_ADDRESS_MAINNET = MULTICALL_ADDRESS_MAINNET;
exports.MULTICALL_ADDRESS_RINKEBY = MULTICALL_ADDRESS_RINKEBY;
exports.MulticallExecutor = MulticallExecutor;
