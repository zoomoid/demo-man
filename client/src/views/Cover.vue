<template>
  <div class="wrapper">
    <Breadcrump></Breadcrump>
    <!-- <div class="fill"></div> -->

    <div class="entry">
      <div class="release">
        <h2 class="artist">Cover</h2>
      </div>
      <img
        src="https://cdn.occloxium.com/i/zoomoid/demo/schwerelos/draft_01.png"
      />
    </div>
  </div>
</template>

<script>
import Breadcrump from '@/components/Breadcrump.vue';

export default {
  components: {
    Breadcrump,
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
  background: #227aff;
}
.release {
  padding: 2em 0;
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
.entry {
  padding: 2em;
  max-width: 1024px;
  margin: 0 auto;
}
p {
  font-size: 16pt;
  line-height: 1.5;
}
img {
  display: block;
  width: 100%;
}
a {
  font-size: 16pt;
  color: #ffffff;
  font-weight: bold;
}
</style>
