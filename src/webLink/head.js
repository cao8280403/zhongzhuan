import React from 'react';
import pic1 from './img/pic1.png';

class Head extends React.Component {
    render () {
        return (
            <div style={{backgroundColor: '#233344', height: 64, textAlign: 'center'}}>
                <div style={{paddingTop: 22}}>

                    <img style={{width: 31,height:19,float:'left',marginLeft:22,paddingTop:2}} src={pic1}/>
                    <div style={{fontSize: 18, color: '#FFFFFF',textAlign: 'left',letterSpacing:4,paddingLeft:63}}>网络链接中转系统</div>
                </div>
            </div>
        )
    }

}
export default Head;