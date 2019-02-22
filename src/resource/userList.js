import React from 'react';
import {Table, Input, InputNumber, Popconfirm, Form, message, Button, Col, Row,Pagination,Icon} from 'antd';
import path from "./../db_config.json"
import uuid from "node-uuid"
import $ from 'jquery';
let prodPragramId='';
const productList = [];
let productId = 0;
let excelName = '';
const sheetType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const sheetType2 = 'application/vnd.ms-excel';
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
                                            required: false,
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

class UserList extends React.Component {
    constructor(props) {
        super(props);
        //取到父组件传过来的值
        prodPragramId = this.props.msg;
        console.log(prodPragramId);
        this.pageChange = this.pageChange.bind(this);
        this.state = {data, editingKey: '', productList, loading: false, fileList: [], productId: productId, currentPage: 1, toltalrecord: 1,
            selectedRowKeys: [] };
        this.columns = [
            // {
            //     title: '广告主id',
            //     dataIndex: 'id',
            //     width: '0',
            //     align: 'center',
            //     editable: true,
            //     sorter: (a, b) => a.name - b.name,
            // },
            // {
            //     title: '产品id',
            //     dataIndex: 'product_id',
            //     width: '40%',
            //     align: 'center',
            //     editable: true,
            //     sorter: (a, b) => {
            //         return a.product_id - b.product_id
            //     },
            // },
            {
                title: '用户手机号码',
                dataIndex: 'user_telephone',
                width: '20%',
                align: 'center',
                editable: true,
            },
            {  title: '创建时间',
                dataIndex: 'createTime',
                width: '30%',
                align: 'center',
                editable: true,
            },
            {
                title: '编辑',
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
            }
        ];
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.data];
        //将未选中的key的值赋予data，相当于删除了选中的一条数据
        this.setState({data: dataSource.filter(item => item.key !== key)});
        //删除之后保存到数据库
        this.deleteProduct(key);
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
            this.updateProduct(row, key);
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

    deleteProduct = (key) => {
        $.ajax({
            type: 'post',
            async: true,
            data: {
                'id': key
            }
            ,
            url: path.path3 + 'deleteRelationship.php',
            success: function (res) {
                message.success(JSON.parse(res).message);
                //调用接口刷新数据
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
            }
        })
    };

    updateProduct = (row, key) => {
        $.ajax({
            type: 'post',
            async: true,
            data: {
                'id': key,
                'product_id': row.product_id,
                'user_telephone': row.user_telephone
            }
            ,
            url: path.path3 + 'updateRelationship.php',
            success: function (res) {
                message.success(JSON.parse(res).message);
                //调用接口刷新数据
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
            }
        })
    };

    cancel = () => {
        this.setState({editingKey: ''});
    };

    clearSearch = () => {
        this.renderData2(prodPragramId,'');
    };
    //按条件查询
    pageChange(page) {
        var _this = this;
        let data2 = [];
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'product_id':prodPragramId,
                'user_telephone': '',
                'page': page
            },
            url: path.path3 + 'getRelationshipList.php',
            success: function (res) {
                // console.log(JSON.parse(res).data);
                if(JSON.parse(res).message=='返回数据成功') {
                    let tol = parseInt(JSON.parse(res).data[0].totalRecord);
                    for (let i = 0; i < JSON.parse(res).data.length; i++) {
                        //console.log(JSON.parse(res).data[i]);
                        data2.push({
                            key: JSON.parse(res).data[i].id,
                            id: JSON.parse(res).data[i].id,
                            product_id: JSON.parse(res).data[i].product_id,
                            createTime: JSON.parse(res).data[i].createTime,
                            user_telephone: JSON.parse(res).data[i].user_telephone
                        });
                    }
                    // _this.state.data = data2;
                    _this.setState({data: data2, currentPage: page, toltalrecord: tol});
                    // console.log(_this.state.productList);
                }
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
            }
        })
    }

    //按条件查询
    renderData2(prodPragramId,value) {
        var _this = this;
        let data2 = [];
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'product_id':prodPragramId,
                'user_telephone': value,
                'page': _this.state.currentPage
            },
            url: path.path3 + 'getRelationshipList.php',
            success: function (res) {
                // console.log(JSON.parse(res).data);
                if(JSON.parse(res).message=='返回数据成功') {
                    let tol = parseInt(JSON.parse(res).data[0].totalRecord);
                    for (let i = 0; i < JSON.parse(res).data.length; i++) {
                        //console.log(JSON.parse(res).data[i]);
                        data2.push({
                            key: JSON.parse(res).data[i].id,
                            id: JSON.parse(res).data[i].id,
                            product_id: JSON.parse(res).data[i].product_id,
                            createTime: JSON.parse(res).data[i].createTime,
                            user_telephone: JSON.parse(res).data[i].user_telephone
                        });
                    }
                    // _this.state.data = data2;
                    _this.setState({data: data2, toltalrecord: tol});
                    // console.log(_this.state.productList);
                }
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
            }
        })
    }

    componentWillMount() {
        this.renderData2(prodPragramId,'');
    }

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
            // columnWidth: 20,
            // columnTitle:'单选框',
            // fixed:true,
            type: 'radio',
            onSelect: (record, selected, selectedRows, nativeEvent) => {
                productId = record.key;
                this.setState({productId: record.key});
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
                <div style={{marginLeft:20,marginTop:20,fontSize:18,fontWeight:"bold",color:"#330033"}}>广告主列表&nbsp;&nbsp;-->&nbsp;&nbsp;产品列表&nbsp;&nbsp;-->&nbsp;&nbsp;用户列表</div>
                <Row>
                    <Col span={8}>
                       {/* <Button ghost={true} onClick={this.handleAdd} type="primary"
                                style={{marginBottom: 16, marginTop: 20, marginRight:100,float:'right'}}>
                            添加一行
                        </Button>*/}
                    </Col>
                    <Col span={6} style={{marginBottom: 16, marginTop: 20}}>
                        <Search
                            id={"chaxun"}
                            placeholder="输入用户手机号码查询"
                            onSearch={value => this.renderData2(prodPragramId,value)}
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
                    height={600}
                    // rowSelection={rowSelection}
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
                                style={{marginLeft: 'auto', marginTop: 20, marginRight: 'auto', width: '500px'}}
                                current={this.state.currentPage} onChange={this.pageChange}
                                total={this.state.toltalrecord}/>
                </div>
            </div>
        );
    }
}

export default UserList;
