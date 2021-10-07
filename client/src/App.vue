<template>
  <div id="app">
    <global-player></global-player>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide } from "vue";
import GlobalPlayer from "./components/GlobalPlayer.vue";
export default defineComponent({
  name: "App",
  components: {
    GlobalPlayer,
  },
  setup() {
    const version = import.meta.env.VITE_VERSION;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const apiUrl = import.meta.env.VITE_API_URL;
    provide("version", version);
    provide("baseUrl", baseUrl);
    provide("apiUrl", apiUrl);
    onMounted(() => {
      console.log(`Running on version ${version}`);
      console.log(`\t with API @ ${apiUrl}`);
      console.log(`\t and APP @ ${baseUrl}`);
    });
    return {
      version,
      baseUrl,
      apiUrl
    };
  },
});
</script>

<style lang="scss">
@import url("https://use.typekit.net/kxk3lzb.css");

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.05s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
html {
  @apply bg-white;
}
</style>
