<template>
  <div class="main-layout-display" style="margin: 0px; padding: 0px;">
    <sidebar style="grid-row: span 2;"/>
    <topbar/>
    <slot/>
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
.main-layout-display {
  display: grid;
  grid-template-columns: 200px calc(100vw - 200px);
  grid-template-rows: 50px calc(100vh - 50px);
}
</style>
