import React from 'react';
import { connect } from 'dva';
import { NHDynamicFormShow } from 'xgui-mobile-for-react';

class StudentInfo extends React.Component {

    render() {
        const { location:{ query:{ xsid } } } = this.props;
        return (
            <div>
                <NHDynamicFormShow
                    formId={'xsxxbdsj'}
                    isShowNav={false}
                    border={false}
                    objId={xsid}
                    model={'view'}
                />
            </div>
        );
    }

}

export default connect((state) => {
    return { ...state.studentRoster };
})(StudentInfo);
