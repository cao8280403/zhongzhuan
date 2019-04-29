import React from 'react';
import {Table,DatePicker, Switch, Input,  Popconfirm,  message, Button,  Pagination, Modal} from 'antd';
import $ from 'jquery';
import path from "./../db_config.json"
import './../App.css'
import {Link} from "react-router-dom";
import copyplugin from 'copy-to-clipboard'
const {  RangePicker } = DatePicker;
const Search = Input.Search;
const data = [];
var searchValue = '';
var editguid = '';

class AdverList extends React.Component {
    constructor(props) {
        super(props);
        this.pageChange = this.pageChange.bind(this);
        this.renderData2 = this.renderData2.bind(this);
        this.state = {
            data,
            copied: false,
            editingKey: '',
            adverId: 0,
            currentPage: 1,
            toltalrecord: 1,
            visible: false,
            modalinput1: '',
            modalinput2: '',
            modaltitle: '',
            pv:'',
            uv:''
        };
        this.columns = [
            // {
            //     title: '广告主id',
            //     dataIndex: 'id',
            //     width: '0',
            //     align: 'center',
            //     editable: true,
            //     sorter: (a, b) => a.name - b.name,
            // },
            {
                title: '名称',
                dataIndex: 'productName',
                width: '10%',
                align: 'center',
                editable: true,
                // sorter: (a, b) => {
                //     return a.name - b.name
                // },
            },
            {
                title: '链接',
                dataIndex: 'sourceWebLink',
                width: '30%',
                align: 'center',
                editable: true,
            }, {
                title: '最近访问时间',
                dataIndex: 'visitTime',
                width: '10%',
                align: 'center',
                editable: true,
            }, {
                title: '中转链接',
                dataIndex: 'newLink',
                align: 'center',
                width: '25%',
                editable: true,
                render:(text,record) => {
                    return (
                        <span onClick={()=>this.copy(record.newLink)}>{record.newLink}</span>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'state',
                align: 'center',
                width: '5%',
                editable: true,
                render: (text, record) => {
                    if (record.state == 1) {
                        return (
                            <Switch defaultChecked={true} onClick={() => this.switchclick(record.key,record.state)}/>
                        )
                    }
                    if (record.state == 0) {
                        return (
                            <Switch defaultChecked={false} onClick={() => this.switchclick(record.key,record.state)}/>
                        )
                    }
                }
            },
            {
                title: '修改',
                width: '5%',
                // textAlign: 'center',
                dataIndex: 'edit',
                render: (text, record) => {
                    return (
                        <a onClick={() => this.xiugai(record)}>修改</a>
                    );
                },
            }, {
                title: '删除',
                width: '5%',
                dataIndex: 'del',
                render: (text, record) => {
                    return (
                        this.state.data.length >= 1
                            ? (
                                <Popconfirm title="确定删除吗?"
                                            placement="left"
                                            okText="Yes" cancelText="No"
                                            onConfirm={() => this.deleteAdver(record.key)}>
                                    <a href="javascript:">删除</a>
                                </Popconfirm>
                            ) : null
                    );
                }
            }, {
                title: '',
                width: '10%',
                dataIndex: 'xiangqing',
                render: (text, record) => {
                    let canshu = 'woshicanshu';
                    canshu = record.key;
                    let jumpRouter = {
                        pathname: '/sub1/key1/liuliang',
                        state1: canshu,
                    };
                    return ( <Link to={jumpRouter}>流量统计</Link>);
                }
            }
        ];
    }


    xiugai = (record) => {
        editguid = record.id;
        this.setState({
            modaltitle: '修改链接',
            visible: true,
            modalinput1: record.productName,
            modalinput2: record.sourceWebLink
        });

    };
    copy = (e) => {
        copyplugin(e);
        message.success("复制中转链接成功");
    };

    switchclick = (key,value) => {
        var _this = this;
        $.ajax({
            type: 'post',
            async: true,
            data: {
                'guid': key,
            },
            url: path.path5 + '/weblink/switchWeblink',
            success: function (res) {
                message.success(res);
                // /调用接口刷新数据
                // _this.renderData2(searchValue);
            },
            error: function (res) {
                message.warning(res);
            }
        })

    };

    xinzeng = () => {
        editguid = '';
        this.setState({
            modaltitle: '新增链接',
            modalinput1:'',
            modalinput2:'',
            visible: true,
        });
    };
    handleOk = (e) => {
        var _this = this;
        //判断是新增还是修改
        if (_this.state.modaltitle == '新增链接') {
            $.ajax({
                type: 'post',
                async: false,
                data: {
                    'productName': _this.state.modalinput1,
                    'weblink': _this.state.modalinput2,
                },
                url: path.path5 + '/weblink/insertWeblink',
                success: function (res) {
                    message.success(res);
                    // /调用接口刷新数据
                    _this.setState({
                        visible: false,
                    });
                    _this.renderData2(searchValue);
                },
                error: function (res) {
                    message.warning(res);
                }
            })
        } else if (_this.state.modaltitle == '修改链接') {
            console.log(editguid);
            $.ajax({
                type: 'post',
                async: false,
                data: {
                    'guid': editguid,
                    'productName': _this.state.modalinput1,
                    'weblink': _this.state.modalinput2,
                },
                url: path.path5 + '/weblink/updateWeblink',
                success: function (res) {
                    message.success(res);
                    // /调用接口刷新数据
                    _this.setState({
                        visible: false,
                    });
                    _this.renderData2(searchValue);
                },
                error: function (res) {
                    message.warning(res);
                }
            })
        }

    };

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };


    input1(e) {
        this.setState({modalinput1: e.target.value});
    }

    input2(e) {
        this.setState({modalinput2: e.target.value});
    }


    deleteAdver = (key) => {
        var _this = this;
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'guid': key
            }
            ,
            url: path.path5 + '/weblink/delWeblink',
            success: function (res) {
                message.success(res);
                //调用接口刷新数据
                _this.renderData2(searchValue);
            },
            error: function (res) {
                message.warning(res);
            }
        })
    };

    timestampToTime =(timestamp) =>{
        //判断是否为空
        // console.log(timestamp);
        if(timestamp!=null) {
            let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = date.getDate() + ' ';
            let h = date.getHours() + ':';
            let m = date.getMinutes() + ':';
            let s = date.getSeconds();
            return Y + M + D + h + m + s;
        }
        else {
            return '-';
        }
    }


    //按条件查询
    renderData(value) {
        searchValue = value;
        var _this = this;
        let data2 = [];
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'productName': searchValue,
                'page': 1,
                'size': 10,
            },
            url: path.path5 + '/weblink/findAllweblink',
            success: function (res) {
                if (res.msg == 'success') {
                    let tol = res.count;
                    for (let i = 0; i < res.data.length; i++) {
                        data2.push({
                            key: res.data[i][0],
                            id: res.data[i][0],
                            productName: res.data[i][5],
                            sourceWebLink: res.data[i][3],
                            state: res.data[i][6],
                            visitTime: _this.timestampToTime(res.data[i][9]),
                            newLink: 'http://www.jrstreet.cn/webLink/transit.html?targetId=' + res.data[i][0],
                        });
                    }
                    _this.setState({data: data2, toltalrecord: tol});
                } else {
                    _this.setState({data: data2});
                }
            },
            error: function (res) {
                message.warning('error');
            }
        })
    }

    //按条件查询
    renderData2(value) {
        var _this = this;
        let data2 = [];
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'productName': value,
                'size': 10,
                'page': _this.state.currentPage
            },
            url: path.path5 + '/weblink/findAllweblink',
            success: function (res) {
                if (res.msg == 'success') {
                    let tol = res.count;
                    for (let i = 0; i < res.data.length; i++) {
                        data2.push({
                            key: res.data[i][0],
                            id: res.data[i][0],
                            productName: res.data[i][5],
                            sourceWebLink: res.data[i][3],
                            state: res.data[i][6],
                            visitTime: _this.timestampToTime(res.data[i][9]),
                            newLink: 'http://www.jrstreet.cn/webLink/transit.html?targetId=' + res.data[i][0],
                        });
                    }
                    _this.setState({data: data2, toltalrecord: tol});
                } else {
                    _this.setState({data: data2});
                }
            },
            error: function (res) {
                message.warning('error');
            }
        })
    }

    //按条件查询
    pageChange(page) {
        var _this = this;
        let data2 = [];
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'productName': '',
                'size': 10,
                'page': page,
            },
            url: path.path5 + '/weblink/findAllweblink',
            success: function (res) {
                if (res.msg == 'success') {
                    let tol = res.count;
                    for (let i = 0; i < res.data.length; i++) {
                        data2.push({
                            key: res.data[i][0],
                            id: res.data[i][0],
                            productName: res.data[i][5],
                            sourceWebLink: res.data[i][3],
                            state: res.data[i][6],
                            visitTime: _this.timestampToTime(res.data[i][9]),
                            newLink: 'http://www.jrstreet.cn/webLink/transit.html?targetId=' + res.data[i][0],
                        });
                    }
                    _this.setState({data: data2, currentPage: page, toltalrecord: tol});
                } else {
                    _this.setState({data: data2});
                }
            },
            error: function (res) {
                message.warning('error');
            }
        })
    }

    componentWillMount() {
        this.renderData2('');
    }

    clearSearch = () => {
        this.renderData2('');
    };

    datePickerChange =(date, dateString)=> {
        var _this = this;
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'begin': dateString[0],
                'end': dateString[1],
            },
            url: path.path5 + '/weblink/findPVUV',
            success: function (res) {
                if (res.msg=='success'){
                   _this.setState({pv:res.data[0][0],uv: res.data[0][1]}) ;
                }
            },
            error: function (e) {
                message.warning('error');
            }
        });



    };


    render() {
        return (
            <div>
                {/*<div style={{marginLeft: 20, marginTop: 20, fontSize: 18, fontWeight: "bold", color: "#330033"}}>广告主列表*/}
                {/*</div>*/}
                <div style={{marginBottom: 16, marginTop: 20, marginLeft: 40}}>
                    <Search
                        style={{width: 200}}
                        placeholder="输入产品名称查询"
                        onSearch={value => this.renderData(value)}
                        enterButton/>
                    <Button ghost={false} onClick={this.clearSearch} type="primary"
                            style={{marginLeft: 40}}>显示全部</Button>
                    <Button ghost={false} onClick={this.xinzeng} type="primary" style={{marginLeft: 40}}>新增</Button>
                    <RangePicker onChange={this.datePickerChange} placeholder={['开始时间','结束时间']} style={{marginLeft: 40}}/>
                    <span style={{marginLeft: 40}}>PV：</span>{this.state.pv}
                    <span style={{marginLeft: 40}}>UV：</span>{this.state.uv}
                </div>
                <Modal
                    bodyStyle={{width: 500, height: 250}}
                    centered={true}
                    maskClosable={false}
                    title={this.state.modaltitle}
                    okText={'确定'}
                    cancelText={'取消'}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div>
                        <span>名称：</span>
                        <Input onChange={(e) => this.input1(e)} value={this.state.modalinput1} placeholder=""
                               style={{width: 350, marginLeft: 40}}/>
                    </div>
                    <div style={{marginTop: 20}}>
                        <span>链接：</span>
                        <Input onChange={(e) => this.input2(e)} value={this.state.modalinput2} placeholder=""
                               style={{width: 350, marginLeft: 40}}/>
                    </div>
                </Modal>
                <Table
                    // id={'mytable'}
                    // components={components}
                    bordered={true}
                    dataSource={this.state.data}
                    columns={this.columns}
                    rowClassName="editable-row"
                    pagination={false}
                    // pagination={{pageSize: 15,style:{float:'left',marginLeft:500}}}
                />
                <div style={{textAlign: 'center'}}>
                    <Pagination pageSize={10}
                                style={{marginLeft: 'auto', marginTop: 20, marginRight: 'auto', width: '660px'}}
                                current={this.state.currentPage} onChange={this.pageChange}
                                total={this.state.toltalrecord}/>
                </div>
            </div>
        );
    }
}

export default AdverList;
