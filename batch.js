'use strict';

var MulticallExecutor = require('./MulticallExecutor.js');

function batch(provider) {
    var _a;
    var contexts = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        contexts[_i - 1] = arguments[_i];
    }
    return (_a = new MulticallExecutor.MulticallExecutor(provider)).executeCallers.apply(_a, contexts);
}

exports.batch = batch;
