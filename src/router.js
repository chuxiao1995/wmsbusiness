import Vue from 'vue'
import Router from 'vue-router'

import inbound from './components/inbound.vue'
import outbound from './components/outbound.vue'
// import manualorder from './components/ioorder/manualorder.vue'
// import autorder from './components/ioorder/autorder.vue'
// import outmanualorder from './components/ioorder/outmanualorder.vue'
// import outautorder from './components/ioorder/outautorder.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/business/inbound',
      // redirect: '/outbound',

    },
    // { path: '/', redirect: { name: 'inbound' } },
    // { path: '/b', redirect: { name: 'outbound' } },
    {
      path: '/business/inbound',
      component: inbound,
      // children: [
      //   {
      //     path: 'manualorder',
      //     name: 'manualorder',
      //     component: manualorder
      //   },
      //   {
      //     path: 'autorder',
      //     name: 'autorder',
      //     component: autorder
      //   }
      // {
      //   path: 'manualorder/:id',
      //   name: 'manualorder',
      //   component: manualorder
      // },
      // {
      //   path: 'autorder/:id',
      //   name: 'autorder',
      //   component: autorder
      // }
      // ]
    },
    {
      path: '/business/outbound',
      component: outbound,
      // children: [
      //   {
      //     path: 'manualorder',
      //     name: 'manualorder',
      //     component: outmanualorder
      //   },
      //   {
      //     path: 'autorder',
      //     name: 'autorder',
      //     component: outautorder
      //   }
      // {
      //   path: 'manualorder/:id',
      //   name: 'manualorder',
      //   component: outmanualorder
      // },
      // {
      //   path: 'autorder/:id',
      //   name: 'autorder',
      //   component: outautorder
      // }
      // ]
    },
    {
      path: '/view',
      component: () => import('./components/view.vue')
    },
    {
      path: '/tree',
      component: () => import('./components/tree/tree.vue')
    }
  ],
  mode: 'hash'
})