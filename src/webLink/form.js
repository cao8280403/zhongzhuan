import { Form, Icon, Input, Button, } from 'antd';
import React from 'react';
import './../App.css'

class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                window.location.replace('/sub1/key1');
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '用户名不能为空!' },
                            {
                                min:6,max:10,
                                message:'长度不在范围内!'
                            },
                            {
                                pattern:new RegExp('^\\w+$','g'),
                                message:'用户名必须为字母或者数字!'
                            }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{fontSize:20, color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '密码不能为空!' },
                            {
                                min:6,max:10,
                                message:'长度不在范围内!'
                            },
                            {
                                pattern:new RegExp('^\\w+$','g'),
                                message:'密码必须为字母或者数字!'
                            }],
                    })(
                        <Input prefix={<Icon type="lock" style={{fontSize:20, color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
                    )}
                </Form.Item>
                <Form.Item>
                    {/*{getFieldDecorator('remember', {*/}
                        {/*valuePropName: 'checked',*/}
                        {/*initialValue: true,*/}
                    {/*})(*/}
                        {/*<Checkbox>Remember me</Checkbox>*/}
                    {/*)}*/}

                    <Button type="primary" htmlType="submit" className={"myButton"}>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default WrappedNormalLoginForm;