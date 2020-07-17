<template>
  <div class="wrapper" :style="`--accent: ${this.accent}; --primary: ${this.primary}`">
    <template v-if="this.error">
      <div class="error">
        <h1>404<br>Not Found</h1>
        <p>The song you were looking for could not be found.</p>
        <!-- <p class="err">{{ this.error }}</p> -->
        <router-link to="/">
          <i class="material-icons-sharp">arrow_back</i>
          <span>Go back</span>
        </router-link>
      </div>
    </template>
    <template v-else>
      <Breadcrump></Breadcrump>
      <div class="spacer"></div>
      <div class="fill">
        <img :src="`${this.$root.apiEP}/api/v1/demo/${this.$route.params.id}/cover`"/>
      </div>
      <div class="release">
        <h2 class="artist">{{album.artist}}</h2>
        <h1 class="title">{{album.title}}</h1>
      </div>
      <AudioManager class="players" :queue="queue"></AudioManager>
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
      accent: '#F58B44',
      primary: '#242424',
    };
  },
  mounted() {
    axios.get(`${this.$root.apiEP}/api/v1/demo/${this.$route.params.id}`).then((response) => {
      // at this point, v is an array of tracks. We assume they share the same
      // metadata, hence we just pick the first one and roll with it
      const f = response.data.data[0];
      this.album = {
        title: f.album,
        artist: f.albumartist,
        cover: f.cover,
      };
      this.queue = response.data.data.sort((a, b) => (a.no - b.no));
    }).catch((err) => {
      this.error = err;
    });
  },
};
</script>

<style lang="scss" scoped>
.release, .fill {
  padding: 2em 2em;
  width: 100%;
  // text-align: center;
  max-width: 1024px;
  margin: 0 auto;
}

.container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  .spacer {
    flex-grow: 1;
  }
}

.players {
  width: 100%;
  // text-align: center;
  // max-width: 1024px;
  margin: 0 auto;
}

.fill {
  padding-top: 0;
  img {
    display: block;
    margin: 2em auto;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    border-radius: 8px;
    width: 100%;
    max-width: 450px;
  }
}

.release {
  .artist {
    letter-spacing: -0.02em;
    font-size: 2.5em;
    font-weight: 500;
    line-height: 1;
    margin: 0;
  }
  .title {
    letter-spacing: -0.04em;
    font-weight: 700;
    font-size: 3em;
    line-height: 1;
    margin: 0;
  }
}

.error {
  font-size: 24pt;
  width: 50%;
  margin: 8em auto 0;
  h1 {
    font-weight: 900;
    font-size: 3em;
    margin-bottom: 16pt;
  }
  p {
    opacity: 0.3;
    font-size: 0.8em;
    margin: 0;
    &.err {
      font-size: 0.6em;
    }
  }
  a {
    margin-top: 1em;
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    outline: none;
    i {
      vertical-align: middle;
      padding-right: 1ex;
      font-size: 1em;
    }
  }
}
.wrapper {
  background-color: var(--primary);
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  .spacer {
    flex-grow: 1;
  }
}
</style>
