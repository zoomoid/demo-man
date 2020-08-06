<template>
  <div>
    <audio ref="audio" autoplay="false"></audio>
    <transition name="slide">
      <div class="playerbar" v-if="!intersecting">
        <div class="metadata">
          <span class="artist">{{artist}}</span>
          <router-link :to="`/${url}`"><span class="title">{{title}}</span></router-link>
        </div>
        <div class="action">
          <div class="play-state">
            <i @click="pause" v-if="globalPlayState === 'playing'"
              class="material-icons-sharp">
              pause
            </i>
            <i @click="play" v-else-if="globalPlayState === 'paused'"
              class="material-icons-sharp paused">
              play_arrow
            </i>
            <i @click="replay" v-else-if="globalPlayState === 'finished'"
              class="material-icons-sharp">
              replay
            </i>
          </div>
        </div>
        <div class="waveform-container">
          <div class="scrobble-bar" @click="setPosition"></div>
          <div class="overlay" :style="{ width: `${100 - visualProgress}%` }"></div>
          <div draggable="true" class="playhead" :style="{ left: `${visualProgress}%` }"></div>
          <div class="waveform"></div>
        </div>
        <div class="spacer"></div>
        <div class="timestamp">
          <span class="current">{{currentTime}}</span>
          <span class="separator"> : </span>
          <span class="total">{{totalDuration}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import humanReadableTimestamp from '../main';

export default {
  computed: {
    currentTime() {
      return humanReadableTimestamp(this.localProgress);
    },
    totalDuration() {
      return humanReadableTimestamp(this.localDuration);
    },
    visualProgress() {
      return (this.localProgress / this.localDuration) * 100;
    },
    localProgress() {
      return this.progress[this.url];
    },
    localDuration() {
      return this.duration[this.url];
    },
    ...mapGetters([
      'mp3',
      'url',
      'title',
      'artist',
      'progress',
      'duration',
      'volume',
      'playState',
      'globalPlayState',
      'intersecting',
      'seek',
    ]),
  },
  watch: {
    seek(t) {
      const s = this.handleAudioElement(t);
      this.$refs.audio.currentTime = s;
    },
    volume(v) {
      this.$refs.audio.volume = v;
    },
    globalPlayState(s) {
      switch (s) {
        case 'playing':
          this.$refs.audio.play().then(() => {});
          break;
        case 'paused':
          this.$refs.audio.pause();
          break;
        case 'finished': default:
          break;
      }
    },
  },
  methods: {
    updateVolume(vol) {
      this.$store.commit({
        type: 'updateVolume',
        volume: vol,
      });
    },
    updateProgress() {
      if (this.globalPlayState === 'playing') {
        const t = parseInt(this.$refs.audio.currentTime, 10);
        this.$store.commit({
          type: 'updateProgress',
          progress: t,
          url: this.url,
        });
      }
    },
    handleAudioElement(t) {
      const { seekable } = this.$refs.audio;
      let seekTarget = t;
      if (seekable.start(0) > t) {
        seekTarget = seekable.start(0);
      } else if (seekable.end(0) < t) {
        seekTarget = seekable.end(0);
      }
      return seekTarget;
    },
    handleFinished() {
      this.$store.commit({
        type: 'updatePlayState',
        playState: 'finished',
        url: this.url,
      });
      this.$store.commit({
        type: 'updateProgress',
        url: this.url,
        progress: 0,
      });
    },
    setPosition(e) {
      const pos = e.target.getBoundingClientRect();
      const seekPos = (e.clientX - pos.left) / pos.width;
      const seekTarget = this.localDuration * seekPos;
      this.$store.commit({
        type: 'seek',
        seek: seekTarget,
        url: this.url,
      });
    },
    play() {
      this.$store.commit({
        type: 'updatePlayState',
        url: this.url,
        playState: 'playing',
      });
    },
    pause() {
      this.$store.commit({
        type: 'updatePlayState',
        url: this.url,
        playState: 'paused',
      });
    },
    replay() {
      this.$store.commit({
        type: 'seek',
        url: this.url,
        seek: 0,
      });
      this.$store.commit({
        type: 'updatePlayState',
        url: this.url,
        playState: 'playing',
      });
    },
  },
  mounted() {
    this.$refs.audio.addEventListener('timeupdate', this.updateProgress);
    this.$refs.audio.addEventListener('ended', this.handleFinished);
    const vm = this;
    this.$store.subscribeAction({
      before: () => {
        vm.$store.commit({
          type: 'updatePlayState',
          playState: 'paused',
          url: vm.url,
        });
        vm.$refs.audio.pause();
        vm.$refs.audio.src = '';
      },
      after: (_, state) => {
        vm.$refs.audio.src = encodeURI(state.mp3);
        vm.$refs.audio.currentTime = state.progress[state.url];
        vm.$store.commit({
          type: 'updatePlayState',
          playState: 'playing',
          url: vm.url,
        });
      },
    });
  },
};
</script>

<style lang="scss" scoped>
@keyframes slide {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0%);
  }
}

.slide-enter-active {
  animation: slide .2s;
}
.slide-leave-active {
  animation: slide .2s reverse;
}

.playerbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: #242424;
  // height: 4em;
  padding: 1em 1em;
  z-index: 5;
  flex-wrap: wrap;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.33);
  color: #ffffff;
  .action {
    background: none;
    border: none;
    outline: none;
    margin-right: 16px;
    line-height: 1;
    cursor: pointer;
    border-radius: 32px;
    padding: 4px;
    &:hover, &:active {
      background: rgba(0,0,0,0.15);
      color: #F58B44;
    }
  }
  .metadata {
    span {
      display: block;
    }
    .artist {
      font-size: 0.8em;
      opacity: 0.66;
    }
    a {
      color: inherit;
      text-decoration: none;
      &:hover, &:active {
        color: #F58B44;
      }
    }
    .title {
      font-weight: bold;
    }
    padding-right: 8px;
    @media screen and (max-width: 768px) {
      padding: 0.5em 1em;
    }
  }
  .timestamp {
    padding-right: 8px;
  }
  .spacer {
    flex-grow: 1;
    display: none;
  }
  .waveform-container {
    position: relative;
    height: 8px;
    flex-grow: 1;
    margin: 0 1em;
    .scrobble-bar {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 7;
    }
    .overlay {
      position: absolute;
      height: 100%;
      z-index: 3;
      right: 0;
      background-color: #242424;
      opacity: 0.8;
    }
    .playhead {
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      background: #F58B44;
      z-index: 6;
      margin-top: -4px;
      cursor: pointer;
    }
    .waveform {
      height: 100%;
      z-index: 2;
      opacity: 0.5;
      width: 100%;
      border-radius: 4px;
      background-size: 100% 100%;
      opacity: 1;
      background-color:#F58B44;
    }
    @media screen and (max-width: 768px) {
      width: 100%;
      position: fixed;
      display: block;
      bottom: 0;
      margin: 0.25em 0 0;
      .spacer {
        display: block;
      }
      .waveform {
        border-radius: 0px;
      }
    }
  }
  @media screen and (max-width: 768px) {
    padding: 0 0 6px;
    .spacer {
      display: block;
    }
  }
}
</style>
