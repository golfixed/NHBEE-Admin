<template>
  <div class="home-display isdesktop ismobile">HOME PAGE TEST</div>
</template>

<script>
import layout_default from "@/layouts/main.vue";
export default {
  name: "home",
  components: {},
  created() {
    this.$emit(`update:layout`, layout_default);
  }
};
</script>
<style scoped>
.home-display {
  width: 1200px;
}
</style>

