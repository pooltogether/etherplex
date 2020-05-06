'use strict';

var Call = /** @class */ (function () {
    function Call(caller, fd, to, data, resolve, reject) {
        this.caller = caller;
        this.fd = fd;
        this.to = to;
        this.data = data;
        this.resolve = resolve;
        this.reject = reject;
    }
    return Call;
}());

exports.Call = Call;
