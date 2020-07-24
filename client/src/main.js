import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '@/App.vue';
import Home from '@/views/Home.vue';
import Page from '@/views/Page.vue';
import './registerServiceWorker';

Vue.use(VueRouter);

const routes = [
  {
    path: '/', component: Home,
  },
  {
    path: '/:id', component: Page,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
  data() {
    return {
      version: process.env.VERSION,
      apiEP: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://demo.zoomoid.de',
      publicEP: process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : 'https://demo.zoomoid.de',
    };
  },
}).$mount('#app');
