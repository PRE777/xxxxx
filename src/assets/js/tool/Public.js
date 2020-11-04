var Cesium = require('cesium/Cesium');
// var viewer = undefined;
// 获取屏幕可见区域
export function getVisibleRegion(viewer) {
    if (viewer.scene.mode == Cesium.SceneMode.SCENE2D) {
        // 范围对象
        var extent = {};
        // 得到当前三维场景
        var scene = viewer.scene;
        // 得到当前三维场景的椭球体
        var ellipsoid = scene.globe.ellipsoid;
        var canvas = scene.canvas;
        // canvas左上角
        var car3_lt = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);
        // canvas右下角
        var car3_rb = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid);
        // 当canvas左上角和右下角全部在椭球体上
        if (car3_lt && car3_rb) {
            // var carto_lt = Cesium.Ellipsoid.WGS84.cartesianToCartographic(car3_lt);
            // console.log("左上角和右下角全部在椭球体上");
            var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
            var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
            extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
            extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
            extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
            extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
        } else if (!car3_lt && car3_rb) {
            // 当canvas左上角不在但右下角在椭球体上
            // console.log("当canvas左上角不在但右下角在椭球体上");
            var car3_lt2 = null;
            var yIndex = 0;
            do {
                // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
                yIndex <= canvas.height ? yIndex += 10 : canvas.height;
                car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, yIndex), ellipsoid);
            } while (!car3_lt2);
            var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
            var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb);
            extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
            extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
            extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
            extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
        }
        // 获取高度
        extent.height = Math.ceil(viewer.camera.positionCartographic.height);
        // console.log(extent.xmin, extent.xmax, extent.ymin, extent.ymax, extent.height);
        return extent;
    } else if (viewer.scene.mode == Cesium.SceneMode.SCENE3D) {
        var extent = {};
        var field_view = viewer.camera.computeViewRectangle();
        if (field_view != null) {
            extent.xmin = Cesium.Math.toDegrees(field_view.west);
            extent.xmax = Cesium.Math.toDegrees(field_view.east);
            extent.ymin = Cesium.Math.toDegrees(field_view.south);
            extent.ymax = Cesium.Math.toDegrees(field_view.north);
        }
        extent.height = Math.ceil(viewer.camera.positionCartographic.height);
        // console.log(extent.xmin, extent.xmax, extent.ymin, extent.ymax, extent.height);
        return extent;
    }

}
// 监听地图移动变换
export function observeMapMoveEnd(viewer) {
    viewer.scene.camera.moveEnd.addEventListener(calculateMapLevel);
}
//  根据相机高度获取地图层级 方法一
export function getLevelForHeight(height) {
    let minLevel = 2;
    let maxLevel = 25;
    // let height_maxLevel = 300;
    let height_maxLevel = 150;
    let result = height / height_maxLevel;
    let betweenLevel = Math.ceil(Math.log2(result));
    let level = maxLevel - betweenLevel;
    if (level < minLevel) {
        level = minLevel;
    }
    if (level > maxLevel) {
        level = maxLevel;
    }
    return level;
}

// 根据相机高度获取地图层级 方法2
export function calculateMapLevel(viewer) {
    var level;
    let height = Math.ceil(viewer.camera.positionCartographic.height);
    let x = 93750;
    if (height > 512 * x) { //24000000
        level = 6;
    } else if (height > 256 * x) { //24000000
        level = 7;
    } else if (height > 128 * x) { //1200 0000
        level = 8;
    } else if (height > 64 * x) { //600 0000
        level = 9;
    } else if (height > 32 * x) { //300 0000
        level = 10;
    } else if (height > 16 * x) { //150 0000
        level = 11;
    } else if (height > 8 * x) { //75 0000
        level = 12;
    } else if (height > 4 * x) { //37 5000
        level = 13;
    } else if (height > 2 * x) { //187500
        level = 14;
    } else if (height > x) { //93750
        level = 15;
    } else if (height > x / 2) {
        level = 16;
    } else if (height > x / 4) {
        level = 17;
    } else if (height > x / 8) {
        level = 18;
    } else if (height > x / 16) {
        level = 19;
    } else if (height > x / 32) {
        level = 20;
    } else if (height > x / 64) {
        level = 21;
    } else if (height > x / 128) {
        level = 22;
    } else if (height > x / 256) {
        level = 23;
    } else if (height > x / 512) {
        level = 24;
    } else if (height > x / 1024) {
        level = 25;
    } else if (height > x / 2048) {
        level = 26;
    } else if (height > x / 4096) {
        level = 27;
    } else {
        level = 28;
    }
    return level;
}

// 笛卡尔坐标转成经纬度
function cartographicToLoacation(position) {
    //将笛卡尔坐标转化为经纬度坐标
    var cartographic = Cesium.Cartographic.fromCartesian(position);
    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
    // 经纬度转笛卡尔
    // var location = Cesium.Cartesian3.fromDegrees(longitude, latitude);

}
// 求多边形重心
export function getPolygonAreaCenter(points) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_area = 0;
    var p1 = points[1];
    var p2;
    var area = 0;
    for (var i = 2; i < points.length; i++) {
        p2 = points[i];
        area = Area(points[0], p1, p2);
        sum_area += area;
        sum_x += (points[0][0] + p1[0] + p2[0]) * area;
        sum_y += (points[0][1] + p1[1] + p2[1]) * area;
        p1 = p2;
    }
    var xx = sum_x / sum_area / 3;
    var yy = sum_y / sum_area / 3;
    return [xx, yy];
    // return new Point(xx, yy, new SpatialReference({ wkid: 4326 }));
}

function Area(p0, p1, p2) {
    var area = 0.0;
    area = p0[0] * p1[1] + p1[0] * p2[1] + p2[0] * p0[1] - p1[0] * p0[1] - p2[0] * p1[1] - p0[0] * p2[1];
    return area / 2;
}
export function getColor(colorStr) {
    let colorArr = colorStr.split(",");
    let r = parseFloat(colorArr[0]) / 255.0;
    let g = parseFloat(colorArr[1]) / 255.0;
    let b = parseFloat(colorArr[2]) / 255.0;
    let a = parseFloat(colorArr[3]);
    return new Cesium.Color(r, g, b, a);
}
export function transitionColor(colorStr) {
    let colorArr = colorStr.split(",");
    let r = parseFloat(colorArr[0]) / 255.0;
    let g = parseFloat(colorArr[1]) / 255.0;
    let b = parseFloat(colorArr[2]) / 255.0;
    let a = parseFloat(colorArr[3]);
    return new Cesium.ColorGeometryInstanceAttribute(r, g, b, a);
}