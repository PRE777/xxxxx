import CesiumNavigation from "cesium-navigation-es6";
var Cesium = require('cesium/Cesium');

export function mapControl(viewer, originalPosition = null) {
    if (originalPosition == null) {
        // 默认中国位置
        originalPosition = {
            lng: 115.435314,
            lat: 39.960521,
            height: 5000000.0,
        }
    }
    var options = {};
    // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和Cesium.Rectangle.
    options.defaultResetView = Cesium.Cartographic.fromDegrees(
        originalPosition.lng,
        originalPosition.lat,
        originalPosition.height,

    );
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    options.enableCompass = true;
    // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件 将不会添加到地图中。
    options.enableZoomControls = true;
    // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    options.enableDistanceLegend = true;
    // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    options.enableCompassOuterRing = true;
    CesiumNavigation(viewer, options);

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
            originalPosition.lng,
            originalPosition.lat,
            originalPosition.height,
        ), // 广西 108.01083049, 21.54887109
    });
}