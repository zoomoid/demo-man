import { createApp } from "vue";
import router from "./router";
import { key, store } from "./store";
import "./assets/css/tailwind.scss";

// TypeScript error? Run VSCode command
// TypeScript: Select TypeScript version - > Use Workspace Version
import App from "./App.vue";

const app = createApp(App).use(router).use(store, key).mount("#app");

export default app;
