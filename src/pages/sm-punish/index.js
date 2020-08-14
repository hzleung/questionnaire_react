
import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import StudentPage from './student/index';
import TeacherPage from './teacher/index';

/**
 * 请假管理
 * @author: liuzicheng
 * @date: 2020-05-06 15:52:51
 */
class Punish extends React.Component {

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
     * @memberof Punish
     */
    renderPage = (userType) =>{

        userType = userType ? userType : '';

        switch (userType) {
            case 'student':
                router.push('/sm-punish/student');
                break;

            case 'teacher':

                router.push('/sm-punish/teacher');
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

export default connect(mapStateToProps)(Punish);