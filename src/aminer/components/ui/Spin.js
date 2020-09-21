import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'acore';
import { classnames } from 'utils';
import styles from './Spin.less';

// TODO refactor
@connect()
class Spin extends PureComponent {
  constructor(props) {
    super(props);
    this.nomask = props.nomask;
    this.type = props.type || 'blur'; // blur, dark, light
    this.div = null;
    this.timer = null;
  }

  componentDidMount = () => {
    const { loading } = this.props;
    this.toggleLoading(loading);
  };

  componentWillUpdate(nextProps) {
    this.toggleLoading(nextProps.loading);
  }

  toggleLoading = loading => {
    const { time = 200 } = this.props;
    if (!loading) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      } else {
        this.update(loading);
      }
    } else {
      this.timer = setTimeout(() => {
        this.timer = null;
        this.update(loading);
      }, time)
    }
  }

  update = loading => {
    const { size, top, minHeight, withText } = this.props;
    if (!this.nomask) {
      const me = ReactDOM.findDOMNode(this);
      if (me) {
        // window.me = me;
        const parent = me.parentElement;
        // if(minHeight) {
        parent.style.minHeight = minHeight || '100px';
        // }
        const containerDOM = parent.parentElement;
        const { position } = containerDOM.style;
        if (!position) {
          containerDOM.style.position = 'relative';
        }
        if (this.div) {
          this.div.style.height = `${parent.clientHeight}px`;
          this.div.style.width = `${parent.clientWidth}px`;
          this.div.style.top = `${parent.offsetTop}px`;
          this.div.style.left = `${parent.offsetLeft}px`;
        }
        if (!this.div) {
          this.div = document.createElement('div');
          this.div.style.position = 'absolute';
          this.div.style.width = `${parent.clientWidth}px`;
          this.div.style.height = `${parent.clientHeight}px`;
          this.div.style.textAlign = 'center';
          this.div.style.paddingTop = top || '80px';
          this.div.style.top = `${parent.offsetTop}px`;
          this.div.style.left = `${parent.offsetLeft}px`;
          containerDOM.appendChild(this.div);
          ReactDOM.render(<Loading size={size} withText={withText} />, this.div);
        }
        if (loading) {
          this.div.style.display = 'block';
        } else {
          this.div.style.display = 'none';
        }

        if (parent) {
          this.height = parent.offsetHeight;
          this.width = parent.offsetWidth;
          const parentClassName = `parentSpin_${this.type}`;
          if (loading) {
            if (parent.className.indexOf(parentClassName) < 0) {
              parent.className += ` ${parentClassName}`;
            }
          } else {
            parent.className = parent.className.replace(parentClassName, '');
          }
        }
      }
    }
  };

  render() {
    return (
      <div />
    );
  }
}

export default Spin;

const Loading = props => {
  const { size, withText } = props;
  return (
    <>
      {!withText && (
        <div className={classnames(styles.loading, { [styles[size]]: size })}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )}
      {withText && (
        <span className={styles.loadingText}>Loading...</span>
      )}
    </>
  )
}
