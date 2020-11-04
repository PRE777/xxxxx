<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;

  background-image: linear-gradient(
    90deg,
    rgb(7, 17, 43) 0%,
    rgb(26, 43, 88) 50%,
    rgb(7, 17, 43) 100%
  );
  min-width: 1200px;
  min-height: 675px;
  position: relative;
}
</style>
