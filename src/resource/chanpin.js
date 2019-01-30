import React from 'react';
import Head from './head';
import Footer from './footer';
import { Row, Col} from 'antd';
import ProductList from "./productList";
import Daohang from "./daohang";

let msg = '';
class Chanpin extends React.Component {
    constructor(props){
        super(props);
        this.state={
            adverId:"我是父组件传来的"
        };
        //获取路由传递过来的参数,广告主id
         msg = this.props.location.state1;
         console.log(msg);
    }

    //绑定之前打印出来是现在的，说明还未改变值
    componentWillMount() {
        this.setState({adverId:msg});
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
                            <ProductList msg={this.state.adverId}/>
                        </div>
                    </Col>
                </Row>
                <Footer/>
            </div>
        )
    }
}

export default Chanpin;