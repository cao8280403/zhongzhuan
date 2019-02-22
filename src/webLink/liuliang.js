import React from 'react';
import {message, Select, Icon,Button} from 'antd';
import $ from 'jquery';
// import {Calendar,LocaleProvider} from 'antd';
// import zh_CN from 'antd/lib/locale-provider/zh_CN';
// import moment from 'moment';
// import 'moment/locale/zh-cn';
//
// moment.locale('zh-cn');
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';

import path from "./../db_config.json"

const Option = Select.Option;
let msg = '';
var myChart;
class Liuliang extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chanpinId: "",
            year: '',
            month: '',
            xdata: [],
            ydata1: [],
            ydata2: [],
        };
        //获取路由传递过来的参数,广告主id
        msg = this.props.location.state1;
        // 判断如果没有则返回到列表页
        if (msg == undefined) {
            window.location.replace("/sub1/key1");
        }
    }

    getdata = (msg) => {
        var _this = this;
        // console.log(msg);
        let pv = [];
        let uv = [];
        let date = [];
        $.ajax({
            type: 'post',
            async: false,
            data: {
                'guid': msg,
                'year': this.state.year,
                'month': this.state.month,
            },
            url: path.path5 + '/visitHistory/findVisitHistoryByGuid',
            success: function (res) {
                for (let i = 0; i < res.pv.length; i++) {
                    date.push(res.pv[i][0]);
                    pv.push(res.pv[i][1]);
                    uv.push(res.uv[i][1]);
                }
                _this.setState({xdata: date, ydata1: pv, ydata2: uv}, () => _this.echartInit());
            },
            error: function (res) {
                message.warning('error');
            }
        })
    };

    //绑定之前打印出来是现在的，说明还未改变值
    componentWillMount() {
        //获取当天的年，月，初始化
        var date = new Date;
        var year = '' + date.getFullYear();
        var month = date.getMonth() + 1;
        month = '' + month;
        // month =(month<10 ? "0"+month:month);
        // var mydate = (year.toString()+month.toString());
        this.setState({chanpinId: msg, year: year, month: month}, () => this.getdata(msg));
    }

    //绑定之后打印出来是修改后的值
    componentDidMount() {

    }

    echartInit = () => {
        // console.log(this.state.xdata.length);
        if (this.state.xdata.length > 0) {
            // 基于准备好的dom，初始化echarts实例
            myChart = echarts.init(document.getElementById('main'));
            // window.onresize = myChart.resize;
            // 绘制图表
            myChart.setOption({
                title: {text: 'PV UV统计图'},
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['PV', 'UV']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {
                            show: true,
                            type: 'jpg'
                        }
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.state.xdata
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'PV',
                        type: 'bar',
                        data: this.state.ydata1,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    },
                    {
                        name: 'UV',
                        type: 'bar',
                        data: this.state.ydata2,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    },
                ]
            });
        } else {
            //释放div绑定的echart对象
            myChart.dispose();
            document.getElementById('main').innerHTML='<div style=text-align:center>NO DATA</div>';
        }
    };
    // onPanelChange = (value, mode)=> {
    //     console.log(value, mode);
    // };

    handleChange = (value) => {
        this.setState({year: value}, () => this.getdata(msg));
    };
    handleChange2 = (value) => {
        this.setState({month: value}, () => this.getdata(msg));
    };

    goback = () => {
        window.history.go(-1);
    };

    render() {
        return (
            <div>
                <div style={{marginBottom: 16, marginTop: 20, marginLeft: 40}}>
                    <Button type="primary" ghost={true} onClick={this.goback}>
                        <Icon type="left" />返回
                    </Button>
                    <span style={{color: '#000', fontWeight: '500', fontSize: 18,marginLeft: 30}}>请选择年月</span>
                    <Select defaultValue={this.state.year} style={{width: 100, marginLeft: 10}}
                            onChange={this.handleChange}>
                        <Option value="2019">2019年</Option>
                        <Option value="2020">2020年</Option>
                        <Option value="2021">2021年</Option>
                        <Option value="2022">2022年</Option>
                        <Option value="2023">2023年</Option>
                        <Option value="2024">2024年</Option>
                        <Option value="2025">2025年</Option>
                        <Option value="2026">2026年</Option>
                        <Option value="2027">2027年</Option>
                        <Option value="2028">2028年</Option>
                        <Option value="2029">2029年</Option>
                    </Select>

                    <Select defaultValue={this.state.month} style={{width: 80, marginLeft: 2}}
                            onChange={this.handleChange2}>
                        <Option value="1">1月</Option>
                        <Option value="2">2月</Option>
                        <Option value="3">3月</Option>
                        <Option value="4">4月</Option>
                        <Option value="5">5月</Option>
                        <Option value="6">6月</Option>
                        <Option value="7">7月</Option>
                        <Option value="8">8月</Option>
                        <Option value="9">9月</Option>
                        <Option value="10">10月</Option>
                        <Option value="11">11月</Option>
                        <Option value="12">12月</Option>
                    </Select>

                </div>
                <div id="main" style={{width: '100%', height: 600,padding:20}}>
                </div>
            </div>
        )
    }
}

export default Liuliang;