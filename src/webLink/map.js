import React from 'react';
// import ReactDOM from 'react-dom';
import { Map,Marker } from 'react-amap';
import './../App.css';

const ZoomCtrl = (props) => {
    const map = props.__map__;
    if (!map) {
        console.log('组件必须作为 Map 的子组件使用');
        return;
    }
    const zoomIn = () => map.zoomIn();
    const zoomOut = () => map.zoomOut();

    return (<div id="zoom-ctrl">
        <span onClick={zoomIn}>+</span>
        <span onClick={zoomOut}>-</span>
    </div>);
};


class SimpleMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mapZoom: 13, //地图缩放等级 （zoom）
            //https://lbs.amap.com/api/javascript-api/guide/abc/prepare这里有介绍key怎么申请
            mapKey: '7aa0d4a180b92617aa34eeeb9b9e21db',//Key就不贴出来了奥
            status: {
                zoomEnable: true,//放大缩小
                dragEnable: true,//鼠标拉动
            },
            mapCenter:[120.884729, 32.022878],//地图中心点
            mapMake :[120.884729, 32.022878],//marker标记点
        };
    }

    render() {

        const position = { longitude: 120.884729, latitude: 32.022878}//需要定位的经纬度
        let {mapCenter, mapMake, mapZoom, mapKey, status} = this.state;
        return (
            // Important! Always set the container height explicitly
            <div style={{  width:800,height: 800 }}>
                <Map amapkey={mapKey} center={mapCenter} zoom={mapZoom} status={status}>
                    <ZoomCtrl />
                    <Marker position={mapMake}/>
                </Map>,
            </div>
        );
    }
}

export default SimpleMap;