import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Home from './views/Home.vue';
import Page from './views/Page.vue';
import './registerServiceWorker';
import store from './store';

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
  store,

  data() {
    return {
      version: process.env.VERSION,
      apiEP: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://demo.zoomoid.de',
      publicEP: process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : 'https://demo.zoomoid.de',
    };
  },
}).$mount('#app');

export default function humanReadableTimestamp(val) {
  try {
    const hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
    return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss;
  } catch (e) {
    return '00:00';
  }
}
