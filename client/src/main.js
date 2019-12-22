import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '@/App.vue';
import Home from '@/views/Home.vue';
import Schwerelos from '@/views/Schwerelos.vue';


Vue.use(VueRouter);


const routes = [
  {
    path: '/', component: Home,
  },
  {
    path: '/schwerelos', component: Schwerelos,
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
