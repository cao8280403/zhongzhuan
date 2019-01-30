import React from 'react';

class Footer extends React.Component {
    render () {
        return (
            <div style={{backgroundColor: '#E6E6FA', textAlign: 'center', color: '#000000', height: 100}}>
                <div style={{paddingTop: 20}}>Copyright©2018 且行且歌查询系统 |
                    苏ICP备16010824号-2(南通且行且歌计算机技术有限公司版权所有)
                </div>
                <div>友情提示：内部管理查询系统，大数据综合管理</div>
                <div>金融CPS、金融CPA、CPA推广、CPS推广、理财超市、金融超市</div>
            </div>
        )
    }

}
export default Footer;