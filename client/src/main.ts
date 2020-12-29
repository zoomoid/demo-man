import Vue from "vue";

import VueRouter from "vue-router";
import App from "./App.vue";
import Home from "./views/Home.vue";
import Page from "./views/Page.vue";
import "./registerServiceWorker";
import store from "./store";
import "./assets/css/tailwind.scss";


declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    apiEP?: string;
    publicEP?: string;
    version?: string;
  }
}


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/:id",
    component: Page
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

Vue.config.productionTip = false;

export default new Vue({
  router,
  render: h => h(App),
  store,
  version: process.env.VERSION,
  publicEP: process.env.BASE_URL,
  apiEP:  process.env.API_URL,
  created() {
    console.log(`Currently running version ${this.$version}`);
  }
}).$mount("#app");
