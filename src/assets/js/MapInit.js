var Cesium = require('cesium/Cesium');
import { BaiduImageryProvider } from './BaiduImageryProvider'
// import { wmsUrl } from '../../request/env.js'

/**
 * cesium的默认初始化方法，通过天地图贴图，并取消掉所有不必要的logo
 * @param id dom元素id
 * @param mapType 底图类型
 * @param isImage 是否是影像
 * @param options viewer配置选项
 * @param completionByDefaultOptions 是否采用默认配置补全options，如果該值不传，则options的参数不会被修改，options有哪些参数就会用哪些参数
 *                                   如果有該值，则options中不存在的属性将由defaultOptions中存在的属性补全
 */
export function defaultInitCesium(id, mapType, isImage, sceneModeType = '3D', options = null, completionByDefaultOptions, ) {
    completionByDefaultOptions = !!completionByDefaultOptions

    var imageryProvider;
    if (mapType == 'ArcGIS') {
        imageryProvider = isImage ? getArcGISImageProvider() : getArcGISStreetProvider();
    } else if (mapType == 'tianDitu') {
        imageryProvider = isImage ? getTianDiTuImageProvider() : getTianDiTuStreetProvider();
    } else if (mapType == 'Amap') {
        imageryProvider = isImage ? getAmapImageProvider() : getAmapStreetProvider();
    } else if (mapType == 'baidu') {
        imageryProvider = getBaiDuProvider();
    } else if (mapType == 'google') {
        imageryProvider = isImage ? getGoogleImageProvider() : getGoogleStreetProvider();
    } else if (mapType == 'wms') {
        imageryProvider = getWMSImageProvider();
    }
    let sceneMode = Cesium.SceneMode.SCENE3D;
    if (sceneModeType === '2D') {
        sceneMode = Cesium.SceneMode.SCENE2D;
    }
    let defaultOptions = {
        sceneMode: sceneMode,
        animation: false, // 是否创建动画小器件，左下角仪表
        timeline: false, // 是否显示时间轴
        fullscreenButton: false, // 是否显示全屏按钮
        geocoder: false, // 是否显示geocoder小器件，右上角查询按钮
        homeButton: false,
        skyAtmosphere: false, // 大气层
        infoBox: false, // 是否显示信息框
        navigationHelpButton: false, // 是否显示右上角的帮助按钮
        sceneModePicker: false, // 是否显示3D/2D选择器
        baseLayerPicker: false, // 是否显示图层选择器,
        selectionIndicator: false, // 是否显示选取指示器组件 
        imageryProvider: imageryProvider,
        showRenderLoopErrors: false,
    }

    if (options && completionByDefaultOptions) {
        for (let attr in defaultOptions) {
            if (!options.hasOwnProperty(attr)) {
                options[attr] = defaultOptions[attr]
            }
        }
    } else {
        options = options || defaultOptions
    }

    let viewer = new Cesium.Viewer(id, options)

    viewer._cesiumWidget._creditContainer.style.display = 'none'

    // 去锯齿，使文字清晰
    viewer.scene.postProcessStages.fxaa.enabled = false;

    if (mapType != "baidu") {
        addImageryProvider(viewer, mapType);
    }

    // 设置最大缩放级别
    // if (mapType == "tianDitu") {
    //     viewer.scene.screenSpaceCameraController.minimumZoomDistance = 310;
    // }
    // viewer.scene.screenSpaceCameraController.maximumZoomDistance = 30000;

    return viewer
}

// wms
function getWMSImageProvider() {
    return new Cesium.WebMapServiceImageryProvider({
        url: wmsUrl,
        layers: 'shenzhen:bantian',
        parameters: {
            service: 'WMS',
            format: 'image/png',
            srs: 'EPSG:404000'
        }
    })
}

// ArcGIS影像
function getArcGISImageProvider() {
    return new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
    })
}

// ArcGIS街道
function getArcGISStreetProvider() {
    return new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
    })
}

// 天地图影像
function getTianDiTuImageProvider() {
    return new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=44964a97c8c44e4d04efdf3cba594467",
        layer: "tdtBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false,
        // tilingScheme: new Cesium.GeographicTilingScheme(), // 墨卡托
    })
}

// 天地图街道
function getTianDiTuStreetProvider() {
    return new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&&tk=42f7b634383f7e34d0ef339b26252b02',
        layer: 'tdtVecBasicLayer',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'GoogleMapsCompatible',
    })
}

// 高德影像
function getAmapImageProvider() {
    return new Cesium.UrlTemplateImageryProvider({
        url: 'http://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    })
}

// 高德街道
function getAmapStreetProvider() {
    return new Cesium.UrlTemplateImageryProvider({
        url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    })
}

// 百度影像
function getBaiDuProvider() {
    return new BaiduImageryProvider({
        url: "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1"
    })
}

// 谷歌影像 m-地图，s-影像，h-注记，t-地形，y-混合影像与注记
function getGoogleImageProvider() {
    return new Cesium.UrlTemplateImageryProvider({
        // url: 'http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G'
        url: "http://mt1.google.cn/vt/lyrs=y&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"
    })
}

// 谷歌街道
function getGoogleStreetProvider() {
    return new Cesium.UrlTemplateImageryProvider({
        url: "http://mt2.google.cn/vt/lyrs=m&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G"
    })
}

function addImageryProvider(targetViewer, mapType) {
    var imageryProvider;
    switch (mapType) {
        case 'ArcGIS':
            imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer",
            });
            targetViewer.imageryLayers.addImageryProvider(imageryProvider);
            break;
        case 'tianDitu':
            imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=be6dab35ca077d539685f353e95bd02b",
                layer: "tdtAnnoLayer",
                style: "default",
                format: "image/png",
                tileMatrixSetID: "GoogleMapsCompatible",
            });
            targetViewer.imageryLayers.addImageryProvider(imageryProvider);
            break;
        case 'Amap':
            imageryProvider = new Cesium.UrlTemplateImageryProvider({
                url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
                layer: "tdtAnnoLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible"
            })
            targetViewer.imageryLayers.addImageryProvider(imageryProvider);
            break;
        case 'baidu':
            imageryProvider = new Cesium.UrlTemplateImageryProvider({
                url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
                layer: "tdtAnnoLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible"
            })
            targetViewer.imageryLayers.addImageryProvider(imageryProvider);
            break;
    }

}