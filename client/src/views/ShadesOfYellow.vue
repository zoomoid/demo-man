<template>
  <div class="wrapper">
    <Breadcrump></Breadcrump>
    <div class="fill">
      <img
        src="https://cdn.occloxium.com/i/zoomoid/covers/shades-of-yellow/cover.png"
      />
    </div>
    <div class="release">
      <h2 class="artist">Zoomoid</h2>
      <h1 class="title">Shades Of Yellow</h1>
    </div>
    <AudioManager class="players" :queue="queue" :accentColor="'#FFD600'"></AudioManager>
  </div>
</template>

<script>
import AudioManager from '@/components/AudioManager.vue';
import Breadcrump from '@/components/Breadcrump.vue';

export default {
  components: {
    AudioManager,
    Breadcrump,
  },
  data() {
    return {
      queue: [
        {
          id: 1,
          name: 'Shades Of Yellow',
          url: 'https://cdn.occloxium.com/a/zoomoid/demo/shades-of-yellow/01_Shades_Of_Yellow.mp3',
          tags: [],
        },
        {
          id: 2,
          name: 'The Moon',
          url: 'https://cdn.occloxium.com/a/zoomoid/demo/shades-of-yellow/02_The_Moon.mp3',
          tags: [],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/views/frame';
</style>
