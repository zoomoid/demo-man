<template>
  <div class="wrapper">
    <Breadcrump></Breadcrump>
    <div class="fill">
      <img
        src="https://cdn.occloxium.com/i/zoomoid/covers/301/standard.jpg"
      />
    </div>
    <div class="release">
      <h2 class="artist">Zoomoid</h2>
      <h1 class="title">301 Moved Permanently</h1>
    </div>
    <AudioManager class="players" :queue="queue"></AudioManager>
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
          name: 'Monarch',
          url: 'https://cdn.occloxium.com/a/zoomoid/301/01_Monarch.mp3',
          tags: [],
        },
        {
          id: 2,
          name: 'Doppler',
          url: 'https://cdn.occloxium.com/a/zoomoid/301/02_Doppler.mp3',
          tags: [],

        },
        {
          id: 3,
          name: 'Elektron',
          url: 'https://cdn.occloxium.com/a/zoomoid/301/03_Elektron.mp3',
          tags: [],

        },
        {
          id: 4,
          name: 'Outer Space (Rework)',
          url: 'https://cdn.occloxium.com/a/zoomoid/301/04_Outer%20Space%20(Rework).mp3',
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
