import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from '@/axios.js'
import './registerServiceWorker'

Vue.config.productionTip = false

const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

// ตัวอย่างการใช้ Vue Analytics
// import VueAnalytics from 'vue-analytics'
// Vue.use(VueAnalytics, {
//   id: 'UA-146666158-1', // id นี้คือ NHBEE KMUTT แล้ว
//   router,
//   debug: {
//     sendHitTask: process.env.NODE_ENV === 'production'
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
