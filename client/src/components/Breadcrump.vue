<template>
  <div
    class="breadcrump"
    :style="{
      '--accent': theme.accent,
      '--textColor': theme.textColor,
      '--color': theme.color,
    }"
  >
    <router-link to="/">
      <i class="material-icons-outlined"> arrow_back </i>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { Theme } from "../models/Theme";

export default defineComponent({
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    }
  }
});
</script>

<style lang="sass" scoped>
.breadcrump
  padding: 1em 2em 1em 2em
  color: rgba(var(--textColor),1)
  a
    color: inherit
    .material-icons-sharp
      vertical-align: middle
      line-height: 32px
      width: 32px
      height: 32px
      text-align: center
      &:hover, &:active, .muted
        text-shadow: 0 2px 2px rgba(0,0,0,0.2)
        border-radius: 32px
</style>
