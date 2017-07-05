import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const monitoredEventNames = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];

export default class Sticky extends React.Component {
  static propTypes = {
    bottomOffset: PropTypes.number,
    className: PropTypes.string,
    isActive: PropTypes.bool,
    onStickyStateChange: PropTypes.func,
    stickyClassName: PropTypes.string,
    stickyStyle: PropTypes.object,
    style: PropTypes.object,
    topOffset: PropTypes.number,
  };

  static defaultProps = {
    bottomOffset: 0,
    className: '',
    isActive: true,
    onStickyStateChange: () => {},
    stickyClassName: 'sticky',
    stickyStyle: {},
    style: {},
    topOffset: 0,
  };

  static contextTypes = {
    'sticky-channel': PropTypes.any
  };

  $children = null;
  $placeholder = null;

  childMetrics = null;
  placeholderMetrics = null;

  containerOffset = undefined;
  distanceFromBottom = null;
  height = null;
  width = null;
  xOffset = null;

  propKeys = null;
  state = {};

  componentDidMount() {
    this.$children = this.refs.children;
    this.$placeholder = this.refs.placeholder;
    this.propKeys = Object.keys(this.props);

    this.on(monitoredEventNames, this.recomputeState);
    this.recomputeState();

    this.channel = this.context['sticky-channel'];
    this.channel.subscribe(this.updateContext);
  }

  componentWillReceiveProps() {
    this.recomputeState();
  }

  shouldComponentUpdate(newProps, newState) {
    // Have we changed the number of props?
    if (Object.keys(newProps).length != this.propKeys.length) return true;

    // Have we changed any prop values?
    const valuesChanged = this.propKeys.some((key) => newProps.hasOwnProperty(key) && newProps[key] !== this.props[key]);
    if (valuesChanged) return true;

    // Have we changed any state that will always impact rendering?
    if (newState.isSticky !== this.state.isSticky) return true;

    return false;
  }

  componentDidUpdate() {
    this.propKeys = Object.keys(this.props);
  }

  componentWillUnmount() {
    this.off(monitoredEventNames, this.recomputeState);
    this.channel.unsubscribe(this.updateContext);

    this.$children = null;
    this.$containerNode = null;
    this.$placeholder = null;
  }

  render() {
    const {
      topOffset,
      isActive,
      stickyClassName,
      stickyStyle,
      bottomOffset,
      onStickyStateChange,
      ...props
    } = this.props;

    return (
      <div>
        <div ref="placeholder" />
        <div {...props} ref="children">
          {this.props.children}
        </div>
      </div>
    );
  }

  captureMetrics() {
    this.childMetrics = this.$children.getBoundingClientRect();
    this.placeholderMetrics = this.$placeholder.getBoundingClientRect();

    this.height = this.childMetrics.height;
    this.width = this.placeholderMetrics.width;
    this.xOffset = this.placeholderMetrics.left;
    this.distanceFromTop = this.placeholderMetrics.top;
  }

  isSticky() {
    if (!this.props.isActive) return false;

    const topBreakpoint = this.containerOffset - this.props.topOffset;
    const bottomBreakpoint = this.containerOffset + this.props.bottomOffset;

    return this.distanceFromTo <= topBreakpoint && this.distanceFromBottom >= bottomBreakpoint;
  }

  handleUpdateDOM() {
    const placeholderStyle = { paddingBottom: 0 };

    // To ensure that this component becomes sticky immediately on mobile devices instead
    // of disappearing until the scroll event completes, we add `transform: translateZ(0)`
    // to 'kick' rendering of this element to the GPU
    // @see http://stackoverflow.com/questions/32875046
    let style = { transform: 'translateZ(0)', ...this.props.style };

    if (this.state.isSticky) {
      const stickyStyle = {
        position: 'fixed',
        top: this.containerOffset,
        left: this.xOffset,
        width: this.width
      };

      const bottomLimit = this.distanceFromBottom - this.height - this.props.bottomOffset;
      if (this.containerOffset > bottomLimit) {
        stickyStyle.top = bottomLimit;
      }

      placeholderStyle.paddingBottom = this.height;

      style = Object.assign({}, style, stickyStyle, this.props.stickyStyle);
    }

    this.$children.classList[this.state.isSticky ? 'add' : 'remove'](this.props.stickyClassName);
    Object.assign(this.$children.style, style);

    Object.assign(this.$placeholder.style, placeholderStyle);
  }

  updateContext = ({ inherited, node }) => {
    if (!this.$containerNode) {
      this.$containerNode = node;
    }

    if (inherited !== this.containerOffset) {
      this.containerOffset = inherited;
      this.distanceFromBottom = this.$containerNode.getBoundingClientRect().bottom;

      this.recomputeState();
    }
  };

  recomputeState = () => {
    this.captureMetrics();

    const isSticky = this.isSticky();

    if (this.state.isSticky !== isSticky) {
      this.setState({ isSticky }, this.handleUpdateDOM);

      if (this.channel) {
        this.channel.update((data) => {
          data.offset = (isSticky ? this.height : 0);
        });
      }

      this.props.onStickyStateChange(isSticky);
    } else {
      this.handleUpdateDOM();
    }
  };

  on(events, callback) {
    events.forEach((evt) => {
      window.addEventListener(evt, callback, true);
    });
  }

  off(events, callback) {
    events.forEach((evt) => {
      window.removeEventListener(evt, callback, true);
    });
  }
}
