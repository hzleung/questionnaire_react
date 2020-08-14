
import React from 'react';
import { connect } from 'dva';
import StudentForm from './student';
import TeacherForm from './teacher';

import styles from './index.less';


/**
 * 首页-个人信息
 * @author: zengxiangkai
 * @date: 2020-04-13 13:53:54
 */
class PersonalInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { user, location } = this.props;
        const { search } = location;

        let { userId = '', userType = '' } = user;

        if (userType === 'student') {
            this.props.dispatch({
                type: 'personalInfo/fetchStudentInfo',
                payload: { yhbh: userId },
                search: search,
            });
        } else {
            this.props.dispatch({
                type: 'personalInfo/fetchTeacherInfo',
                payload: { yhbh: userId },
                search: search,
            });
        }

    }

    render() {

        const { user, userInfo } = this.props;

        let userType = user ? user.userType : 'unknow';

        return (
            <React.Fragment>
                {
                    userType === 'student' ?
                        <StudentForm userInfo={userInfo} />
                        :
                        <TeacherForm userInfo={userInfo} />
                }
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { login, personalInfo } = state;
    return {
        user: login.user,
        userInfo: personalInfo.userInfo,
    };
}

export default connect(mapStateToProps)(PersonalInfo);