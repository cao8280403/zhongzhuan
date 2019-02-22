import React from 'react';
import {Table, Input, InputNumber, Popconfirm, Form, message, Button, Col, Row, Pagination} from 'antd';
import path from "./../db_config.json"
import uuid from "node-uuid"
import {Link} from "react-router-dom";
import {copy} from 'copy-to-clipboard';
import $ from 'jquery';
const Search = Input.Search;
const data = [];
// for (let i = 0; i < 100; i++) {
//     data.push({
//         key: i.toString(),
//         name: `Edrward ${i}`,
//         age: 32,
//         address: `London Park no. ${i}`,
//     });
// }
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber/>;
        }
        return <Input/>;
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const {getFieldDecorator} = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{margin: 0}}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `请输入 ${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

class AdverList extends React.Component {
    constructor(props) {
        super(props);
        this.pageChange = this.pageChange.bind(this);
        this.renderData2 = this.renderData2.bind(this);
        this.state = {data, editingKey: '', adverId: 0, currentPage: 1, toltalrecord: 1};
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
                title: '广告主名称',
                dataIndex: 'name',
                width: '20%',
                align: 'center',
                editable: true,
                sorter: (a, b) => {
                    return a.name - b.name
                },
            },
            {
                title: '联系方式',
                dataIndex: 'telephone',
                width: '20%',
                align: 'center',
                editable: true,
                sorter: (a, b) => {
                    return a.telephone - b.telephone
                },
            // }, {
            //     title: '地址',
            //     dataIndex: 'address',
            //     width: '15%',
            //     align: 'center',
            //     editable: true,
            }, {
                title: '备注',
                dataIndex: 'remark',
                align: 'center',
                width: '20%',
                editable: true,
            },
            {
                title: '编辑',
                textAlign: 'center',
                dataIndex: 'operation',
                render: (text, record) => {
                    const editable = this.isEditing(record);
                    return (
                        <div>
                            {editable ? (
                                <span>
                  <EditableContext.Consumer>
                    {form => (
                        <a
                            href="javascript:;"
                            onClick={() => this.save(form, record.key)}
                            style={{marginRight: 8}}
                        >
                            保存
                        </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                      title="确定取消吗?"
                      okText="Yes" cancelText="No"
                      onConfirm={() => this.cancel(record.key)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
                            ) : (
                                <a onClick={() => this.edit(record.key)}>修改</a>
                            )}
                        </div>
                    );
                },
            }
            , {
                title: '删除',
                dataIndex: 'del',
                render: (text, record) => {
                    return (
                        this.state.data.length >= 1
                            ? (
                                <Popconfirm title="确定删除吗?"
                                            okText="Yes" cancelText="No"
                                            onConfirm={() => this.handleDelete(record.key)}>
                                    <a href="javascript:;">删除</a>
                                </Popconfirm>
                            ) : null
                    );
                }
            }, {
                title: '',
                dataIndex: 'xiangqing',
                render: (text, record) => {
                    let canshu = 'woshicanshu';
                    canshu = record.key;
                    let jumpRouter = {
                        pathname: '/chanpin',
                        state1: canshu,
                    };
                    return ( <Link to={jumpRouter}>产品详情</Link>);
                }
            }
        ];
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.data];
        //将未选中的key的值赋予data，相当于删除了选中的一条数据
        this.setState({data: dataSource.filter(item => item.key !== key)});
        //删除之后保存到数据库
        this.deleteAdver(key);
    };

    handleAdd = () => {
        //生成主键和uuid
        let key = uuid.v4();
        const dataSource = [...this.state.data];
        const newData = {
            key: key,
            id: key,
            name: '',
            telephone: '',
            address: '',
            remark: ''
        };
        //下面的代码保证添加到第一行
        let tempDataSource = [];
        tempDataSource[0] = newData;
        for (let i = 0; i < dataSource.length; i++) {
            tempDataSource[i + 1] = dataSource[i];
        }
        this.setState({
            // data: [...dataSource, newData]
            data: tempDataSource
        });
        //删除之后保存到数据库
        this.insertAdver(key);
    };

    isEditing = (record) => {
        return record.key === this.state.editingKey;
    };

    edit(key) {
        this.setState({editingKey: key});
    }

    save(form, key) {
        console.log(form);
        console.log(key);
        form.validateFields((error, row) => {
            console.log(row, key);
            this.updateAdver(row, key);
            if (error) {
                return;
            }
            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({data: newData, editingKey: ''});
            } else {
                newData.push(row);
                this.setState({data: newData, editingKey: ''});
            }
        });

    }

    insertAdver = (key) => {
        var _this = this;
        $.ajax({
            type: 'post',
            async: true,
            data: {
                'id': key,
                'name': '',
                'telephone': '',
                'address': '',
                'remark': ''
            }
            ,
            url: path.path3 + 'insertAdver.php',
            success: function (res) {
                message.success(JSON.parse(res).message);
                //调用接口刷新数据
                _this.renderData2('');
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
            }
        })
    };

    deleteAdver = (key) => {
        var _this = this;
        $.ajax({
            type: 'post',
            async: true,
            data: {
                'id': key
            }
            ,
            url: path.path3 + 'deleteAdver.php',
            success: function (res) {
                message.success(JSON.parse(res).message);
                //调用接口刷新数据
                _this.renderData2('');
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
            }
        })
    };

    updateAdver = (row, key) => {
        $.ajax({
            type: 'post',
            async: true,
            data: {
                'id': key,
                'name': row.name,
                'telephone': row.telephone,
                'address': row.address,
                'remark': row.remark
            }
            ,
            url: path.path3 + 'updateAdver.php',
            success: function (res) {
                message.success(JSON.parse(res).message);
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
            }
        })
    };

    cancel = () => {
        this.setState({editingKey: ''});
    };

    // renderData() {
    //     var _this = this;
    //     let data2 = [];
    //     $.ajax({
    //         type: 'get',
    //         async: false,
    //         url: path.path3 + 'getAdverList.php',
    //         success: function (res) {
    //             // console.log(JSON.parse(res).data);
    //             for (let i = 0; i < JSON.parse(res).data.length; i++) {
    //                 //console.log(JSON.parse(res).data[i]);
    //                 data2.push({
    //                     key: JSON.parse(res).data[i].id,
    //                     id: JSON.parse(res).data[i].id,
    //                     name: JSON.parse(res).data[i].name,
    //                     telephone: JSON.parse(res).data[i].telephone,
    //                     address: JSON.parse(res).data[i].address,
    //                     remark: JSON.parse(res).data[i].remark
    //                 });
    //             }
    //             _this.state.data = data2;
    //             // console.log(_this.state.productList);
    //         },
    //         error: function (res) {
    //             message.warning(JSON.parse(res).message);
    //         }
    //     })
    // }

    //按条件查询
    renderData(value) {
        var _this = this;
        let data2 = [];
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'name': value,
                'page': 1
            },
            url: path.path3 + 'getAdverList.php',
            success: function (res) {
                if (JSON.parse(res).message == '返回数据成功') {
                    let tol = parseInt(JSON.parse(res).data[0].totalRecord);
                    for (let i = 0; i < JSON.parse(res).data.length; i++) {
                        data2.push({
                            key: JSON.parse(res).data[i].id,
                            id: JSON.parse(res).data[i].id,
                            name: JSON.parse(res).data[i].name,
                            telephone: JSON.parse(res).data[i].telephone,
                            address: JSON.parse(res).data[i].address,
                            remark: JSON.parse(res).data[i].remark
                        });
                    }
                    _this.setState({data: data2, toltalrecord: tol});
                } else {
                    _this.setState({data: data2});
                }
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
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
                'name': value,
                'page': _this.state.currentPage
            },
            url: path.path3 + 'getAdverList.php',
            success: function (res) {
                if (JSON.parse(res).message == '返回数据成功') {
                    let tol = parseInt(JSON.parse(res).data[0].totalRecord);
                    for (let i = 0; i < JSON.parse(res).data.length; i++) {
                        data2.push({
                            key: JSON.parse(res).data[i].id,
                            id: JSON.parse(res).data[i].id,
                            name: JSON.parse(res).data[i].name,
                            telephone: JSON.parse(res).data[i].telephone,
                            address: JSON.parse(res).data[i].address,
                            remark: JSON.parse(res).data[i].remark
                        });
                    }
                    _this.setState({data: data2, toltalrecord: tol});
                } else {
                    _this.setState({data: data2});
                }
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
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
                'name': '',
                'page': page
            },
            url: path.path3 + 'getAdverList.php',
            success: function (res) {
                if (JSON.parse(res).message == '返回数据成功') {
                    let tol = parseInt(JSON.parse(res).data[0].totalRecord);
                    for (let i = 0; i < JSON.parse(res).data.length; i++) {
                        data2.push({
                            key: JSON.parse(res).data[i].id,
                            id: JSON.parse(res).data[i].id,
                            name: JSON.parse(res).data[i].name,
                            telephone: JSON.parse(res).data[i].telephone,
                            address: JSON.parse(res).data[i].address,
                            remark: JSON.parse(res).data[i].remark
                        });
                    }
                    _this.setState({data: data2, currentPage: page, toltalrecord: tol});
                } else {
                    _this.setState({data: data2});
                }
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
            }
        })
    }

    componentWillMount() {
        this.renderData2('');
    }

    clearSearch = () => {
        this.renderData2('');
    };

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });
        // rowSelection object indicates the need for row selection
        const rowSelection = {
            columnWidth: 8,
            // columnTitle:'单选框',
            // fixed:true,
            type: 'radio',
            onSelect: (record, selected, selectedRows, nativeEvent) => {
                // this.adverId = record.key;
                this.setState({adverId: record.key});
            },
            // onChange: (selectedRowKeys, selectedRows) => {
            //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };


        return (
            <div>
                <div style={{marginLeft: 20, marginTop: 20, fontSize: 18, fontWeight: "bold", color: "#330033"}}>广告主列表
                </div>
                <Row>
                    <Col span={8}>
                        <Button ghost={true} onClick={this.handleAdd} type="primary"
                                style={{marginBottom: 16, marginTop: 20, marginRight: 100, float: 'right'}}>
                            添加
                        </Button>
                    </Col>
                    <Col span={6} style={{marginBottom: 16, marginTop: 20}}>
                        <Search
                            placeholder="输入广告主名称查询"
                            onSearch={value => this.renderData(value)}
                            enterButton
                        />
                    </Col>
                    <Col span={3}>
                        <Button ghost={false} onClick={this.clearSearch} type="primary"
                                style={{marginBottom: 16, marginTop: 20, marginLeft: 40}}>
                            显示全部
                        </Button>
                    </Col>
                </Row>

                <Table
                    id={'mytable'}
                    components={components}
                    bordered={false}
                    dataSource={this.state.data}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={false}
                    // pagination={{pageSize: 15,style:{float:'left',marginLeft:500}}}
                />
                <div style={{textAlign: 'center'}}>
                    <Pagination pageSize={15}
                                style={{marginLeft: 'auto', marginTop: 20, marginRight: 'auto', width: '660px'}}
                                current={this.state.currentPage} onChange={this.pageChange}
                                total={this.state.toltalrecord}/>
                </div>
            </div>
        );
    }
}

export default AdverList;
