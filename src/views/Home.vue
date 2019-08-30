<template>
  <div v-if="isLoggedIn" class="home-display isdesktop ismobile">
    Dashbaord
    <p v-if="analyticData">{{ analyticData }}</p>
  </div>
</template>

<script>
import layout_default from '@/layouts/main.vue'
import layout_login from '@/layouts/login.vue'
import axios from '@/axios.js'

export default {
  name: "home",
  components: {},
  data () {
    return {
      analyticData: {
        all: {},
        dimensions: {}
      }
    }
  },
  created () {
    if (this.isLoggedIn) {
      this.$emit(`update:layout`, layout_default)
      this.getAnalyticData()
    } else this.$emit(`update:layout`, layout_login)
  },
  watch: {
    isLoggedIn (newval) {
      if (newval) {
        this.$emit(`update:layout`, layout_default)
        this.getAnalyticData()
      } else this.$emit(`update:layout`, layout_login)
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    }
  },
  methods: {
    getAnalyticData () {
      axios('/admin/dashboard/analytic').then(response => {
        this.analyticData = response.data
      }).catch(error => {
        if (error.response && error.response.data)
          console.error("get analytic", error.response.data.error);
        else console.error("get analytic", error.message);
      })
    }
  }
};
</script>
<style scoped>
.home-display {
  width: 1200px;
}
</style>

