import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home.vue'
import NewBid from './views/NewBid.vue'
import Profile from './views/Profile.vue'
import Show from './views/Show.vue'

import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({  
  mode: 'history',
  base: process.env.PUBLIC_URL,
  routes: [

    {
      path: '/',
      name: 'home',
      component: Home
    },

    {
      path: '/newbid',
      name: 'newbid',
      component: NewBid
    },

    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },

    {
      path: '/show/:contractaddress/:tokenid',
      name: 'show',
      component: Show
    },

    

   
    {
      path: '/*',
      component: NotFound
    },
  ]
})
