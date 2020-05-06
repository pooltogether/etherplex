'use strict';

var _tslib = require('./_virtual/_tslib');
var ethers = require('ethers');
var Call = require('./Call.js');

var Context = /** @class */ (function () {
    function Context(contract) {
        this.contract = contract;
        this.calls = new Array();
    }
    Context.prototype.call = function (to, fd, data) {
        var resolveCb;
        var rejectCb;
        var promise = new Promise(function (resolve, reject) {
            resolveCb = resolve;
            rejectCb = reject;
        });
        var call = new Call.Call(this.contract, fd, to, data, resolveCb, rejectCb);
        this.calls.push(call);
        return promise;
    };
    Context.prototype.flush = function () {
        var oldCalls = this.calls;
        this.calls = new Array();
        return oldCalls;
    };
    return Context;
}());
var MulticallContract = /** @class */ (function () {
    function MulticallContract(__name, abi, __address) {
        var _this = this;
        this.__name = __name;
        this.__address = __address;
        this.__interface = new ethers.ethers.utils.Interface(abi);
        this.__functionContext = /** @class */ (function (_super) {
            _tslib.__extends(FunctionContext, _super);
            function FunctionContext() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return FunctionContext;
        }(Context));
        Object.keys(this.__interface.functions).forEach(function (functionName) {
            var fd = _this.__interface.functions[functionName];
            if (fd.type === 'call') {
                _this.addFunction(fd);
                _this.addPrototypeFunction(fd);
            }
        });
    }
    MulticallContract.prototype.addFunction = function (fd) {
        var _this = this;
        var that = this;
        var callback = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            // create a new context and return it
            // @ts-ignore
            var context = new _this.__functionContext(that);
            return context[fd.name].apply(context, params);
        };
        this[fd.name] = callback;
        this[fd.signature] = callback;
    };
    MulticallContract.prototype.addPrototypeFunction = function (fd) {
        var callback = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var data = fd.encode(params);
            this.call(this.contract.__address, fd, data);
            return this;
        };
        this.__functionContext.prototype[fd.name] = callback;
        this.__functionContext.prototype[fd.signature] = callback;
    };
    return MulticallContract;
}());

exports.Context = Context;
exports.MulticallContract = MulticallContract;
