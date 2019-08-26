<template>
  <div v-if="isLoggedIn" class="home-display isdesktop ismobile">
    Dashbaord
  </div>
</template>

<script>
import layout_default from '@/layouts/main.vue'
import layout_login from '@/layouts/login.vue'

export default {
  name: "home",
  components: {},
  created () {
    if (this.isLoggedIn) this.$emit(`update:layout`, layout_default)
    else this.$emit(`update:layout`, layout_login)
  },
  watch: {
    isLoggedIn (newval) {
      if (newval) this.$emit(`update:layout`, layout_default)
      else this.$emit(`update:layout`, layout_login)
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    }
  },
  methods: {
    refreshToken () {
      this.$store.getters.forceRefresh()
    }
  }
};
</script>
<style scoped>
.home-display {
  width: 1200px;
}
</style>

