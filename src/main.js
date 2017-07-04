// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import layout from './components/layout'
import Router from 'vue-router'

Vue.config.productionTip = false
Vue.use(Router);


import about from './components/about.vue'
let router = new Router({
  mode:'history',
  routes :[
    {
      path :'/',
      redirect : '/home'
    },
    {
      path : '/about',
      component : about
    }
  ]
})
/* eslint-disable no-new */
new Vue({
  // 这个元素挂载是在 index.html 中
  el: '#app',
  router,
  template: '<layout/>',
  components: { layout }
})
