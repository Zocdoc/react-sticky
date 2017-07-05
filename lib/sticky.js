var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

var monitoredEventNames = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];

var Sticky = function (_React$Component) {
  _inherits(Sticky, _React$Component);

  function Sticky() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Sticky);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Sticky.__proto__ || Object.getPrototypeOf(Sticky)).call.apply(_ref, [this].concat(args))), _this), _this.$children = null, _this.$placeholder = null, _this.childMetrics = null, _this.placeholderMetrics = null, _this.containerOffset = undefined, _this.distanceFromBottom = null, _this.height = null, _this.width = null, _this.xOffset = null, _this.propKeys = null, _this.state = {}, _this.updateContext = function (_ref2) {
      var inherited = _ref2.inherited,
          node = _ref2.node;

      if (!_this.$containerNode) {
        _this.$containerNode = node;
      }

      if (inherited !== _this.containerOffset) {
        _this.containerOffset = inherited;
        _this.distanceFromBottom = _this.$containerNode.getBoundingClientRect().bottom;

        _this.recomputeState();
      }
    }, _this.recomputeState = function () {
      _this.captureMetrics();

      var isSticky = _this.isSticky();

      if (_this.state.isSticky !== isSticky) {
        _this.setState({ isSticky: isSticky }, _this.handleUpdateDOM);

        if (_this.channel) {
          _this.channel.update(function (data) {
            data.offset = isSticky ? _this.height : 0;
          });
        }

        _this.props.onStickyStateChange(isSticky);
      } else {
        _this.handleUpdateDOM();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Sticky, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.$children = this.refs.children;
      this.$placeholder = this.refs.placeholder;
      this.propKeys = Object.keys(this.props);

      this.on(monitoredEventNames, this.recomputeState);
      this.recomputeState();

      this.channel = this.context['sticky-channel'];
      this.channel.subscribe(this.updateContext);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      this.recomputeState();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(newProps, newState) {
      var _this2 = this;

      // Have we changed the number of props?
      if (Object.keys(newProps).length != this.propKeys.length) return true;

      // Have we changed any prop values?
      var valuesChanged = this.propKeys.some(function (key) {
        return newProps.hasOwnProperty(key) && newProps[key] !== _this2.props[key];
      });
      if (valuesChanged) return true;

      // Have we changed any state that will always impact rendering?
      if (newState.isSticky !== this.state.isSticky) return true;

      return false;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.propKeys = Object.keys(this.props);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.off(monitoredEventNames, this.recomputeState);
      this.channel.unsubscribe(this.updateContext);

      this.$children = null;
      this.$containerNode = null;
      this.$placeholder = null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          topOffset = _props.topOffset,
          isActive = _props.isActive,
          stickyClassName = _props.stickyClassName,
          stickyStyle = _props.stickyStyle,
          bottomOffset = _props.bottomOffset,
          onStickyStateChange = _props.onStickyStateChange,
          props = _objectWithoutProperties(_props, ['topOffset', 'isActive', 'stickyClassName', 'stickyStyle', 'bottomOffset', 'onStickyStateChange']);

      return React.createElement(
        'div',
        null,
        React.createElement('div', { ref: 'placeholder' }),
        React.createElement(
          'div',
          _extends({}, props, { ref: 'children' }),
          this.props.children
        )
      );
    }
  }, {
    key: 'captureMetrics',
    value: function captureMetrics() {
      this.childMetrics = this.$children.getBoundingClientRect();
      this.placeholderMetrics = this.$placeholder.getBoundingClientRect();

      this.height = this.childMetrics.height;
      this.width = this.placeholderMetrics.width;
      this.xOffset = this.placeholderMetrics.left;
      this.distanceFromTop = this.placeholderMetrics.top;
    }
  }, {
    key: 'isSticky',
    value: function isSticky() {
      if (!this.props.isActive) return false;

      var topBreakpoint = this.containerOffset - this.props.topOffset;
      var bottomBreakpoint = this.containerOffset + this.props.bottomOffset;

      return this.distanceFromTo <= topBreakpoint && this.distanceFromBottom >= bottomBreakpoint;
    }
  }, {
    key: 'handleUpdateDOM',
    value: function handleUpdateDOM() {
      var placeholderStyle = { paddingBottom: 0 };

      // To ensure that this component becomes sticky immediately on mobile devices instead
      // of disappearing until the scroll event completes, we add `transform: translateZ(0)`
      // to 'kick' rendering of this element to the GPU
      // @see http://stackoverflow.com/questions/32875046
      var style = _extends({ transform: 'translateZ(0)' }, this.props.style);

      if (this.state.isSticky) {
        var stickyStyle = {
          position: 'fixed',
          top: this.containerOffset,
          left: this.xOffset,
          width: this.width
        };

        var bottomLimit = this.distanceFromBottom - this.height - this.props.bottomOffset;
        if (this.containerOffset > bottomLimit) {
          stickyStyle.top = bottomLimit;
        }

        placeholderStyle.paddingBottom = this.height;

        style = _extends({}, style, stickyStyle, this.props.stickyStyle);
      }

      this.$children.classList[this.state.isSticky ? 'add' : 'remove'](this.props.stickyClassName);
      _extends(this.$children.style, style);

      _extends(this.$placeholder.style, placeholderStyle);
    }
  }, {
    key: 'on',
    value: function on(events, callback) {
      events.forEach(function (evt) {
        window.addEventListener(evt, callback, true);
      });
    }
  }, {
    key: 'off',
    value: function off(events, callback) {
      events.forEach(function (evt) {
        window.removeEventListener(evt, callback, true);
      });
    }
  }]);

  return Sticky;
}(React.Component);

Sticky.propTypes = {
  bottomOffset: PropTypes.number,
  className: PropTypes.string,
  isActive: PropTypes.bool,
  onStickyStateChange: PropTypes.func,
  stickyClassName: PropTypes.string,
  stickyStyle: PropTypes.object,
  style: PropTypes.object,
  topOffset: PropTypes.number
};
Sticky.defaultProps = {
  bottomOffset: 0,
  className: '',
  isActive: true,
  onStickyStateChange: function onStickyStateChange() {},
  stickyClassName: 'sticky',
  stickyStyle: {},
  style: {},
  topOffset: 0
};
Sticky.contextTypes = {
  'sticky-channel': PropTypes.any
};
export default Sticky;
//# sourceMappingURL=sticky.js.map