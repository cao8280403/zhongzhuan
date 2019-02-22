import { Menu, Icon } from 'antd';
import React from 'react';
import {Link} from 'react-router-dom';
import './../App.css';

const SubMenu = Menu.SubMenu;

class Daohang extends React.Component {

    constructor(props){
        super(props);
        //获得路由
        this.state.pathurl = window.location.pathname;
        //解析出一级菜单和二级菜单
        const pathlength = this.state.pathurl.split('/').length;
        //如果等于3，打开的是二级菜单
        if (pathlength==3){
            this.state.sub = '/'+this.state.pathurl.split('/')[1];
            this.state.key = '/'+this.state.pathurl.split('/')[2];
        }
        if (pathlength==2){
            this.state.sub = '/'+this.state.pathurl.split('/')[1];
            this.state.key = '/'+this.state.pathurl.split('/')[1];
        }
    }

    state = {
        //是否缩略图显示
        collapsed: false,
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    // 菜单点击事件
    // onclickmenu = (item) => {
    //     let newpath = '';
    //     //遍历keypath，获取需要跳转的路由
    //     for (let i=item.keyPath.length-1;i>=0;i--){
    //         newpath += item.keyPath[i];
    //     }
    //     //如果是同一路由，则不操作
    //     if(newpath!=this.state.pathurl) {
    //         window.location.href = newpath;
    //         // this.props.history.push(newpath);
    //     }
    // };

    componentDidMount(){

    }

    render() {
        const key1 = '/key1';
        const sub1 = `/sub1`;
        const key2 = '/key2';
        const key3 = '/key3';
        const key4 = '/key4';
        const key5 = '/key5';
        const key6 = '/key6';
        // const pathName = hashHistory.getCurrentLocation().pathname;
        return (
            <div style={{ height: 980,backgroundColor:'#223344'}}>
                {/*<Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>*/}
                    {/*<Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />*/}
                {/*</Button>*/}
                <Menu
                    defaultSelectedKeys={[this.state.key]}
                    defaultOpenKeys={[this.state.sub]}
                    mode="inline"
                    theme="dark"
                    // onClick={this.onclickmenu}
                    inlineCollapsed={this.state.collapsed}
                >

                    <SubMenu key={sub1} title={<span><Icon type="pie-chart" /><span>网络链接管理</span></span>}>
                        <Menu.Item key={key1}> <Link to={sub1+key1} className={"myLink"}>概览</Link></Menu.Item>
                        <Menu.Item key={key2}> <Link to={sub1+key2} className={"myLink"}>地图</Link></Menu.Item>
                        <Menu.Item key={key3}> <Link to={sub1+key3} className={"myLink"}>编辑器</Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key={key4}>
                        <Link to={key4} className={"myLink"}>
                        <Icon type="desktop" />
                            <span>文件管理</span></Link>
                    </Menu.Item>
                    <Menu.Item key={key5}>
                        <Link to={key5}className={"myLink"}>
                        <Icon type="inbox" />
                            <span>我的信息</span></Link>
                    </Menu.Item>
                    <Menu.Item key={key6}>
                        <Link to={key6}className={"myLink"}>
                        <Icon type="setting" />
                            <span>系统设置</span></Link>
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}

export default Daohang;