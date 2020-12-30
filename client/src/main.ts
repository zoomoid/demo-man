import { createApp, onMounted } from "vue";

import router from "./router";
import { useStore } from "./store";

import "./assets/css/tailwind.scss";
import "./registerServiceWorker";

const app = createApp({
  setup() {
    const store = useStore();

    onMounted(() => {
      console.log(`Running on version ${process.env.VERSION}`);
    });

    return { store };
  }
});

app.config.globalProperties.version = process.env.VERSION;
app.config.globalProperties.baseUrl = process.env.BASE_URL;
app.config.globalProperties.apiUrl = process.env.API_URL;

app.use(router);
app.mount("#app");

export default app;
