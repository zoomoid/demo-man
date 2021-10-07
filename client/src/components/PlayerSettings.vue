<template>
  <header class="settings">
    <div class="autoplay">
      <label
        for="autoplay"
        @click="autoplayControl"
        class="autoplay__label"
        :class="{
          'is-active': autoplay,
        }"
      >
        <span class="material-icons-outlined"> playlist_play </span>
        <span class="label"> Autoplay </span>
      </label>
    </div>
    <div class="loop">
      <label
        for="loop"
        @click="loopControl"
        class="loop__label"
        :class="{
          'is-active': loop,
        }"
      >
        <span class="material-icons-outlined"> repeat </span>
        <span class="label"> Loop </span>
      </label>
    </div>
    <div class="shuffle">
      <label
        for="shuffle"
        @click="shuffleControl"
        class="shuffle__label"
        :class="{
          'is-active': shuffle,
        }"
      >
        <span class="material-icons-outlined"> shuffle </span>
        <span class="label"> Shuffle </span>
      </label>
    </div>
  </header>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { MutationsTypes } from "../store/mutations";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "PlayerSettings",
  setup() {
    const store = useStore();

    const loop = ref(false);
    const shuffle = ref(false);
    const autoplay = ref(true);

    return {
      store,
      loop,
      shuffle,
      autoplay,
    };
  },
  methods: {
    updatePlaybackSettings(): void {
        this.store.commit(MutationsTypes.setPlaybackSettings, { shuffle: this.shuffle, loop: this.loop, autoplay: this.autoplay });
    },
    shuffleControl(): void {
      this.shuffle != this.shuffle;
      this.updatePlaybackSettings();
    },
    loopControl(): void {
      this.loop != this.loop;
      this.updatePlaybackSettings();
    },
    autoplayControl(): void {
      this.autoplay != this.autoplay;
      this.updatePlaybackSettings();
    }
  }
});
</script>

<style lang="sass" scoped>
=settings-controls
  user-select: none
  cursor: pointer
  align-items: center
  color: rgba(var(--textColor), 0.33)
  @apply pt-4 px-4 text-center
  span:last-child
    opacity: 0
    text-align: center
    transform: translateY(6px)
    display: block
    transition: opacity 0.1s ease, transform 0.1s ease
  &:hover,
  &:active
    span:last-child
      opacity: 1
      width: auto
      transform: translateY(0)

.settings
  @apply pt-4 flex items-center
  .autoplay,
  .loop
    label
      +settings-controls
      &.is-active
        color: rgba(var(--textColor), 1)
      span:first-child
        @apply mr-1 block text-center

  &.loop label
    @apply pl-3

  .spacer
    @apply flex-grow
</style>
