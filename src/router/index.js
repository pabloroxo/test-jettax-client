import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        if (!from.name && !store.getters['auth/authenticated']) {
          return next({
            path: '/'
          })
        }
        next()
      }
    }
  ]
})
