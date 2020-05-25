<template>
  <div id="app">
    <router-view></router-view>
    <Footer v-if="this.$route.path === '/'"></Footer>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,500,700&display=swap');

html {
  font-family: 'IBM Plex Sans', sans-serif;
  letter-spacing: -0.03em;
  background: #F58B44;
  color: #1a1a1a;
  // padding-bottom: 8em;
  @media screen and (max-width: 768px) {
    font-size: 10pt;
  }
}
body {
  margin: 0;
}
* {
  box-sizing: border-box;
}
</style>

<script>
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Footer,
  },
};
</script>
