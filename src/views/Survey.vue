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
// import axios from '@/axios.js'

// export default {
//   name: 'survey',
// created () {
//   // test get file excel
//   axios({
//     method: 'post',
//     url: '/admin/survey/full',
//     data: {
//       // id: [1,2]
//       id: 'all'
//     }
//   }).then(response => {
//     console.log('survey', response.data)
//     const url = response.data.url
//     // window.open(url, 'blank')
//   }).catch(error => {
//     console.error('survey', error.message, error.response.data)
//   })
// }
// }
</script>

<style>
</style>