import React from 'react';
import { Form,Row, Col,Input, Icon,Button,Checkbox } from 'antd';
import logo from './img/logo5.jpg';
import Particles from 'reactparticles.js';
import NormalLoginForm from './form.js';

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
        };
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" style={{width:100,height:100,borderRadius:'50%'}} alt="logo" />
                    <div style={{fontSize:30,fontWeight:800,marginTop:80}}>网络链接中转系统</div>
                    <div style={{fontSize:30,fontWeight:400,marginTop:0}}>BIG&nbsp;&nbsp;&nbsp;DATA</div>
                </header>

                <Particles id="test"/>
                <div style={{marginTop:50}}>
                <div>
                    <Row>
                        <Col span={10}>
                        </Col>
                        <Col span={4}>
                            <NormalLoginForm>
                            </NormalLoginForm>
                        </Col>
                        <Col span={10}>
                        </Col>

                    </Row>

                </div>
            </div></div>


        );
    }

}
export default Footer;