/*
 * @Description: 登录页面
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-11 15:47:59
 */
import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import { List, InputItem, Button, Picker, Icon } from 'antd-mobile';
import styles from './index.less';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = e => {
    const { search } = this.props.location;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let opts = {
          // userType: String(values.userType),
          username: values.username,
          password: values.password,
        };
        this.props.dispatch({
          type: 'login/fetchLogin',
          payload: opts,
          search: search,
        });
      }
    });
  };
  render() {
    const { getFieldProps, validateFields } = this.props.form;
    const { loading } = this.props;

    return (
      <div className={styles.normal}>
        <div className={styles.title}>学生工作管理系统</div>
        <div className={styles.box}>
          <List className={styles.item}>
            <InputItem
              {...getFieldProps('username', {
                rules: [{ required: true, message: '请输入用户名!' }],
              })}
              labelNumber={2}
              maxLength={20}
              placeholder="请输入用户名"
            >
              <img className={styles.input_icon} src={require('@/assets/images/person.png')} />
            </InputItem>
          </List>
          <List className={styles.item}>
            <InputItem
              {...getFieldProps('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })}
              maxLength={20}
              labelNumber={2}
              type="password"
              placeholder="请输入密码"
            >
              <img className={styles.input_icon} src={require('@/assets/images/suo.png')} alt="" />
            </InputItem>
          </List>
          <Button
            loading={loading.models.login}
            disabled={loading.models.login}
            type="primary"
            onClick={this.handleSubmit}
          >
            登录
          </Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ loading }) {
  return {
    loading,
  };
}

export default connect(mapStateToProps)(createForm()(Login));
