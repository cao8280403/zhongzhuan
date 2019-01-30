import React from 'react';
import Head from './head';
import Footer from './footer';
import { Row, Col} from 'antd';
import AdverList from "./adverList";
import Daohang from "./daohang2";
import Chachong from "./chachong";

class zhuye extends React.Component {
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
                            <Chachong/>

                        </div>
                    </Col>
                </Row>
                <Footer/>
            </div>
        )
    }
}

export default zhuye;