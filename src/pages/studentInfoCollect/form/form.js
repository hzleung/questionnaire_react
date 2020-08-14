import React,{Fragment} from 'react';
import { NHDynamicFormShow,NHFetch } from 'xgui-mobile-for-react';
import {Toast} from 'antd-mobile';
import router from 'umi/router';
import styles from "./index.less";
import { updateCjzt } from '@/services/api'



/**
 * 信息采集表单
 * @author zhouzhongkai
 * @date 2020-05-14
 */
class Form extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            model:'view' ,
        }
    }

    componentWillMount (){
        const {match:{params:{cjzt}}}= this.props
        let flag = cjzt === '1'?'view':'edit'
        this.setState({model:flag})
    }

    render(){
        const {match:{params:{dtbdid,xsid}}}= this.props
        return(
            <div>
                <div >            
                <NHDynamicFormShow
                    formId={dtbdid}
                        border={false}
                        objId={xsid}
                        showType={"2"}
                        model={this.state.model}
                        ref={'nhDynamicFormShow'}
                    />
                 {   
                 this.state.model === 'edit'?     
                    <div onClick={this.save}  className={styles.botton}>保存</div>  : null}
                </div>  
           </div>
            
        ) 
    }

    // 保存表单
    save = () => {
        this.refs.nhDynamicFormShow.saveAllInfo(() => {
            this.updateTxzt();
        });
    }

    //把填写记录的状态修改为1
    updateTxzt() {
        const {match:{params:{txid}}}= this.props
        const params = {pkid:txid }
        updateCjzt(params).then(res => {
            if(res.code ===200){
                Toast.success(("保存成功!"),1,() => {
                    router.goBack();
                });                
            }else{
                Toast.fail("保存失败!");
            }
        })

    }
   

}
export default Form;