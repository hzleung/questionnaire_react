
import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import StudentPage from './student/index';
import TeacherPage from './teacher/index';

/**
 * 请假管理
 * ! 此文件废弃，已不再起作用，后续可能会删除
 * @author: zengxiangkai
 * @date: 2020-04-17 16:04:56
 */
class Holiday extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { user } = this.props;
        let userType = user ? user.userType : '';
        this.renderPage(userType);
    }

    /**
     * * 根据不同的用户类型跳转到不同页面
     *
     * @memberof Holiday
     */
    renderPage = (userType) =>{

        userType = userType ? userType : '';

        switch (userType) {
            case 'student':
                router.push('/sm-holiday/student');
                break;

            case 'teacher':

                router.push('/sm-holiday/teacher');
                break;

            default:

                router.push('/homePage');
                break;
                
        }

    }

    render() {
        return null;
    }
}

function mapStateToProps(state) {
    const { login } = state;
    return {
        user: login.user,
    };
}

export default connect(mapStateToProps)(Holiday);