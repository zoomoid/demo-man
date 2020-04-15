<template>
  <div class="wrapper">
    <template v-if="this.error">
      <div class="error">
        <h1>404<br>Not Found</h1>
        <p>The song you were looking for could not be found.</p>
        <p class="err">{{ this.error }}</p>
        <router-link to="/">
          <i class="material-icons-sharp">arrow_back</i>
          <span>Go back</span>
        </router-link>
      </div>

    </template>
    <template v-else>
      <Breadcrump></Breadcrump>
      <div class="fill">
        <img :src="`data:image/gif;base64,${album.cover}`"/>
      </div>
      <div class="release">
        <h2 class="artist">{{album.artist}}</h2>
        <h1 class="title">{{album.title}}</h1>
      </div>
      <AudioManager class="players" :queue="queue" :accentColor="accentColor"></AudioManager>
    </template>
  </div>
</template>

<script>
import AudioManager from '@/components/AudioManager.vue';
import Breadcrump from '@/components/Breadcrump.vue';
import axios from 'axios';

export default {
  components: {
    AudioManager,
    Breadcrump,
  },
  data() {
    return {
      error: null,
      album: {},
      queue: [],
      accentColor: '#ffd600',
    };
  },
  mounted() {
    axios.get(`http://localhost:8080/api/stub/${this.$route.params.id}`).then((v) => {
      // at this point, v is an array of tracks. We assume they share the same
      // metadata, hence we just pick the first one and roll with it
      const f = v.data[0];
      this.album = {
        title: f.title,
        artist: f.albumartist,
        cover: f.cover,
      };
      this.queue = v.data.map((track) => ({
        id: track.track.no,
        name: track.title,
        url: track.url,
        tags: [],
      }));
    }).catch((err) => {
      this.error = err;
    });
  },
};
</script>

<style lang="scss" scoped>
@import '@/views/frame';
</style>
