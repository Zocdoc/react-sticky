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

  propKeys = null;
  state = {};

  componentDidMount() {
    this.channel = this.context['sticky-channel'];
    this.channel.subscribe(this.updateContext);

    this.on(monitoredEventNames, this.recomputeState);
    this.recomputeState();

    this.propKeys = Object.keys(this.props);
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
    const state = this.state;
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
  }

  componentDidUpdate() {
    this.propKeys = Object.keys(this.props);
  }

  componentWillUnmount() {
    this.off(monitoredEventNames, this.recomputeState);
    this.channel.unsubscribe(this.updateContext);
  }

  /*
   * The special sauce.
   */
  render() {
    const placeholderStyle = { paddingBottom: 0 };
    let className = this.props.className;

    // To ensure that this component becomes sticky immediately on mobile devices instead
    // of disappearing until the scroll event completes, we add `transform: translateZ(0)`
    // to 'kick' rendering of this element to the GPU
    // @see http://stackoverflow.com/questions/32875046
    let style = { transform: 'translateZ(0)', ...this.props.style };

    if (this.state.isSticky) {
      const stickyStyle = {
        position: 'fixed',
        top: this.state.containerOffset,
        left: this.state.xOffset,
        width: this.state.width
      };

      const bottomLimit = this.state.distanceFromBottom - this.state.height - this.props.bottomOffset;
      if (this.state.containerOffset > bottomLimit) {
        stickyStyle.top = bottomLimit;
      }

      placeholderStyle.paddingBottom = this.state.height + this.props.topOffset;

      className += ` ${this.props.stickyClassName}`;
      style = {...style, ...stickyStyle, ...this.props.stickyStyle};
    }

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
        <div ref="placeholder" style={placeholderStyle}></div>
        <div {...props} ref="children" className={className} style={style}>
          {this.props.children}
        </div>
      </div>
    );
  }

  getXOffset() {
    return this.refs.placeholder.getBoundingClientRect().left;
  }

  getWidth() {
    return this.refs.placeholder.getBoundingClientRect().width;
  }

  getHeight() {
    return ReactDOM.findDOMNode(this.refs.children).getBoundingClientRect().height;
  }

  getDistanceFromTop() {
    return this.refs.placeholder.getBoundingClientRect().top;
  }

  getDistanceFromBottom() {
    if (!this.containerNode) return 0;
    return this.containerNode.getBoundingClientRect().bottom;
  }

  isSticky() {
    if (!this.props.isActive) return false;

    const fromTop = this.getDistanceFromTop();
    const fromBottom = this.getDistanceFromBottom();

    const topBreakpoint = this.state.containerOffset - this.props.topOffset;
    const bottomBreakpoint = this.state.containerOffset + this.props.bottomOffset;

    return fromTop <= topBreakpoint && fromBottom >= bottomBreakpoint;
  }

  updateContext = ({ inherited, node }) => {
    this.containerNode = node;
    this.setState({
      containerOffset: inherited,
      distanceFromBottom: this.getDistanceFromBottom()
    });
  };

  recomputeState = () => {
    const isSticky = this.isSticky();
    const height = this.getHeight();
    const width = this.getWidth();
    const xOffset = this.getXOffset();
    const distanceFromBottom = this.getDistanceFromBottom();
    const hasChanged = this.state.isSticky !== isSticky;

    this.setState({ isSticky, height, width, xOffset, distanceFromBottom });

    if (hasChanged) {
      if (this.channel) {
        this.channel.update((data) => {
          data.offset = (isSticky ? height : 0);
        });
      }

      this.props.onStickyStateChange(isSticky);
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
