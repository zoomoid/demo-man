<template>
  <footer>
    <a href="https://github.com/occloxium/demo-man">
      <span class="emoji">🎧</span>
      <span class="text">demo-man</span>
    </a><span>&mdash;</span>
    <a href="https://alexander.bartolomey.me/">
      <span class="emoji">👨‍💻</span>
      <span class="text">@zoomoid</span>
    </a>
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
  padding: 0.5em 0;
  font-size: 12pt;
  text-align: center;
  a {
    padding: 8px 16px;
    color: inherit;
    text-decoration: none;
    opacity: 0.5;
    .emoji::after {
      content: ' '
    }
    &:hover, &:active {
      opacity: 1;
      .emoji {
        text-decoration: none;
      }
      .text {

        text-decoration: underline;
      }
    }
  }
}
</style>
