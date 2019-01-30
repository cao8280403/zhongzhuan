import { Menu, Icon, Button } from 'antd';
import React from 'react';

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

        console.log(pathlength);
        console.log(this.state.sub);
        console.log(this.state.key);
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
    onclickmenu = (item) => {
        // this.props.dispatch(clearGformCache2({}));
        // hashHistory.push(`/chanpin`);
        console.log(item);
        console.log(item.key);
        console.log(item.keyPath);
        //如果是同一路由，则不操作
        if(item.key!=this.state.pathurl) {
            window.location.href = item.key;
        }
    };

    componentDidMount(){

    }

    render() {
        const key1 = '/zhuye';
        const sub1 = `/sub1`;
        const key2 = '/chachongye'
        const key3 = '/user/:productId'
        const key4 = 'key4'
        const key5 = 'editor'
        const key6 = 'key6'
        // const pathName = hashHistory.getCurrentLocation().pathname;
        return (
            <div style={{ height: 880,backgroundColor:'#223344'}}>
                {/*<Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>*/}
                    {/*<Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />*/}
                {/*</Button>*/}
                <Menu
                    defaultSelectedKeys={[this.state.key]}
                    defaultOpenKeys={[this.state.sub]}
                    mode="inline"
                    theme="dark"
                    onClick={this.onclickmenu}
                    inlineCollapsed={this.state.collapsed}
                >

                    <SubMenu key={sub1} title={<span><Icon type="pie-chart" /><span>网络链接管理</span></span>}>
                        <Menu.Item key={key1}>概览</Menu.Item>
                        <Menu.Item key={key2}>图表</Menu.Item>
                        <Menu.Item key={key3}>编辑器</Menu.Item>
                    </SubMenu>
                    <Menu.Item key={key4}>
                        <Icon type="desktop" />
                        <span>文件管理</span>
                    </Menu.Item>
                    <Menu.Item key={key5}>

                        <Icon type="inbox" />
                        <span>我的信息</span>
                    </Menu.Item>
                    <Menu.Item key={key6}>
                        <Icon type="setting" />
                        <span>系统设置</span>
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}

export default Daohang;