'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class,
    _temp,
    _jsxFileName = 'src/container.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _channel = require('./channel');

var _channel2 = _interopRequireDefault(_channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Container = (_temp = _class = function (_React$Component) {
  (0, _inherits3.default)(Container, _React$Component);

  function Container(props) {
    (0, _classCallCheck3.default)(this, Container);

    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));

    _this.updateOffset = function (_ref) {
      var inherited = _ref.inherited,
          offset = _ref.offset;

      _this.channel.update(function (data) {
        data.inherited = inherited + offset;
      });
    };

    _this.channel = new _channel2.default({ inherited: 0, offset: 0, node: null });
    return _this;
  }

  Container.prototype.getChildContext = function getChildContext() {
    return { 'sticky-channel': this.channel };
  };

  Container.prototype.componentWillMount = function componentWillMount() {
    var parentChannel = this.context['sticky-channel'];
    if (parentChannel) parentChannel.subscribe(this.updateOffset);
  };

  Container.prototype.componentDidMount = function componentDidMount() {
    var node = _reactDom2.default.findDOMNode(this);
    this.channel.update(function (data) {
      data.node = node;
    });
  };

  Container.prototype.componentWillUnmount = function componentWillUnmount() {
    this.channel.update(function (data) {
      data.node = null;
    });

    var parentChannel = this.context['sticky-channel'];
    if (parentChannel) parentChannel.unsubscribe(this.updateOffset);
  };

  Container.prototype.render = function render() {
    return _react2.default.createElement(
      'div',
      (0, _extends3.default)({}, this.props, {
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 48
        }
      }),
      this.props.children
    );
  };

  return Container;
}(_react2.default.Component), _class.contextTypes = {
  'sticky-channel': _propTypes2.default.any
}, _class.childContextTypes = {
  'sticky-channel': _propTypes2.default.any
}, _temp);
exports.default = Container;