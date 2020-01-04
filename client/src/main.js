import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '@/App.vue';
import Home from '@/views/Home.vue';
import Schwerelos from '@/views/Schwerelos.vue';
import MovedPermanently from '@/views/301.vue';
import Bounces from '@/views/Bounces.vue';
import Cover from '@/views/Cover.vue';
import Delay from '@/views/Delay.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/', component: Home,
  },
  {
    path: '/schwerelos', component: Schwerelos,
  },
  {
    path: '/schwerelos/bounces', component: Bounces,
  },
  {
    path: '/schwerelos/cover', component: Cover,
  },
  {
    path: '/301', component: MovedPermanently,
  },
  {
    path: '/delay', component: Delay,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
