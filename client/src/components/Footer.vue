<template>
  <footer class="mx-auto text-center pt-8">
    <a href="https://github.com/occloxium/demo-man">
      <span class="emoji">🎧</span>
      <span class="text">demo-man</span> </a
    ><i>&mdash;</i>
    <a href="https://alexander.bartolomey.me/">
      <span class="emoji">👨‍💻</span>
      <span class="text">@zoomoid</span> </a
    ><i>&mdash;</i>
    <span class="text-sm px-4 opacity-50"> {{ $root.version }} </span>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  props: {
    "is-empty": {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="sass">
footer
  a
    @apply py-2 px-4 opacity-50
    @apply hover:opacity-100
    .text
      @apply hover:underline
    .emoji
      @apply pr-2
  i
    @apply opacity-50
</style>
