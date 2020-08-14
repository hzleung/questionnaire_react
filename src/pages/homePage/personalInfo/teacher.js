import React from 'react';
import { List } from 'antd-mobile';
import styles from './index.less';

const Item = List.Item;
const Brief = Item.Brief;

const teacher = ({ userInfo = {} }) => {

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
                <Item extra={userInfo.GH} multipleLine >工号</Item>
                <Item extra={userInfo.BMMC} multipleLine >部门</Item>
                <Item extra={userInfo.ZWXX} multipleLine >职务</Item>
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
                        <div className={styles.type}>工号</div>
                        <div className={styles.content}>{userInfo.GH}</div>
                    </div>
                    <div className={styles.scale}></div>
                </div>
                <div className={styles.itemBox}>
                    <div className={styles.item}>
                        <div className={styles.type}>部门</div>
                        <div className={styles.content}>{userInfo.BMMC}</div>
                    </div>
                    <div className={styles.scale}></div>
                </div>
                <div className={styles.itemBox}>
                    <div className={styles.item}>
                        <div className={styles.type}>职务</div>
                        <div className={styles.content}>{userInfo.ZWXX}</div>
                    </div>
                    <div className={styles.scale}></div>
                </div>
            </div> */}
        </React.Fragment>
    );
};

export default teacher;