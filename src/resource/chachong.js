import React from 'react';
import {Table, DatePicker, Col, Input, Pagination, Button, Row, message, Form} from 'antd';
import path from "./../db_config.json"
// import ExportJsonExcel from 'js-export-excel'
const Search = Input.Search;
const data = [];
const $ = require("myjquery");

class Chachong extends React.Component {
    constructor(props) {
        super(props);
        this.pageChange = this.pageChange.bind(this);
        this.setSearch = this.setSearch.bind(this);
        this.setSearch2 = this.setSearch2.bind(this);
        this.downloadExcel = this.downloadExcel.bind(this);
        this.state = {data, currentPage: 1, toltalrecord: 1, search_date: '', search_telephone: ''};
        this.columns = [
            {
                title: '手机号码',
                dataIndex: 'user_telephone',
                align: 'center',
                width: '20%',
                editable: true,
                // sorter: (a, b) => a.user_telephone - b.user_telephone,
                render: (text, record) => {
                    if ("red" == record.color) {
                        return (
                            <span style={{color: "red"}}>{record.user_telephone}</span>
                        );
                    } else if ("yellow" == record.color) {
                        return (
                            <span style={{color: "#188fd5"}}>{record.user_telephone}</span>
                        );
                    } else {
                        return (
                            <span>{record.user_telephone}</span>
                        );
                    }
                }
            },
            {
                title: '购买产品名称',
                dataIndex: 'productname',
                width: '20%',
                align: 'center',
                editable: true,
                // sorter: (a, b) => a.productname - b.productname,
            },
            {
                title: '所属广告主',
                dataIndex: 'advername',
                align: 'center',
                width: '20%',
                editable: true,
                // sorter: (a, b) => a.advername - b.advername,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                align: 'center',
                width: '20%',
                editable: true,
            }
        ];
    }

    // gettel(e) {
    //     let value = e.target.value;
    //     this.setState({telephone: value});
    // }

    getValidationState() {
        const length = this.state.telephone.length;
        if (length == 0) {
            message.warn('请输入手机号码！');
            return 'error';
        }
        else if (length != 11) {
            message.warn('请输入有效的手机号！');
            return 'error';
        }
        else {
            const PATTERN_CHINAMOBILE = /^1(3[4-9]|5[012789]|8[23478]|4[7]|7[8])\d{8}$/; //移动号
            const PATTERN_CHINAUNICOM = /^1(3[0-2]|5[56]|8[56]|4[5]|7[6])\d{8}$/; //联通号
            const PATTERN_CHINATELECOM = /^1(3[3])|(8[019])\d{8}$/; //电信号
            if (PATTERN_CHINAUNICOM.test(this.state.telephone)) {
                // alert("欢迎您联通用户");
                return 'success';
            } else if (PATTERN_CHINAMOBILE.test(this.state.telephone)) {
                // alert("欢迎您移动用户");
                return 'success';
            } else if (PATTERN_CHINATELECOM.test(this.state.telephone)) {
                // alert("欢迎您电信用户");
                return 'success';
            } else {
                message.warn("请输入正确的手机号");
                return 'error';
            }
        }
    }

    // 生命周期，首次绑定之前
    componentWillMount() {
        this.renderData2();
    }

    //设定state的值，用于之后查询使用
    setSearch(telephone) {
        this.setState({search_telephone: telephone}, () => {
            // 这是因为setState是异步的，所以这里必须放到回调函数中执行代码
            this.renderData2();
        });
    }

    //设定state的值，用于之后查询使用
    setSearch2 = (value, dateString) => {
        // console.log('Selected Time: ', value);
        // console.log('Formatted Selected Time: ', dateString);
        this.setState({search_date: dateString}, () => {
            // 这是因为setState是异步的，所以这里必须放到回调函数中执行代码
            this.renderData2();
        });
    }

    clearSearch = () => {
        this.setState({search_telephone: ''}, () => {
            // 这是因为setState是异步的，所以这里必须放到回调函数中执行代码
            this.renderData2();
        });
    };

    //导出表格
    downloadExcel() {
        var _this = this;
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'telephone': _this.state.search_telephone,
                'date': _this.state.search_date,
                'page': 1
            },
            url: path.path3 + 'exportPlatformUserList.php',
            success: function (res) {
                // console.log(res);
                // 前端用的react要实现输出流的下载，其中核心代码是模仿url的点击事件
                // const blob = new Blob([res]);
                // const fileName = 'userTelephones.xls';
                const aLink = document.createElement('a');
                document.body.appendChild(aLink);
                aLink.style.display = 'none';
                // const objectUrl = URL.createObjectURL(blob);
                aLink.href = path.path3 + "userTelephones.xls";
                // aLink.download = fileName;
                aLink.click();
                document.body.removeChild(aLink);

            },
            error: function (res) {

            }
        })
    };


    //按条件查询
    renderData2() {
        var _this = this;
        let data2 = [];
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'telephone': _this.state.search_telephone,
                'date': _this.state.search_date,
                'page': 1
            },
            url: path.path3 + 'getPlatformUserList.php',
            success: function (res) {
                if (JSON.parse(res).message == '返回数据成功') {
                    let tol = parseInt(JSON.parse(res).data[0].totalRecord);
                    for (let i = 0; i < JSON.parse(res).data.length; i++) {
                        //console.log(JSON.parse(res).data[i]);
                        data2.push({
                            key: JSON.parse(res).data[i].id,
                            id: JSON.parse(res).data[i].id,
                            product_id: JSON.parse(res).data[i].product_id,
                            user_telephone: JSON.parse(res).data[i].user_telephone,
                            pid: JSON.parse(res).data[i].pid,
                            productname: JSON.parse(res).data[i].productname,
                            adver_id: JSON.parse(res).data[i].adver_id,
                            createTime: JSON.parse(res).data[i].createTime,
                            color: JSON.parse(res).data[i].color,
                            advername: JSON.parse(res).data[i].advername,
                        });
                    }
                    _this.setState({data: data2, currentPage: 1, toltalrecord: tol});
                } else if (JSON.parse(res).message == '无数据') {
                    _this.setState({data: data2, currentPage: 1, toltalrecord: 0});
                }
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
            }
        })
    }

    //按分页查询
    pageChange(page) {
        var _this = this;
        let data2 = [];
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'telephone': this.state.search_telephone,
                'date': this.state.search_date,
                'page': page
            },
            url: path.path3 + 'getPlatformUserList.php',
            success: function (res) {
                if (JSON.parse(res).message == '返回数据成功') {
                    let tol = parseInt(JSON.parse(res).data[0].totalRecord);
                    // console.log(JSON.parse(res).data);
                    for (let i = 0; i < JSON.parse(res).data.length; i++) {
                        //console.log(JSON.parse(res).data[i]);
                        data2.push({
                            key: JSON.parse(res).data[i].id,
                            id: JSON.parse(res).data[i].id,
                            product_id: JSON.parse(res).data[i].product_id,
                            user_telephone: JSON.parse(res).data[i].user_telephone,
                            pid: JSON.parse(res).data[i].pid,
                            productname: JSON.parse(res).data[i].productname,
                            adver_id: JSON.parse(res).data[i].adver_id,
                            createTime: JSON.parse(res).data[i].createTime,
                            color: JSON.parse(res).data[i].color,
                            advername: JSON.parse(res).data[i].advername,
                        });
                    }
                    _this.setState({data: data2, currentPage: page, toltalrecord: tol});
                }
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
            }
        })
    }


    render() {

        return (
            <div>
                <div style={{marginLeft: 20, marginTop: 20, fontSize: 18, fontWeight: "bold", color: "#330033"}}>用户列表
                </div>
                <div style={{marginBottom: 16, marginTop: 20,}}>
                    <Row>
                        <Col span={3}></Col>
                        <Col span={6}>
                            <Search
                                placeholder="输入用户手机号码名称查询"
                                onSearch={value => this.setSearch(value)}
                                enterButton
                            />
                        </Col>

                        <Col span={3}>
                            <Button ghost={false} onClick={this.clearSearch} type="primary" style={{marginLeft: 40}}>
                                显示全部
                            </Button>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={3}>
                            <DatePicker placeholder="选择日期查询" format="YYYY-MM-DD" allowClear={true}
                                        onChange={this.setSearch2}/>
                        </Col>
                        <Col span={3}>
                            <Button onClick={this.downloadExcel}> 导出excel表格 </Button>
                        </Col>

                    </Row>
                </div>
                <div style={{textAlign: 'center'}}>
                    <Table
                        id={"mytable"}
                        bordered={false}
                        dataSource={this.state.data}
                        columns={this.columns}
                        //pagination={{pageSize: 15,style:{float:'left',marginLeft:500}}}
                        rowClassName="editable-row"
                        pagination={false}
                    />
                </div>

                <Pagination showTotal={total => `总计 ${total} 条`} pageSize={15} hideOnSinglePage={true}
                            style={{marginLeft: 'auto', marginTop: 20, marginRight: 'auto', width: '660px'}}
                            current={this.state.currentPage} onChange={this.pageChange}
                            total={this.state.toltalrecord}/>


            </div>

        );
    }
}

export default Chachong;