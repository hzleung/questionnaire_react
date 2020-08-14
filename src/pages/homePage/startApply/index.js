
import React from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import styles from './index.less';

class startApply extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { user, location } = this.props;
        const { search } = location;

        let { userId = '', userType = '' } = user;

        this.props.dispatch({
            type: 'startApply/fetchApplyBpm',
            payload: { userType: userType },
            search: search,
        });

    }

    handleData = (data) =>{
        let newData = [];
        data.map((item)=>{
            let map = {};
            map.text=item.TEXT;
            map.icon=require('../../../assets/images/homePage/icon_'+item.icon+'.png');
            map.context=item.CONTEXT;
            map.processId=item.LCID;
            if(item.CONTEXT==undefined||item.CONTEXT==""||item.CONTEXT==null){
                map.context="该分类暂无描述"
            }
            newData.push(map)
        })
        return newData;
    }

    render() {

        const { user,data } = this.props;
        let newData=this.handleData(data);
        let userType = user ? user.userType : 'unknow';
        return (

            <div style={{ padding: '19px 14.5px' }}>
                <div className={styles.title}>
                选择要发起的申请
                </div>
                <div className={styles.itemBox}>
                {
                    newData && newData.length > 0 &&
                    newData.map((item, index) => {
                        return (
                            <Link
                                key={index}
                                to={{
                                    pathname:`/process/apply/${item.processId}`,
                                    query:{
                                        nav:item.text
                                    }
                                }}
                            >
                                <div className={styles.item}>
                                    <img className={styles.icon} src={item.icon} alt="" />
                                    <div className={styles.content}>
                                        <div className={styles.text}>{item.text}</div>
                                        <div className={styles.context}>{item.context}</div>
                                    </div>
                                    <img className={styles.arrow} src={require('../../../assets/images/studentSutffMobile/arrow_black.png')} alt="" />
                                </div>
                            </Link>
                        );
                    })
                }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { login,startApply } = state;
    return {
        user: login.user,
        data: startApply.data
    };
}

export default connect(mapStateToProps)(startApply);
