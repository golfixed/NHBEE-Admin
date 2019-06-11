<template>
  <div class="home">HOME PAGE TEST</div>
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
