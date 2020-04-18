import Vue from "vue";
import VueRouter from "vue-router";
import UploadForm from "../components/UploadForm.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Upload",
    component: UploadForm
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
