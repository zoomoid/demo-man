<template>
  <div id="app">
    <GlobalPlayer></GlobalPlayer>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,500,700&display=swap');

html {
  font-family: 'IBM Plex Sans', sans-serif;
  letter-spacing: -0.03em;
  @media screen and (max-width: 768px) {
    font-size: 10pt;
  }
  background: #242424;
}
body {
  margin: 0;
}
* {
  box-sizing: border-box;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}
</style>

<script>
import GlobalPlayer from './components/GlobalPlayer.vue';

export default {
  components: {
    GlobalPlayer,
  },
};
</script>
