<template>
  <div class="main-layout-display" style="margin: 0px; padding: 0px;">
    <sidebar />
    <div class="display-area">
      <slot />
    </div>
  </div>
</template>

<script>
import topbar from "@/components/topbar.vue";
import sidebar from "@/components/sidebar.vue";
export default {
  name: "loginlayout",
  components: {
    topbar,
    sidebar
  }
};
</script>

<style>
.toolbar-panel-bg {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e8e8e8;
  margin: -20px;
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-width: 0 0 1px 0;
  margin-bottom: 0px;
}
.display-area {
  width: calc(100vw - 200px);
  margin-left: 200px;
}
.main-layout-display {
  display: grid;
  grid-template-columns: 200px calc(100vw - 200px);
}
@media screen and (min-width: 1024px) {
  .isdesktop {
    margin: 20px;
  }
}
p,
h1,
h2,
h3,
h4,
h5,
h6,
li,
ul {
  margin: 0;
  padding: 0;
}
.box {
  background-color: #ffffff;
  border: solid #e6e6e6;
  border-width: 1px;
  border-radius: 6px;
  padding: 20px;
}
</style>
