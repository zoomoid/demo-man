import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";
import Page from "@/views/Page.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/:id",
    name: "Page",
    component: Page,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

export default router;
