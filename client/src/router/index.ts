import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Page from "../views/Page.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Home,
    name: "home"
  },
  {
    path: "/:id",
    component: Page,
    name: "page"
  }
];

export default createRouter({
  history: createWebHistory(),
  routes: routes
});
