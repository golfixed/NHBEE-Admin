import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/post',
      name: 'post',
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/post.vue')
    },
    {
      path: '/library',
      name: 'library',
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/Library.vue')
    },
    {
      path: '/survey',
      name: 'survey',
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/Survey.vue')
    },
    {
      path: '/users',
      name: 'users',
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      },
      component: () => import('./views/Users.vue')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth || false
  const requiresAdmin = to.meta.requiresAdmin || false
  if (requiresAuth === true) {
    if (!store.getters.isLoggedIn) return next('/')
  }
  if (requiresAdmin === true) {
    if (store.getters.payload.admin !== true) return next('/')
  }
  if (store.getters.isLoggedIn) {
    if (!store.getters.checkToken()) return next('/')
  }
  return next()
})

export default router
