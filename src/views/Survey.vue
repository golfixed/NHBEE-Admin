<template>
  <div class="isdesktop">Survey</div>
</template>

<script>
import layout_default from "@/layouts/main.vue";
export default {
  name: "survey",
  created() {
    this.$emit(`update:layout`, layout_default);
  }
};
</script>

<style>
</style>