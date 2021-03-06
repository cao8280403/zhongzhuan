import React from 'react';
import {Menu, Icon, Button} from 'antd';
import {Link} from "react-router-dom";
const SubMenu = Menu.SubMenu;

class Daohang extends React.Component {
    state = {
        collapsed: false,
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return (
            <div>
                        <div>
                            <Button type="primary" onClick={this.toggleCollapsed} style={{marginBottom: 16,display:'none'}}>
                                <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}/>
                            </Button>
                            <Menu
                                defaultSelectedKeys={['2']}
                                defaultOpenKeys={['sub1']}
                                mode="inline"
                                //theme="dark"
                                theme="light"
                                inlineCollapsed={this.state.collapsed}
                            >
                                <Menu.Item key="1">
                                    <Link to="/" className={"myLink"}/>
                                    <Icon type="pie-chart"/>系统管理
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link to="/chachongye" className={"myLink"}/>
                                    <Icon type="eye"/>用户查重
                                </Menu.Item>
                               {/* <Menu.Item key="3">
                                    <Icon type="inbox"/>
                                    <span>Option 3</span>
                                </Menu.Item>
                                <SubMenu key="sub1"
                                         title={<span><Icon type="appstore"/><span>Navigation One</span></span>}>
                                    <Menu.Item key="5">Option 5</Menu.Item>
                                    <Menu.Item key="6">Option 6</Menu.Item>
                                    <Menu.Item key="7">Option 7</Menu.Item>
                                    <Menu.Item key="8">Option 8</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub2"
                                         title={<span><Icon type="appstore"/><span>Navigation Two</span></span>}>
                                    <Menu.Item key="9">Option 9</Menu.Item>
                                    <Menu.Item key="10">Option 10</Menu.Item>
                                    <SubMenu key="sub3" title="Submenu">
                                        <Menu.Item key="11">Option 11</Menu.Item>
                                        <Menu.Item key="12">Option 12</Menu.Item>
                                    </SubMenu>
                                </SubMenu>*/}
                            </Menu>
                        </div>
            </div>
        );
    }
}

export default Daohang;