import React from 'react';
import Head from './head';
import { Row, Col} from 'antd';
import Daohang from "./menu";

class zhuye extends React.Component {
    render() {
        return (
            <div>
                <Head/>
                <Row style={{height:'100%'}}>
                    <Col span={3}>
                        <Daohang/>
                    </Col>
                    <Col span={21} style={{backgroundColor: '#ffffff' }}>
                        <div style={{backgroundColor: '#ffffff' }}>
                            {this.props.children}

                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default zhuye;