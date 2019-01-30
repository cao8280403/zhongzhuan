import React from 'react';
import Head from './head';
import { Row, Col} from 'antd';
import AdverList from "./adverList";
import Daohang from "./menu";
import { BrowserRouter as Router,Route} from 'react-router-dom';

class zhuye extends React.Component {
    render() {
        return (
            <div>
                <Head/>
                <Row style={{height:'100%'}}>
                    <Col span={3}>
                        <Router>
                            <Route component={() =>(<Daohang/>)}/>
                        </Router>
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