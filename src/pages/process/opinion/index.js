
import React from 'react';
import styles from "./index.less";
const doing = require('@/assets/images/studentSutffMobile/common/doing_icon.png'),
success = require('@/assets/images/studentSutffMobile/common/succeed_icon.png');
export default function Opinion(props){
    if (!props.list || props.list.length < 1) return null;
    return (
        props.list.map((item,index) => {
            return (
                <div key={item.DOCUNID} className={styles.statusBox}>
                    <div className={styles.title}>

                        {index == props.list.length - 1 ?
                            <img src={doing} alt="" />
                            :
                            <img src={success} alt="" />}
                        <div>{item.ENDTIME}</div>
                    </div>

                    <div className={styles.contentBox}>
                        {index != props.list.length - 1 ?
                            <div className={styles.scale} />
                            :

                            <div className={styles.scale_1} />
                        }
                        <div className={styles.content}>
                            {item.NODENAME && <div className={styles.text}>{item.NODENAME}</div>}
                            {item.USERNAME && <div className={styles.grayText}>{item.USERNAME}</div>}
                            {item.REMARK && <div className={styles.statusText}>{item.REMARK}</div>}
                        </div>
                    </div>
                </div>
            );
        })
    );
}
