<template>
  <footer>
    <a href="https://github.com/occloxium/demo-man">🎧 demo-man</a><span>&mdash;</span><a href="https://alexander.bartolomey.me/">👨‍💻 @zoomoid</a>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    'is-empty': {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
footer {
  // margin-top: 2em;
  border-top: solid 1px rgba(0,0,0,0.33);
  padding: 3em 0;
  font-size: 20px;
  text-align: center;
  a {
    padding: 8px 16px 32px;
    color: inherit;
    text-decoration: none;
    opacity: 0.8;
    &:hover, &:active {
      opacity: 1;
      text-decoration: underline;
    }
  }
  span {
    opacity: 0.5;
  }
}
</style>
