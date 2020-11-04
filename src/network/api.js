import {
    post,
    get
} from './httpRequest.js'

import {
    baseUrl
} from "./env.js";
let api = baseUrl

let ky = ''

if (api == "http://localhost:8080") {
    ky = '/api'
}

console.log(api)
    /** 
     * getSituationInfor
     * 参数：params
     * 方式：fetch/post
     */
export const server = {
    // 画网格
    drawGridOnMap: function(params) {
        return post(ky + '/sea-ranch/visual/drawGridOnMap', params)
    },
    // 左侧菜单栏
    getDataCatagoryInfo: function() {
        return post(ky + '/sea-ranch/base/getDataCatagoryInfo')
    },
    // 网格点亮（单网格、手画区域）
    lightGrids: function(params) {
        return post(ky + '/sea-ranch/visual/getGridsOfGeometry', params);
    },
    // 数据网格开关  数据统计 getStatisticsInfo
    getStatisticsInfo: function(params) {
        return post(ky + '/sea-ranch/statistics/getStatisticsInfo', params);
    },
    // 显示矢量要素（点击树结构checkBox时请求接口） 
    searchAllData: function(params) {
        return post(ky + '/sea-ranch/search/searchAllData', params);
    },
    //  获取矢量数据详情 
    searchDataByUniqueCode: function(params) {
        return post(ky + '/sea-ranch/search/searchDataByUniqueCode', params);
    },
    // 分页矢量要素 ， table表格分页请求数据
    searchDataPageing: function(params) {
        return post(ky + '/sea-ranch/search/searchDataPageing', params);
    },
    // 上图
    getShowOnMapData: function(params) {
        return post(ky + '/sea-ranch/search/showOnMap', params);
    },
    //绘制三维网格
    reqDraw3DGrid(params) {
        return post(ky + '/sea-ranch/visual/draw3DGridOnMap', params)
    },
    //绘制二维网格
    reqDraw2DGrid(params) {
        return post(ky + '/sea-ranch/visual/draw2DGridOnMap', params)
    },
    // 2D网格数据信息
    searchData2D(params) {
        return post(ky + '/sea-ranch/search/searchData2D', params)
    },
    // 3D网格数据信息
    searchData3D(params) {
        return post(ky + '/sea-ranch/search/searchData3D', params)
    },

    //三维网格查询
    reqSearch3DGrid(params) {
        return post(ky + "/battlefield/api/getGeoNum2d", params)
    },

    // 请求广西地理区域树结构信息
    getDataAdminitrativeCatagoryInfo(params) {
        return post(ky + '/sea-ranch/search/getIIlist', params)
    },
    // 根据节点请求相应地理区域多边形数据
    getAdminitrativeAreaInfo(params) {
        return post(ky + '/sea-ranch/search/getBoundaryByCode', params)
    },

}