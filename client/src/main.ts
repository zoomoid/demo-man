import Vue from "vue";

declare module "vue/types/vue" {
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface VueConstructor {
    $version?: string;
    $publicEP?: string;
    $apiEP?: string;
  }
}

import VueRouter from "vue-router";
import App from "./App.vue";
import Home from "./views/Home.vue";
import Page from "./views/Page.vue";
import "./registerServiceWorker";
import store from "./store";
import "./assets/css/tailwind.scss";

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

Vue.$version = process.env.VERSION;
Vue.$apiEP = process.env.API_URL;
Vue.$publicEP = process.env.BASE_URL;

export default new Vue({
  router,
  render: h => h(App),
  store,
  created() {
    console.log(`Currently running version ${Vue.$version}`);
  }
}).$mount("#app");
