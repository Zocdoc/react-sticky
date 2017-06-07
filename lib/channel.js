(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.channel = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Channel = function Channel(data) {
    _classCallCheck(this, Channel);

    var listeners = [];
    data = data || {};

    this.subscribe = function (fn) {
      listeners.push(fn);
    };

    this.unsubscribe = function (fn) {
      var idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };

    this.update = function (fn) {
      if (fn) fn(data);
      listeners.forEach(function (l) {
        return l(data);
      });
    };
  };

  exports.default = Channel;
});