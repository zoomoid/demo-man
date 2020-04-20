import Vue from "vue";
import VueRouter from "vue-router";
import UploadForm from "../components/UploadForm.vue";
import Success from "../components/Success.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/success",
    name: "Success",
    component: Success
  },
  {
    path: "/",
    name: "Upload",
    component: UploadForm
  }
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;
