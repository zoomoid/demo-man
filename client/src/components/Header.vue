<template>
  <header>
    <div class="backdrop"></div>
    <img class="logo" src="~@/assets/demo-man-accent.svg" />
  </header>
</template>

<script>
export default {

}
</script>

<style lang="sass" scoped>
header
  position: relative
.logo
  width: 100%
  max-width: 350px
  margin: 0 auto
  display: block
  position: relative
  z-index: 1
  padding-top: 8em
  padding-bottom: 12em
  user-select: none
.backdrop
  position: absolute
  z-index: 0
  top: 0
  left: 0
  right: 0
  bottom: 0
  transform: skewY(-5deg) scaleY(1.3) translateY(-50%)
  transform-origin: 100% 0
  background-color: #1a1a1a
</style>
