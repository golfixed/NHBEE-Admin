<template>
  <div id="app" class="main-app">
    <component :is="layout">
      <router-view :layout.sync="layout"/>
    </component>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      layout: "div"
    };
  }
};
</script>
<style>
#app {
  margin: 0;
  padding: 0;
  font-family: "Kanit", sans-serif;
}
.main-app {
  margin: 0;
  padding: 0;
  font-family: "Kanit", sans-serif;
}
a,
a:hover {
  text-decoration: none !important;
}
</style>
