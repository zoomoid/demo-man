<template>
  <div class="wrapper">
    <Breadcrump></Breadcrump>
    <div class="fill">
      <img
        src="https://cdn.occloxium.com/i/zoomoid/demo/schwerelos/draft_01.png"
      />
    </div>
    <div class="release">
      <h2 class="artist">Diode Eins</h2>
      <h1 class="title">Schwerelos (Zoomoid Remix)</h1>
    </div>
    <AudioManager class="players" :queue="queue" :accentColor="accentColor"></AudioManager>
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
          name: 'Demo 01 <i>(pre master)</i>',
          url: 'https://cdn.occloxium.com/a/zoomoid/demo/demo_01.mp3',
          tags: [],
        },
        {
          id: 2,
          name: 'Demo 02 <i>(pre master)</i>',
          url: 'https://cdn.occloxium.com/a/zoomoid/demo/pre_master_demo_02.mp3',
          tags: [],

        },
        {
          id: 3,
          name: 'Demo 03 <i>(post master)</i>',
          url: 'https://cdn.occloxium.com/a/zoomoid/demo/post_master_demo_03.mp3',
          tags: [],

        },
        {
          id: 4,
          name: 'Demo 04 <i>(post master)</i>',
          url: 'https://cdn.occloxium.com/a/zoomoid/demo/post_master_demo_04.mp3',
          tags: [],

        },
        {
          id: 5,
          name: 'Demo 05 <i>(post master)</i>',
          url: 'https://cdn.occloxium.com/a/zoomoid/demo/post_master_demo_05.mp3',
          tags: [],
        },
        {
          id: 7,
          name: 'Demo 07 <i>(post master)</i>',
          url: 'https://cdn.occloxium.com/a/zoomoid/demo/post_master_demo_07.mp3',
          tags: [],
        },
        {
          id: 9,
          name: 'Demo 09 <i>(post master)</i>',
          url: 'https://cdn.occloxium.com/a/zoomoid/demo/post_master_demo_09_normalized.mp3',
          tags: ['new'],
        },
      ],
      accentColor: 'linear-gradient(135deg, rgb(109,23,229) 0%, rgb(109,23,229) 19.9%, rgb(255,0,0) 20%, rgb(255,0,0) 39.9%, rgb(255,174,13) 40%, rgb(255,174,13) 59.9%, rgb(133,255,13) 60%, rgb(133,255,13) 79.9%, rgb(0,216,255) 80%, rgb(0,216,255) 100%)',
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/views/frame';
</style>
