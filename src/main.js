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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
