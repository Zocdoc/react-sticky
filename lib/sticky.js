'use strict';

exports.__esModule = true;
exports.default = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class,
    _temp2,
    _jsxFileName = 'src/sticky.js';

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var monitoredEventNames = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];

var Sticky = (_temp2 = _class = function (_React$Component) {
  (0, _inherits3.default)(Sticky, _React$Component);

  function Sticky() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Sticky);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.propKeys = null, _this.state = {}, _this.updateContext = function (_ref) {
      var inherited = _ref.inherited,
          node = _ref.node;

      _this.containerNode = node;
      _this.setState({
        containerOffset: inherited,
        distanceFromBottom: _this.getDistanceFromBottom()
      });
    }, _this.recomputeState = function () {
      var isSticky = _this.isSticky();
      var height = _this.getHeight();
      var width = _this.getWidth();
      var xOffset = _this.getXOffset();
      var distanceFromBottom = _this.getDistanceFromBottom();
      var hasChanged = _this.state.isSticky !== isSticky;

      _this.setState({ isSticky: isSticky, height: height, width: width, xOffset: xOffset, distanceFromBottom: distanceFromBottom });

      if (hasChanged) {
        if (_this.channel) {
          _this.channel.update(function (data) {
            data.offset = isSticky ? height : 0;
          });
        }

        _this.props.onStickyStateChange(isSticky);
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  Sticky.prototype.componentDidMount = function componentDidMount() {
    this.channel = this.context['sticky-channel'];
    this.channel.subscribe(this.updateContext);

    this.on(monitoredEventNames, this.recomputeState);
    this.recomputeState();

    this.propKeys = (0, _keys2.default)(this.props);
  };

  Sticky.prototype.componentWillReceiveProps = function componentWillReceiveProps() {
    this.recomputeState();
  };

  Sticky.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps, newState) {
    var _this2 = this;

    // Have we changed the number of props?
    if ((0, _keys2.default)(newProps).length != this.propKeys.length) return true;

    // Have we changed any prop values?
    var valuesChanged = this.propKeys.some(function (key) {
      return newProps.hasOwnProperty(key) && newProps[key] !== _this2.props[key];
    });
    if (valuesChanged) return true;

    // Have we changed any state that will always impact rendering?
    var state = this.state;
    if (newState.isSticky !== state.isSticky) return true;

    // If we are sticky, have we changed any state that will impact rendering?
    if (state.isSticky) {
      if (newState.height !== state.height) return true;
      if (newState.width !== state.width) return true;
      if (newState.xOffset !== state.xOffset) return true;
      if (newState.containerOffset !== state.containerOffset) return true;
      if (newState.distanceFromBottom !== state.distanceFromBottom) return true;
    }

    return false;
  };

  Sticky.prototype.componentDidUpdate = function componentDidUpdate() {
    this.propKeys = (0, _keys2.default)(this.props);
  };

  Sticky.prototype.componentWillUnmount = function componentWillUnmount() {
    this.off(monitoredEventNames, this.recomputeState);
    this.channel.unsubscribe(this.updateContext);
  };

  /*
   * The special sauce.
   */


  Sticky.prototype.render = function render() {
    var placeholderStyle = { paddingBottom: 0 };
    var className = this.props.className;

    // To ensure that this component becomes sticky immediately on mobile devices instead
    // of disappearing until the scroll event completes, we add `transform: translateZ(0)`
    // to 'kick' rendering of this element to the GPU
    // @see http://stackoverflow.com/questions/32875046
    var style = (0, _extends3.default)({ transform: 'translateZ(0)' }, this.props.style);

    if (this.state.isSticky) {
      var _stickyStyle = {
        position: 'fixed',
        top: this.state.containerOffset,
        left: this.state.xOffset,
        width: this.state.width
      };

      var bottomLimit = this.state.distanceFromBottom - this.state.height - this.props.bottomOffset;
      if (this.state.containerOffset > bottomLimit) {
        _stickyStyle.top = bottomLimit;
      }

      placeholderStyle.paddingBottom = this.state.height + this.props.topOffset;

      className += ' ' + this.props.stickyClassName;
      style = (0, _extends3.default)({}, style, _stickyStyle, this.props.stickyStyle);
    }

    var _props = this.props,
        topOffset = _props.topOffset,
        isActive = _props.isActive,
        stickyClassName = _props.stickyClassName,
        stickyStyle = _props.stickyStyle,
        bottomOffset = _props.bottomOffset,
        onStickyStateChange = _props.onStickyStateChange,
        props = (0, _objectWithoutProperties3.default)(_props, ['topOffset', 'isActive', 'stickyClassName', 'stickyStyle', 'bottomOffset', 'onStickyStateChange']);


    return _react2.default.createElement(
      'div',
      {
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 127
        }
      },
      _react2.default.createElement('div', { ref: 'placeholder', style: placeholderStyle, __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 128
        }
      }),
      _react2.default.createElement(
        'div',
        (0, _extends3.default)({}, props, { ref: 'children', className: className, style: style, __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 129
          }
        }),
        this.props.children
      )
    );
  };

  Sticky.prototype.getXOffset = function getXOffset() {
    return this.refs.placeholder.getBoundingClientRect().left;
  };

  Sticky.prototype.getWidth = function getWidth() {
    return this.refs.placeholder.getBoundingClientRect().width;
  };

  Sticky.prototype.getHeight = function getHeight() {
    return _reactDom2.default.findDOMNode(this.refs.children).getBoundingClientRect().height;
  };

  Sticky.prototype.getDistanceFromTop = function getDistanceFromTop() {
    return this.refs.placeholder.getBoundingClientRect().top;
  };

  Sticky.prototype.getDistanceFromBottom = function getDistanceFromBottom() {
    if (!this.containerNode) return 0;
    return this.containerNode.getBoundingClientRect().bottom;
  };

  Sticky.prototype.isSticky = function isSticky() {
    if (!this.props.isActive) return false;

    var fromTop = this.getDistanceFromTop();
    var fromBottom = this.getDistanceFromBottom();

    var topBreakpoint = this.state.containerOffset - this.props.topOffset;
    var bottomBreakpoint = this.state.containerOffset + this.props.bottomOffset;

    return fromTop <= topBreakpoint && fromBottom >= bottomBreakpoint;
  };

  Sticky.prototype.on = function on(events, callback) {
    events.forEach(function (evt) {
      window.addEventListener(evt, callback, true);
    });
  };

  Sticky.prototype.off = function off(events, callback) {
    events.forEach(function (evt) {
      window.removeEventListener(evt, callback, true);
    });
  };

  return Sticky;
}(_react2.default.Component), _class.propTypes = {
  bottomOffset: _propTypes2.default.number,
  className: _propTypes2.default.string,
  isActive: _propTypes2.default.bool,
  onStickyStateChange: _propTypes2.default.func,
  stickyClassName: _propTypes2.default.string,
  stickyStyle: _propTypes2.default.object,
  style: _propTypes2.default.object,
  topOffset: _propTypes2.default.number
}, _class.defaultProps = {
  bottomOffset: 0,
  className: '',
  isActive: true,
  onStickyStateChange: function onStickyStateChange() {},
  stickyClassName: 'sticky',
  stickyStyle: {},
  style: {},
  topOffset: 0
}, _class.contextTypes = {
  'sticky-channel': _propTypes2.default.any
}, _temp2);
exports.default = Sticky;