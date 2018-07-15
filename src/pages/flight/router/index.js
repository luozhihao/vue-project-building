import Vue from 'vue'
import Router from 'vue-router'

const Home = (resolve => {
    require.ensure(['../views/Home.vue'], () => {
        resolve(require('../views/Home.vue'))
    })
})

Vue.use(Router)

let base = `${process.env.BASE_URL}` + 'flight';

let router = new Router({
  mode: 'history',
  base: base,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    }
  ]
})

router.beforeEach((to, from, next) => {
    next();
});

export default router