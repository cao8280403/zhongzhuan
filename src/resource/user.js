import React from 'react';
import Head from './head';
import Footer from './footer';
import { Row, Col} from 'antd';
import UserList from "./userList";
import Daohang from "./menu";

let msg = '';
class User extends React.Component {
    constructor(props){
        super(props);
        this.state={
            productId:"我是父组件传来的"
        };
        //获取路由传递过来的参数,产品id
         msg = this.props.location.pathname;
         msg = msg.substring(6);
    }

    //绑定之前打印出来是现在的，说明还未改变值
    componentWillMount() {
        this.setState({productId:msg});
    }

    //绑定之后打印出来是修改后的值
    componentDidMount() {
    }


    render() {
        return (
            <div>
                <Head/>
                <Row style={{height:730}}>
                    <Col span={4}>
                        <Daohang/>
                    </Col>
                    <Col span={20} style={{backgroundColor: '#ffffff' }}>
                        <div style={{backgroundColor: '#ffffff' }}>
                            <UserList msg={this.state.productId}/>
                        </div>
                    </Col>
                </Row>
                <Footer/>
            </div>
        )
    }
}

export default User;