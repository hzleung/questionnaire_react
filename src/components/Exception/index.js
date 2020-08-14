/*
 * @Description: 错误提示组件
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-11 15:23:18
 */
import { Button } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { createElement } from 'react';
import config from './typeConfig';

const styles = require('./index.less');

class Exception extends React.PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['403', '404', '500']),
    img: PropTypes.string,
    backText: PropTypes.string,
    redirect: PropTypes.string,
  };

  static defaultProps = {
    backText: '回到首页',
    redirect: '/',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      className,
      backText,
      linkElement = 'a',
      type,
      title,
      desc,
      img,
      actions,
      redirect,
      ...rest
    } = this.props;
    const pageType = type in config ? type : '404';
    const clsString = classNames(styles.exception, className);
    const createElementProps = {
      key: 'back-btn',
      to: redirect,
      href: redirect,
    };

    return (
      <div className={clsString} {...rest}>
        <div className={styles.imgBlock}>
          <div
            className={styles.imgEle}
            style={{ backgroundImage: `url(${img || config[pageType].img})` }}
          />
        </div>
        <div className={styles.content}>
          <h1>{title || config[pageType].title}</h1>
          <div className={styles.desc}>{desc || config[pageType].desc}</div>
          <div className={styles.actions}>
            {actions ||
              createElement(
                linkElement,
                createElementProps,
                <Button type="primary">{backText}</Button>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default Exception;
