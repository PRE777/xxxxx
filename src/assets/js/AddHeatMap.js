import CesiumHeatmap from "cesium-heatmap/CesiumHeatmap.js";

export function createHeatMap(viewer, bounds) {
    var heatMap = CesiumHeatmap.create(
        viewer, // 视图层
        bounds, // 矩形坐标
        { // heatmap相应参数
            backgroundColor: 'rgba(0,0,0,0)',
            radius: 50,
            maxOpacity: .5,
            minOpacity: 0,
            blur: .75
        }
    );
    heatMap.setWGS84Data(0, 100, getData(300));
    viewer.zoomTo(viewer.entities);
}

// 动态数据 [{x: -97.6433525165054, y: 45.61443064377248, value: 11.409122369106317}]
function getData(length) {
    var data = [];
    for (var i = 0; i < length; i++) {
        var x = Math.random() * (-109 + 80) - 80;
        var y = Math.random() * (50 - 30) + 30;
        var value = Math.random() * 100;
        data.push({ x: x, y: y, value: value });
    }
    return data;
}