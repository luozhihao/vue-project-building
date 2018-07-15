import Vue from 'vue'
import Router from 'vue-router'

const About = (resolve => {
    require.ensure(['../views/About.vue'], () => {
        resolve(require('../views/About.vue'))
    })
})

Vue.use(Router)

console.log(process.env.BASE_URL)

let base = `${process.env.BASE_URL}` + 'car';

let router = new Router({
  mode: 'history',
  base: base,
  routes: [
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})

router.beforeEach((to, from, next) => {
    next();
});

export default router