<template>
  <div>

    <div v-if="!queue">
      <span>No tracks added yet...</span>
    </div>
    <div v-else>
      <div v-for="player in queue" v-bind:key="player.id">
        <AudioPlayer
          :id="player.id"
          :name="player.name"
          :file="player.url"
          :playStateOverrideBy="currentlyPlayingPlayer"
          v-on:play="setPlayStateOverride"
          v-on:finish="resetPlayStateOverride"
          v-on:progress="updateProgress"
          :tags="player.tags || []"
          :accentColor="accentColor"
          :waveformUrl="player.waveformUrl"
          :no="player.no"
          :additionalData="player.additionalData"
        ></AudioPlayer>
      </div>
      <div class="footer">
        <Footer></Footer>
      </div>
      <transition name="slide">
        <div class="playerbar" v-if="this.currentlyPlayingPlayer != -1">
          <button class="action">
            <i @click="stopPlayback" class="material-icons-sharp">
              stop
            </i>
          </button>
          <div class="metadata">
            <span class="artist">{{this.currentlyPlaying.additionalData.artist}}</span>
            <span class="title">{{this.currentlyPlaying.name}}</span>
          </div>
          <div class="spacer"></div>
          <div class="timestamp">
            <span class="current">{{this.currentTime}}</span>
            <span class="separator"> : </span>
            <span class="total">{{this.totalDuration}}</span>

          </div>
          <div class="waveform-container">
            <div class="overlay" :style="{ width: `${100 - progress}%` }"></div>
            <img class="waveform" :src="this.currentlyPlaying.waveformUrl.small"/>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    AudioPlayer,
    Footer,
  },
  props: {
    queue: {
      type: Array,
      default: undefined,
    },
    accentColor: {
      type: String,
      default: '#F58B44',
    },
  },
  data() {
    return {
      currentlyPlayingPlayer: -1,
      currentlyPlaying: null,
      progress: -1,
      currentTime: '',
      totalDuration: '',
    };
  },
  methods: {
    setPlayStateOverride(no) {
      this.currentlyPlayingPlayer = no;
      this.currentlyPlaying = this.queue.find((t) => t.no === no);
    },
    resetPlayStateOverride() {
      this.currentlyPlayingPlayer = -1;
    },
    updateProgress({ progress, currentTime, totalDuration }) {
      this.progress = progress;
      this.currentTime = currentTime;
      this.totalDuration = totalDuration;
    },
    stopPlayback() {
      this.currentlyPlayingPlayer = -1;
      this.currentlyPlaying = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.player {
  &:last-child {
    .player-wrapper.loaded {
      margin-bottom: 16px;
      border-bottom-left-radius: 16pt;
      border-bottom-right-radius: 16pt;
    }
  }
}
.footer {
  background: #ffffff;
  border-top: solid 1px rgba(0,0,0,0.33);
  padding: 3em 0;
}
.playerbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: white;
  // height: 4em;
  padding: 1em 2em;
  z-index: 5;
  flex-wrap: wrap;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.33);
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
    .title {
      font-weight: bold;
    }
    padding-right: 8px;
  }
  .timestamp {
    padding-right: 8px;
  }
  .spacer {
    flex-grow: 1;
  }
  .waveform-container {
    position: relative;
    height: 48px;
    width: 240px;
    @media screen and (max-width: 768px) {
      width: 100%;
      padding: 1em 2em 0;
      margin-bottom: 1em;
    }
    .overlay {
      position: absolute;
      height: 100%;
      z-index: 3;
      right: 0;
      background-color: #ffffff;
      opacity: 0.8;
    }
    .waveform {
      height: 100%;
      z-index: 2;
      opacity: 0.5;
      width: 100%;
    }
  }
}

@keyframes slide-in {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}

@keyframes slide-out {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(100%);
  }
}

.slide-enter-active {
  animation: slide-in ease .2s;
  animation-fill-mode: forwards;
}
.slide-leave-active {
  animation: slide-out ease .2s;
  animation-fill-mode: forwards;
}

</style>
