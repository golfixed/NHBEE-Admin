<template>
  <div style="text-align: center;">
    <h2>NHBEE System</h2>
    <div>
      <input v-model="username" type="text" placeholder="Username" :disabled="isLoading">
    </div>
    <div>
      <input v-model="password" type="password" placeholder="Password" :disabled="isLoading" @keypress.enter="login">
    </div>
    <div>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      <button @click="login" :disabled="isLoading">Login</button>
    </div>
    <slot/>
  </div>
</template>

<script>
import layout_default from '@/layouts/main.vue'

export default {
  name: 'layout_login',
  data () {
    return {
      username: '',
      password: '',
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    login () {
      if (this.isLoading) return ''
      this.isLoading = true
      this.errorMessage = ''
      const data = {
        username: this.username,
        password: this.password
      }
      this.$store.dispatch('login', data).then(data => {
        this.$emit(`update:layout`, layout_default)
        console.log('login success')
      }).catch(error => {
        console.error('login', error.message)
        this.errorMessage = error.message
      }).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>

<style>
</style>