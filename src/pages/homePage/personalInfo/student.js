import React from 'react';
import { List } from 'antd-mobile';
import styles from './index.less';

const Item = List.Item;

const student = ({ userInfo = {} }) => {

    userInfo = userInfo ? userInfo : {};

    return (
        <React.Fragment>
            <style>
                {
                    `
                        .my-list .am-list-extra {
                            -webkit-flex-basis: 50% !important;
                            -ms-flex-preferred-size: 50% !important;
                            flex-basis: 50% !important;
                        }
                    `
                }
            </style>
            <List className="my-list" renderHeader={' '}>
                <Item extra={userInfo.XM} multipleLine >姓名</Item>
                <Item extra={userInfo.XB} multipleLine >性别</Item>
                <Item extra={userInfo.XH} multipleLine >学号</Item>
                <Item extra={userInfo.BMMC} multipleLine >学院</Item>
                <Item extra={userInfo.ZYMC} multipleLine >专业</Item>
                <Item extra={userInfo.BJMC} multipleLine >班级</Item>
            </List>
            {/* <div className={styles.itemBlock}>

                <div className={styles.itemBox}>
                    <div className={styles.item}>
                        <div className={styles.type}>姓名</div>
                        <div className={styles.content}>{userInfo.XM}</div>
                    </div>
                    <div className={styles.scale}></div>
                </div>
                <div className={styles.itemBox}>
                    <div className={styles.item}>
                        <div className={styles.type}>性别</div>
                        <div className={styles.content}>{userInfo.XB}</div>
                    </div>
                    <div className={styles.scale}></div>
                </div>
                <div className={styles.itemBox}>
                    <div className={styles.item}>
                        <div className={styles.type}>学号</div>
                        <div className={styles.content}>{userInfo.XH}</div>
                    </div>
                    <div className={styles.scale}></div>
                </div>
                <div className={styles.itemBox}>
                    <div className={styles.item}>
                        <div className={styles.type}>学院</div>
                        <div className={styles.content}>{userInfo.BMMC}</div>
                    </div>
                    <div className={styles.scale}></div>
                </div>
                <div className={styles.itemBox}>
                    <div className={styles.item}>
                        <div className={styles.type}>专业</div>
                        <div className={styles.content}>{userInfo.ZYMC}</div>
                    </div>
                    <div className={styles.scale}></div>
                </div>
                <div className={styles.itemBox}>
                    <div className={styles.item}>
                        <div className={styles.type}>班级</div>
                        <div className={styles.content}>{userInfo.BJMC}</div>
                    </div>
                    <div className={styles.scale}></div>
                </div>
            </div> */}
        </React.Fragment>
    );
};

export default student;