import Vue from "vue";
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
    component: Home,
  },
  {
    path: "/:id",
    component: Page,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

Vue.config.productionTip = false;

export default new Vue({
  router,
  render: (h) => h(App),
  store,
  data() {
    return {
      version: process.env.VERSION,
      apiEP:
        process.env.NODE_ENV === "development"
          ? "http://localhost:8080/api/v1/demo"
          : "https://demo.zoomoid.de/api/v1/demo",
      publicEP:
        process.env.NODE_ENV === "development"
          ? "http://localhost:8081"
          : "https://demo.zoomoid.de",
    };
  },
}).$mount("#app");
