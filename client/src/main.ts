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

app.provide("version", process.env.VERSION);
app.provide("baseUrl", process.env.BASE_URL);
app.provide("apiUrl", process.env.API_URL);

app.use(router);
app.mount("#app");

export default app;

export function toTime(val: number): string {
  try {
    const hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
    return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
  } catch (e) {
    return "00:00";
  }
}

export function rgbToHex(color: string): string {
  return color
    .split(", ")
    .map((c) => parseInt(c, 10).toString(16))
    .reduce((p, c) => p + c);
}
