// 获取鼠标当前位置的经纬度高
<template>
  <div class="container">
    经度：{{ lng }} 纬度：{{ lat }} 视角高度：{{ cameraHeight }}
  </div>
</template>
<script>
var Cesium = require("cesium/Cesium");
export default {
  props: ["mapViewer"],
  data() {
    return {
      lng: "",
      lat: "",
      cameraHeight: "",
      level: "",
    };
  },
  mounted() {
    var handler = new Cesium.ScreenSpaceEventHandler(
      this.mapViewer.scene.canvas
    );
    let that = this;
    let ellipsoid = this.mapViewer.scene.globe.ellipsoid;
    handler.setInputAction(function (movement) {
      var earthCartesian = that.mapViewer.camera.pickEllipsoid(
        movement.endPosition,
        ellipsoid
      );

      if (earthCartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(earthCartesian);
        that.lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
        that.lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
        let height = Math.ceil(
          that.mapViewer.camera.positionCartographic.height
        );
        // let level =
        // let altitude = that.mapViewer.scene.globe.getHeight(cartographic); // 获取海拔高度，只有开启地形高程才精确
        that.cameraHeight =
          height > 1000
            ? (height / 1000).toFixed(3) + "千米"
            : height.toFixed(2) + "米";
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    
    //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
    handler.setInputAction(function (wheelment) {
      let height = Math.ceil(that.mapViewer.camera.positionCartographic.height);
      that.cameraHeight =
        height > 1000
          ? (height / 1000).toFixed(3) + "千米"
          : height.toFixed(2) + "米";
    }, Cesium.ScreenSpaceEventType.WHEEL);

    // 监听地图移动结束
    this.mapViewer.scene.camera.moveEnd.addEventListener(() => {
      let height = Math.ceil(that.mapViewer.camera.positionCartographic.height);
      that.cameraHeight =
        height > 1000
          ? (height / 1000).toFixed(3) + "千米"
          : height.toFixed(2) + "米";
    });
  },
  methods: {},
};
</script>
<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 10px;
  bottom: 20px;
  width: 450px;
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
</style>
