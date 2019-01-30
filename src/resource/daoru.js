import React from 'react';
import {Table, Divider, Icon, Input, InputNumber, Button, Popconfirm, message, Form, Upload} from 'antd';
import 'antd/dist/antd.css';

import path from "./../db_config.json"
import './css/dfault.css'
import request from 'superagent';
import reqwest from 'reqwest';

const $ = require("myjquery");
const productList = [];
let productId = 0;
let excelName = '';
const sheetType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const sheetType2 = 'application/vnd.ms-excel';

class daoru extends React.Component {
    constructor(props) {
        super(props);
        // this.onClickHandler = this.onClickHandler.bind(this);
        this.state = {
            productList, loading: false, fileList: [], productId: productId,
            selectedRowKeys: [] // Check here to configure the default column
        };
        // this.daoruExcel = this.daoruExcel.bind(this);
        // this.handleUpload = this.handleUpload.bind(this);
        this.columns = [
            {
                title: '产品名称',
                dataIndex: 'name',
                width: '20%',
                align: 'center',
                editable: true,
                sorter: (a, b) => a.name - b.name,
            },
            {
                title: 'logo',
                dataIndex: 'logo',
                width: '20%',
                align: 'center',
                editable: true,
            }, {
                title: '链接地址',
                dataIndex: 'url',
                width: '30%',
                align: 'center',
                editable: true,
            }, {
                title: '简介',
                dataIndex: 'info',
                align: 'center',
                width: '20%',
                editable: true,
            }
        ];
    }

    // save(key) {
    //     productId = key;
    // }

    // isClick() {
    //     // alert("开始上传文件"+productId);
    //     if (productId != 0) {
    //         var _this = this;
    //         let input = this.refs.file;
    //         // console.log(_this);
    //         let formData = new FormData();
    //         let file = input.files[0];
    //         // console.log(file.type);
    //         if (file.type != sheetType && file.type != sheetType2) {
    //             message.error("请导入excel格式！");
    //         }
    //         else {
    //             formData.append('avatar', file);
    //             request
    //                 .post('/proexcel')
    //                 .send(formData)
    //                 .end((err, res) => {
    //                     excelName = res.body.filePath;
    //                     _this.daoruExcel();
    //                     // _this.setState({
    //                     //     logo: res.body.filePath.split('/')[1]
    //                     // })
    //                     /*_this.props.uploadImage(res.body.filePath);*/
    //                 });
    //         }
    //     } else {
    //         message.error("未能上传，请先选择产品")
    //     }
    // }

    // handleChange = (info) => {
    //     console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwww");
    //     console.log(info);
    //     if (info.file.status === 'uploading') {
    //         this.setState({loading: true});
    //         return;
    //     }
    //     if (info.file.status === 'done') {
    //         // Get this url from response in real world.
    //         getBase64(info.file.originFileObj, imageUrl => this.setState({
    //             imageUrl,
    //             loading: false,
    //         }));
    //         console.log(getBase64(info.file.originFileObj, imageUrl => this.setState({
    //             imageUrl,
    //             loading: false,
    //         })));
    //     }
    // }

    renderData() {

        var _this = this;
        let data2 = [];
        $.ajax({
            type: 'get',
            async: false,
            url: path.path3 + 'getPlatformProductList.php',
            success: function (res) {
                // console.log(JSON.parse(res).data);
                for (let i = 0; i < JSON.parse(res).data.length; i++) {
                    data2.push({
                        key: JSON.parse(res).data[i].id,
                        id: JSON.parse(res).data[i].id,
                        name: JSON.parse(res).data[i].name,
                        logo: JSON.parse(res).data[i].logo,
                        url: JSON.parse(res).data[i].url,
                        info: JSON.parse(res).data[i].info,
                    });
                }
                _this.state.productList = data2;
                // console.log(_this.state.productList);
            }
        })
    }

    componentWillMount() {
        this.renderData()
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
                // console.log(productId);

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

        // rowSelection object indicates the need for row selection
        const rowSelection = {
            columnWidth: '8',
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


                    <div className="col-sm-12">
                        <div style={{paddingTop: 60, border: 5, textAlign: 'center'}}>

                            <Upload {...props}>
                                <Button type="primary">
                                    <Icon type="upload"/> 导入表格
                                </Button>
                            </Upload>

                        </div>
                        <div style={{paddingTop: 50, border: 5, textAlign: 'center'}}>
                            <Table
                                rowSelection={rowSelection}
                                // components={components}
                                bordered={false}
                                dataSource={this.state.productList}
                                columns={this.columns}
                                rowClassName="editable-row"
                            />
                        </div>

                    </div>


            </div>
        );
    }
}

export default daoru;