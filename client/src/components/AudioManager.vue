<template>
  <div :style="`--accent: ${this.accent}; --primary: ${this.primary}`">
    <div class="manager" v-if="!queue">
      <span>No tracks added yet...</span>
    </div>
    <div class="manager" v-else>
      <header class="settings">
        <div class="autoplay">
          <label for="autoplay" @click="autoplayControl" :class="[
            this.autoplay ? 'is-active autoplay__label' : 'autoplay__label'
          ]">
            <span class="material-icons-sharp">
              playlist_play
            </span>
            <span class="label">
              Autoplay
            </span>
          </label>
        </div>
        <div class="loop">
          <label for="loop" @click="loopControl" :class="[
            this.loop ? 'is-active loop__label' : 'loop__label'
          ]">
            <span class="material-icons-sharp">
              repeat
            </span>
            <span class="label">
              Loop
            </span>
          </label>
        </div>
        <div class="spacer"></div>
        <div class="play-all" :class="[this.playState === 'playing' ? 'is-disabled' : '']"
          @click="playAll">
          <span class="material-icons-sharp">
            play_arrow
          </span>
          <span>
            Play all
          </span>
        </div>
      </header>
      <div v-for="(track, index) in queue" v-bind:key="track._id">
        <AudioPlayer
          :track="track"
          :index="index"
          v-on:play="setState"
          v-on:pause="setState"
          v-on:finish="setState"
          v-on:progress="updateProgress"
          :overridePlayState="playIndex === index"
          :accent="accent"
          :highlighted="`${selected}` === `${index}`"
          v-on:update:select="select"
        ></AudioPlayer>
      </div>
      <div class="footer">
        <Footer></Footer>
      </div>
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
    accent: {
      type: String,
      default: '#F58B44',
    },
    primary: {
      type: String,
      default: '#1a1a1a',
    },
  },
  data() {
    return {
      playIndex: -1,
      progress: -1,
      currentTime: '',
      totalDuration: '',
      selected: -1,
      autoplay: true,
      loop: false,
      playState: '',
    };
  },
  methods: {
    updateProgress({ progress, currentTime, totalDuration }) {
      this.progress = progress;
      this.currentTime = currentTime;
      this.totalDuration = totalDuration;
    },
    select(no) {
      this.selected = no;
    },
    setState(state, no) {
      switch (state) {
        case 'play':
          this.playState = 'playing';
          this.playIndex = no;
          break;
        case 'pause':
          this.playState = 'paused';
          this.playIndex = -1;
          break;
        case 'finish':
          this.playState = 'finished';
          if (this.autoplay) {
            if (this.loop) {
              this.playIndex = (this.playIndex + 1) % this.queue.length;
            } else {
              this.playIndex = (this.playIndex + 1 < this.queue.length ? this.playIndex + 1 : -1);
            }
          } else {
            this.playIndex = -1;
          }
          break;
        default:
          break;
      }
    },
    loopControl() {
      this.loop = !this.loop;
    },
    autoplayControl() {
      this.autoplay = !this.autoplay;
    },
    playAll() {
      if (this.playState !== 'playing') {
        this.setState('play', 0);
      }
    },
  },
  mounted() {
    this.select(window.location.hash.replace('#', ''));
  },
};
</script>

<style lang="scss" scoped>
.manager {
  max-width: 1024px;
  margin: 0 auto;
  .settings {
    background: var(--primary);
    border-top-left-radius: 16pt;
    border-top-right-radius: 16pt;
    box-shadow: 0 2px 16px rgba(0,0,0,0.2);
    padding: 1em 2em 3em;
    margin-bottom: -28pt;
    display: flex;
    align-items: center;
    .autoplay, .loop {
      padding: 1em 1em 0 0;
      label {
        user-select: none;
        cursor: pointer;
        align-items: center;
        &.is-active {
          color: var(--accent);
        }
        span:first-child {
          margin-right: 4px;
          display: block;
          text-align: center;
        }
        span:last-child {
          opacity: 0;
          text-align: center;
          transform: translateY(6px);
          display: block;
          transition: opacity 0.1s ease, transform 0.1s ease;
        }
        &:hover, &:active {
          span:last-child {
            opacity: 1;
            width: auto;
            transform: translateY(0);
          }
        }
      }
    }
    &.loop label {
      padding-left: 12px;
    }
    .spacer {
      flex-grow: 1;
    }
    .play-all {
      border-radius: 32px;
      border: none;
      outline: none;
      color: var(--accent);
      font-size: 0.8em;
      text-transform: uppercase;
      font-weight: bold;
      padding: 1em 1em 0 0;
      text-align: center;
      transition: background-color 0.1s ease;
      span:last-child {
        opacity: 0;
        text-align: center;
        transform: translateY(6px);
        display: block;
        transition: opacity 0.1s ease, transform 0.1s ease;
      }
      &:hover, &:active {
        span:last-child {
          opacity: 1;
          width: auto;
          transform: translateY(0);
        }
      }
      cursor: pointer;
      &.is-disabled {
        cursor: initial;
        color: rgba(128,128,128,0.5);
      }
    }
  }
}

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
  background: var(--primary);
  border-top-left-radius: 16pt;
  border-top-right-radius: 16pt;
  border-top: solid 1px rgba(0,0,0,0.33);
  padding: 3em 0;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
}
</style>
