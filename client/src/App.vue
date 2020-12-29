<template>
  <div id="app" class="">
    <GlobalPlayer></GlobalPlayer>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

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

<script>
import GlobalPlayer from "./components/GlobalPlayer.vue";

export default {
  components: {
    GlobalPlayer,
  },
};
</script>
