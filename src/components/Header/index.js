/*
 * @Description: 头部组件
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-14 15:10:15
 */
import React from 'react';
import router from 'umi/router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavBar, Icon } from 'antd-mobile';
import debounce from 'lodash/debounce';
import './index.less';
import { scrollTo } from '@/utils/utils';
import { ReactComponent as Home } from '@/assets/svg/home.svg';

export default class Header extends React.Component {
  static propTypes = {
    hideBack: PropTypes.bool,
    hideHome: PropTypes.bool,
    fixedHeader: PropTypes.bool,
    autoHide: PropTypes.bool,
    title: PropTypes.string,
    goTop: PropTypes.bool,
    timeout: PropTypes.number,
  };

  static defaultProps = {
    hideBack: false, // 隐藏返回按钮
    hideHome: false, // 隐藏home按钮
    fixedHeader: true, // 是否固定头部
    autoHide: false, // 是否跟随滚动自动隐藏头部
    title: '首页', // 标题
    goTop: true, // 是否长按头部标题回顶
    timeout: 800, // 回顶延迟
  };

  constructor(props) {
    super(props);
  }
  state = {
    open: true,
  };
  onScroll;
  componentDidMount() {
    this.props.autoHide && this.scroll(this.autoHideHeader);
  }

  componentWillUnmount() {
    const { autoHide } = this.props;
    this.props.autoHide && window.removeEventListener('scroll', this.onScroll);
  }

  // 根据滚动设置状态
  autoHideHeader = direction => {
    const { open } = this.state;
    if (direction === 'down' && open) {
      this.setState({
        open: false,
      });
    } else if (direction === 'up' && !open) {
      this.setState({
        open: true,
      });
    }
  };

  // 滚动自动隐藏头部
  scroll = (fn = Function.prototype) => {
    let beforeScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    this.onScroll = debounce(() => {
      const afterScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const delta = afterScrollTop - beforeScrollTop;

      if (delta === 0) return false;

      const direction = delta > 0 ? 'down' : 'up';

      //向下要超过160px才触发
      if (direction === 'down' && afterScrollTop < 160) return false;

      //向上滚动距离要超过320px才触发，到顶必定触发
      if (direction === 'up' && Math.abs(delta) < 320 && afterScrollTop !== 0) return false;

      fn(direction);
      beforeScrollTop = afterScrollTop;
    }, 50);

    window.addEventListener('scroll', this.onScroll, false);
  };

  goBack = () => {
    router.goBack();
  };

  goHome = () => {
    router.push('/');
  };

  onTouchStart = () => {
    const { timeout } = this.props;
    this.timeOutEvent = setTimeout(function() {
      this.timeOutEvent = 0;
      scrollTo(0);
    }, timeout);
  };

  onTouchMove = () => {
    clearTimeout(this.timeOutEvent);
    this.timeOutEvent = 0;
  };

  onTouchEnd = () => {
    clearTimeout(this.timeOutEvent);
    if (this.timeOutEvent != 0) {
    }
    return false;
  };

  render() {
    const {
      location,
      fixedHeader,
      goTop,
      title,
      hideBack = false,
      hideHome = false,
      leftContent,
      rightContent,
    } = this.props;

    const { open } = this.state;

    // 长按回顶
    let touchProps = goTop
      ? {
          onTouchStart: this.onTouchStart,
          onTouchMove: this.onTouchMove,
          onTouchEnd: this.onTouchEnd,
        }
      : {};

    return (
      <div className="page-header">
        <div
          className={classNames('page-header-navbar', {
            'page-header-fixed': fixedHeader,
            'page-header-fixed-open': open,
          })}
        >
          <NavBar
            leftContent={
              hideBack ? null : leftContent || <Icon type="left" color={'#000'} onClick={this.goBack} />
            }
            rightContent={hideHome ? null : rightContent || <Home onClick={this.goHome} />}
          >
            <div {...touchProps} style={{color:'#000'}}>{title}</div>
          </NavBar>
        </div>
      </div>
    );
  }
}
