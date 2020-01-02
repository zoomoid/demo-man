<template>
  <div class="wrapper">
    <Breadcrump></Breadcrump>
    <div class="fill"></div>
    <div class="release">
      <h2 class="artist">Diode Eins</h2>
      <h1 class="title">Schwerelos (Zoomoid Remix)</h1>
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
          tags: ['new'],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
// .wrapper {
//   padding: 2em 2em 2em 2em;
// }

.players {
  padding: 2em 2em 2em 2em;
}
.fill {
  height: 24em;
  background: #ff9e22
}
.release {
  padding: 2em 2em 2em 2em;
  .artist {
    letter-spacing: -0.02em;
    font-size: 2.5em;
    font-weight: 800;
    line-height: 1;
    margin: 0;
  }
  .title {
    letter-spacing: -0.04em;
    font-weight: 200;
    font-size: 3em;
    line-height: 1;
    margin: 0;
  }
}
</style>
