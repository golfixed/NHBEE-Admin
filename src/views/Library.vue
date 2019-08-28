<template>
  <div class="isdesktop">Library</div>
</template>

<script>
import layout_default from "@/layouts/main.vue";
export default {
  name: "library",
  created() {
    this.$emit(`update:layout`, layout_default);
  }
};
</script>

<style>
</style>
