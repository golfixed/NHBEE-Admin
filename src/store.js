import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/axios'
import jwt from 'jsonwebtoken'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    refreshing: false
  },
  mutations: {
    auth_login (state, token) {
      state.token = token
    },
    auth_logout (state) {
      state.token = ''
    },
    refresh_start (state) {
      state.refreshing = true
    },
    refresh_end (state) {
      state.refreshing = false
    }
  },
  actions: {
    login ({ commit }, data) {
      return new Promise((resolve, reject) => {
        if (!data.username || !data.password) return reject(new Error('โปรดกรอก Username และ Password'))
        return axios({ url: '/admin/auth/login', data: data, method: 'POST' })
          .then(resp => {
            const token = resp.data.access_token
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
            commit('auth_login', token)
            return resolve(resp.data)
          })
          .catch(err => {
            localStorage.removeItem('token')
            commit('auth_logout')
            delete axios.defaults.headers.common['Authorization']
            if (err.response && err.response.data) return reject(new Error(err.response.data.error))
            else return reject(err)
          })
      })
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('auth_logout')
        localStorage.removeItem('token')
        axios.post('/admin/auth/logout').then(() => {
          console.log('reject token success')
        }).catch(error => {
          if (error.response && error.response.data) console.log('reject token error:', error.response.data.error)
          else console.log('reject token error:', error.message)
        })
        delete axios.defaults.headers.common['Authorization']
        return resolve()
      })
    },
    refresh ({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.refreshing) return reject(new Error('refreshing'))
        commit('refresh_start')
        console.log('refresh token')
        return axios({ url: '/admin/auth/refresh', method: 'POST' })
          .then(resp => {
            const token = resp.data.access_token
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
            commit('auth_login', token)
            console.log('refresh success')
            return resolve(resp.data)
          })
          .catch(err => {
            console.log('refresh error')
            if (err.response && err.response.data) return reject(new Error(err.response.data.error))
            else return reject(err)
          })
          .finally(() => {
            commit('refresh_end')
          })
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    isAdmin: (state, getters) => getters.payload.admin || false,
    payload: state => {
      if (state.token) {
        try {
          return jwt.decode(state.token)
        } catch {
          return {}
        }
      }
      return {}
    },
    checkToken: (state, getters) => () => {
      if (state.token) {
        const exp = new Date((getters.payload.exp || 0) * 1000)
        const now = new Date()
        const expire_in = (exp.getTime() - now.getTime()) / 1000
        if (expire_in < 1800 && expire_in > 0) {
          store.dispatch('refresh')
          return true
        } else if (expire_in <= 0) {
          store.dispatch('logout')
          return false
        } else {
          return true
        }
      }
    },
    forceRefresh: (state) => () => {
      if (state.token) {
        store.dispatch('refresh')
      }
    }
  }
})

export default store
