<template>
  <div class="wrapper">
    <Breadcrump></Breadcrump>
    <div class="fill"></div>
    <div class="release">
      <h2 class="artist">Zoomoid</h2>
      <h1 class="title">Delay (Long Version)</h1>
      <p>Noone asked for this, here it is anyways!</p>
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
          name: 'Delay (Long Version)',
          url: 'https://cdn.occloxium.com/a/zoomoid/demo/delay_long_version.mp3',
          tags: [],
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
  background: #ff22c0;
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
