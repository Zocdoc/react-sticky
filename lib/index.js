(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './sticky', './container', './channel'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./sticky'), require('./container'), require('./channel'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.sticky, global.container, global.channel);
    global.index = mod.exports;
  }
})(this, function (exports, _sticky, _container, _channel) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Channel = exports.StickyContainer = exports.Sticky = undefined;

  var _sticky2 = _interopRequireDefault(_sticky);

  var _container2 = _interopRequireDefault(_container);

  var _channel2 = _interopRequireDefault(_channel);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.Sticky = _sticky2.default;
  exports.StickyContainer = _container2.default;
  exports.Channel = _channel2.default;
  exports.default = _sticky2.default;
});