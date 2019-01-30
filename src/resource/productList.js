import React from 'react';
import {Table, Pagination,Input, InputNumber, Popconfirm, Form, message, Button, Col, Row,Upload,Icon,Tooltip} from 'antd';
import path from "./../db_config.json"
import uuid from "node-uuid"
import {Link} from "react-router-dom";

let adverId='';
const productList = [];
let productId = 0;
let excelName = '';
const sheetType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const sheetType2 = 'application/vnd.ms-excel';
const Search = Input.Search;
const $ = require("myjquery");
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

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.pageChange = this.pageChange.bind(this);
        //取到父组件传过来的值
        adverId = this.props.msg;
        console.log(adverId);
        this.state = {data, editingKey: '', productList, loading: false, fileList: [], productId: productId,currentPage:1,toltalrecord:1,
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
            {
                title: '产品名称',
                dataIndex: 'name',
                width: '10%',
                align: 'center',
                editable: true,
                sorter: (a, b) => {
                    return a.name - b.name
                },
            },
            {
                title: 'logo地址',
                dataIndex: 'logo',
                width: '15%',
                align: 'center',
                editable: true,
            }, {
                title: '超链接',
                dataIndex: 'url',
                width: '15%',
                align: 'center',
                editable: true,
            }, {
                title: '产品信息',
                dataIndex: 'info',
                align: 'center',
                width: '15%',
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
            }, {
                title: '',
                dataIndex: 'xiangqing',
                render: (text, record) => {
                    let canshu ='woshicanshu';
                    canshu = record.key;
                    let jumpRouter = {
                        pathname:'/user/'+canshu
                    };
                    return ( <Link to={jumpRouter} target={"_blank"}>购买用户详情</Link>);
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

    handleAdd = () => {
        //生成主键和uuid
        let key = uuid.v4();
        const dataSource = [...this.state.data];
        const newData = {
            key: key,
            id: key,
            name: '',
            logo: '',
            url: '',
            info: ''
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
        this.insertProduct(key);
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

    insertProduct = (key) => {
        var _this = this;
        $.ajax({
            type: 'post',
            async: true,
            data: {
                'id': key,
                'name': '',
                'logo': '',
                'url': '',
                'info': '',
                'adver_id':adverId
            }
            ,
            url: path.path3 + 'insertProduct.php',
            success: function (res) {
                message.success(JSON.parse(res).message);
                //调用接口刷新数据
                _this.renderData2(adverId,'');
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
            }
        })
    };

    deleteProduct = (key) => {
        var _this = this;
        $.ajax({
            type: 'post',
            async: true,
            data: {
                'id': key
            }
            ,
            url: path.path3 + 'deleteProduct.php',
            success: function (res) {
                message.success(JSON.parse(res).message);
                //调用接口刷新数据
                _this.renderData2(adverId,'');
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
                'name': row.name,
                'logo': row.logo,
                'url': row.url,
                'info': row.info
            }
            ,
            url: path.path3 + 'updateProduct.php',
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
        this.renderData2(adverId,'');
    };
//按条件查询
    renderData(adverId,value) {
        // alert(adverId)
        var _this = this;
        let data2 = [];
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'adverId':adverId,
                'name': value,
                'page':1
            },
            url: path.path3 + 'getProductList.php',
            success: function (res) {
                // console.log(JSON.parse(res).data);
                if(JSON.parse(res).message=='返回数据成功') {
                    let tol = parseInt(JSON.parse(res).data[0].totalRecord);
                    for (let i = 0; i < JSON.parse(res).data.length; i++) {
                        //console.log(JSON.parse(res).data[i]);
                        data2.push({
                            key: JSON.parse(res).data[i].id,
                            id: JSON.parse(res).data[i].id,
                            name: JSON.parse(res).data[i].name,
                            logo: JSON.parse(res).data[i].logo,
                            url: JSON.parse(res).data[i].url,
                            info: JSON.parse(res).data[i].info
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
    //按条件查询
    renderData2(adverId,value) {
        // alert(adverId)
        var _this = this;
        let data2 = [];
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'adverId':adverId,
                'name': value,
                'page':_this.state.currentPage
            },
            url: path.path3 + 'getProductList.php',
            success: function (res) {
                console.log(JSON.parse(res).message);
                if(JSON.parse(res).message=='返回数据成功') {
                    let tol = parseInt(JSON.parse(res).data[0].totalRecord);
                    for (let i = 0; i < JSON.parse(res).data.length; i++) {
                        //console.log(JSON.parse(res).data[i]);
                        data2.push({
                            key: JSON.parse(res).data[i].id,
                            id: JSON.parse(res).data[i].id,
                            name: JSON.parse(res).data[i].name,
                            logo: JSON.parse(res).data[i].logo,
                            url: JSON.parse(res).data[i].url,
                            info: JSON.parse(res).data[i].info
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
//按条件查询
    pageChange(page) {
        var _this = this;
        let data2 = [];
        $.ajax({
            type: 'post',
            async: false,
            data:{
                'adverId':adverId,
                'name': '',
                'page':page
            },
            url: path.path3 + 'getProductList.php',
            success: function (res) {
                if(JSON.parse(res).message=='返回数据成功') {
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
                }
            },
            error: function (res) {
                message.warning(JSON.parse(res).message);
            }
        })
    }
    componentWillMount() {
        this.renderData2(adverId,'');
    }

    render() {

        const props = {
            name: 'avatar',
            data: {productId},
            action: path.path3 + 'upload_file.php',
            headers: {
                authorization: 'authorization-text',
            },
            showUploadList: false,
            beforeUpload(info) {
                console.log(info);
                console.log(productId);

                if (productId != 0) {
                    if (info.type != sheetType && info.type != sheetType2) {
                        message.error("请导入excel格式！");
                        return false;
                    }
                    else {
                        return true;
                    }
                    // return true;
                } else {
                    message.error("未能上传，请先选择产品");
                    return false;
                }
            },
            onChange(info) {
                // console.log(info);
                if (info.file.status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                    // daoruExcel();
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }

            },
        };

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
                <div style={{marginLeft:20,marginTop:20,fontSize:18,fontWeight:"bold",color:"#330033"}}>广告主列表&nbsp;&nbsp;-->&nbsp;&nbsp;产品列表</div>
                <Row>
                    <Col span={8}>
                        <Button ghost={true} onClick={this.handleAdd} type="primary"
                                style={{marginBottom: 16, marginTop: 20, marginRight:100,float:'right'}}>
                            添加
                        </Button>
                    </Col>
                    <Col span={6} style={{marginBottom: 16, marginTop: 20}}>
                        <Search
                            id={"chaxun"}
                            placeholder="输入产品名称查询"
                            onSearch={value => this.renderData(adverId,value)}
                            enterButton
                        />
                    </Col>
                    <Col span={3}>
                        <Button ghost={false} onClick={this.clearSearch} type="primary"
                                style={{marginBottom: 16, marginTop: 20, marginLeft: 40}}>
                            显示全部
                        </Button>
                    </Col>
                    <Col span={4}>
                        <Upload {...props}>
                            <Tooltip title="导入表格之前请先勾选产品">
                            <Button type="primary" style={{marginBottom: 16, marginTop: 20, marginLeft: 40}}>
                                <Icon type="upload"/> 导入表格
                            </Button>
                            </Tooltip>
                        </Upload>
                    </Col>
                </Row>

                <Table
                    id={'mytable'}
                    height={600}
                    rowSelection={rowSelection}
                    components={components}
                    bordered={false}
                    dataSource={this.state.data}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={false}
                    //pagination={{pageSize: 15, style: {float: 'left', marginLeft: 500}}}
                />
                <div style={{textAlign: 'center'}}>
                <Pagination pageSize={15} style={{marginLeft:'auto',marginTop:20,marginRight:'auto',width:'660px'}} current={this.state.currentPage} onChange={this.pageChange} total={this.state.toltalrecord}/>
                </div>
            </div>
        );
    }
}

export default ProductList;
