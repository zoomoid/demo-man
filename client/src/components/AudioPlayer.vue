<template>
  <div :id="track.no"
    class="player-wrapper"
    ref="player"
    :class="this.css">
    <div class="title-wrapper">
      <div class="title-line">
        <div class="title">
          {{track.title}}
        </div>
      </div>
      <div class="metadata">
        <div class="no" v-if="track.no">
          <span>
            {{track.no}}
          </span>
        </div>
        <div class="comments" v-if="track.comment">
          <span class="comment" v-for="comment in track.comment" v-bind:key="comment">
            {{comment}}
          </span>
        </div>
        <div class="genre" v-if="track.genre">
          <span v-for="genre in track.genre" v-bind:key="genre">
            {{genre}}
          </span>
        </div>
        <div class="bpm" v-if="track.bpm">
          <span>
            {{track.bpm}}
          </span>
        </div>
        <div class="hfill"></div>
        <div class="actions">
          <div class="share">
            <a @click="share" target="_blank">
              <i class="material-icons-sharp">
                share
              </i>
            </a>
          </div>
          <div class="download">
            <a :href="`${track.mp3}?download`" target="_blank">
              <i class="material-icons-sharp">
                get_app
              </i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="player">
      <div class="play-state">
        <i @click="pause" v-if="this.localPlayState === 'playing'"
          class="material-icons-sharp">
          pause
        </i>
        <i @click="play" v-else-if="this.localPlayState === 'paused'"
          class="material-icons-sharp paused">
          play_arrow
        </i>
        <i @click="replay" v-else-if="this.localPlayState === 'finished'"
          class="material-icons-sharp">
          replay
        </i>
      </div>
      <div class="playback-time-wrapper">
        <div class="playback-time-bar">
          <div class="playback-time-scrobble-bar" @click="setPosition"></div>
          <div class="bg bg--full" v-bind:style="{
            backgroundImage: `url('${waveforms.full}')`}"></div>
          <div class="bg bg--small" v-bind:style="{
            backgroundImage: `url('${waveforms.small}')`}"></div>
          <div class="fg" v-bind:style="{ width: `${100 - this.visualProgress}%` }"></div>
        </div>
      </div>
      <div class="playback-time-marks">
        <span class="playback-time-current">{{this.currentTime}}</span>
        <span class="playback-time-separator"></span>
        <span class="playback-time-total">{{this.totalDuration}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import humanReadableTimestamp from '../main';

export default {
  name: 'AudioPlayer',
  data: () => ({
  }),
  computed: {
    localPlayState() {
      return this.playState[this.url] || 'paused';
    },
    totalDuration() {
      return humanReadableTimestamp(this.track.duration);
    },
    currentTime() {
      return humanReadableTimestamp(this.progress[this.url]);
    },
    waveforms() {
      return {
        full: `${this.track.waveform}?mode=full&color=efefef`,
        small: `${this.track.waveform}?mode=small&color=efefef`,
      };
    },
    localProgress() {
      return this.progress[this.url] || 0;
    },
    visualProgress() {
      return (this.progress[this.url] / this.track.duration) * 100;
    },
    url() {
      return `${this.track.namespace}/#${this.index}`;
    },
    inAction() {
      return this.url === this.playingTrackUrl;
    },
    css() {
      const classes = [];
      if (this.highlighted) {
        classes.push('is-highlighted');
      }
      if (this.inAction) {
        classes.push('is-playing');
      }
      return classes.reduce((p, c) => `${p} ${c}`, '');
    },
    ...mapGetters({
      progress: 'progress',
      duration: 'duration',
      playState: 'playState',
      playingTrackUrl: 'url',
      seek: 'seek',
    }),
  },
  props: {
    track: {
      type: Object,
      default: () => ({
        url: '',
        name: '',
        _id: '',
        no: -1,
        tags: [],
        namespace: '',
        waveformUrlUrl: {
          full: '',
          small: '',
        },
        duration: 0,
      }),
    },
    index: {
      type: Number,
      default: -1,
    },
    accent: {
      type: String,
      default: '#F58B44',
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    setPosition(e) {
      const pos = e.target.getBoundingClientRect();
      const seekPos = (e.clientX - pos.left) / pos.width;
      const seekTarget = this.track.duration * seekPos;
      this.$store.commit({
        type: 'seek',
        seek: seekTarget,
        url: this.url,
      });
    },
    play() {
      this.$store.dispatch({
        type: 'changeTrack',
        mp3: this.track.mp3,
        url: `${this.track.namespace}/#${this.index}`,
        title: this.track.title,
        artist: this.track.artist,
        progress: this.localProgress,
        duration: this.track.duration,
      });
    },
    replay() {
      this.$store.commit({
        type: 'updateProgress',
        url: this.url,
        progress: 0,
      });
      this.play();
    },
    pause() {
      if (this.localPlayState === 'playing') {
        this.$store.commit({
          type: 'updatePlayState',
          playState: 'paused',
          url: this.url,
        });
      }
    },
    share() {
      const prev = window.location.hash;
      window.location.hash = '';
      navigator.clipboard.writeText(`${this.$root.publicEP}/${this.track.namespace}/#${this.index}`).then(() => {
        window.location.hash = `${this.index}`;
        this.$emit('update:select', this.index);
      }, () => {
        window.location.hash = prev; // revert changes to hash
      });
    },
  },
  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      this.$store.commit({
        type: 'intersecting',
        intersecting: entries[0].isIntersecting,
      });
    }, {
      threshold: 0.5,
    });
    this.observer.observe(this.$refs.player);
  },
  beforeDestroy() {
    this.$store.commit({
      type: 'intersecting',
      intersecting: false,
    });
  },
};
</script>

<style lang="scss" scoped>
// @import '@/assets/app.sass';
@use "sass:color";

@keyframes loading {
  0% {
    background-position-x: 0%
  }
  100% {
    background-position-x: 200%
  }
}

$color1: #000000;
$color2: #161616;
$loading-fade: linear-gradient(135deg,
  $color1 0%, $color1 10%, $color2 30%, $color1 50%,
  $color2 70%, $color1  90%, $color1 100%);
$share: desaturate(#00c853, 33%);

.player-wrapper {
  display: block;
  background: var(--primary);
  border-top-left-radius: 16pt;
  border-top-right-radius: 16pt;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  padding: 2em 2em 4em;
  margin-bottom: -16pt;

  &.is-playing {
    background: var(--accent);
    div.fg {
      background: var(--accent) !important;
    }
    a:hover, a:active,
    .play-state:active, .play-state:hover {
      color: var(--primary) !important;
    }
  }
  &.is-highlighted {
    background: $share;
    div.fg {
      background: $share !important;
    }
    a:hover, a:active,
    .play-state:active, .play-state:hover {
      color: var(--primary) !important;
    }
  }
  .title-wrapper {
    padding-bottom: 16px;
    .title-line {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      .title {
        font-weight: 500;
        font-size: 150%;
      }
    }
    .metadata {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      & > div {
        display: block;
        padding-right: 1em;
        &:last-child {
          padding-right: 0;
        }
      }
      .no::before {
        opacity: 0.5;
        content: "Track \2116";
        // @media screen and (max-width: 768px) {
        //   content: "\2116";
        // }
      }
      .comments::before {
        opacity: 0.5;
        content: "Comment:";
        @media screen and (max-width: 768px) {
          content: "";
        }
      }
      .bpm::before {
        opacity: 0.5;
        content: "BPM:";
      }
      .genre::before {
        opacity: 0.5;
        content: "Genre:";
      }
      .hfill {
        flex-grow: 1;
      }
      @media screen and (max-width: 768px) {
        .hfill {
          display: none;
        }
      }
      .actions {
        display: flex;
        .download, .share {
          width: 32px;
          height: 32px;
          cursor: pointer;
          .material-icons-sharp {
            line-height: 32px;
            width: 32px;
            height: 32px;
            text-align: center;
            font-size: 150%;
          }
          a, i {
            color: inherit;
          }
          &:hover, &:active {
            color: var(--accent);
          }
        }
      }
    }
  }
  .player {
    display: flex;
    align-items: center;
    position: relative;
    .play-state {
      margin-right: 8px;
      width: 32px;
      height: 32px;
      font-size: 32px;
      @media screen and (min-width: 768px) {
        width: 48px;
        height: 48px;
        font-size: 48px;
      }
      cursor: pointer;
      display: inline-block;
      .material-icons-sharp {
        line-height: 1;
        // width: 48px;
        // height: 48px;
        text-align: center;
        font-size: 1em;
      }
      a, i {
        color: inherit;
      }
      &:hover, &:active {
        color: var(--accent);
      }
    }
    .playback-time-wrapper {
      flex-grow: 1;
      .playback-time-bar {
        flex-grow: 1;
        position: relative;
        display: block;
        min-height: 64px;
        height: 64px;
        @media screen and (min-width: 768px) {
          height: 128px;
        }
        border-radius: 4px;
        width: 100%;
        cursor: pointer;
        font-size: 14px;
        z-index: 0;
        .playback-time-scrobble-bar {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
          z-index: 7;
        }
        img, div {
          position: absolute;
          display: block;
          height: 100%;
          width: 100%;
          &.bg {
            width: 100%;
            opacity: 1;
            z-index: 2;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center center;
            height: 100%;
            &.bg--full {
              display: block;
            }
            &.bg--small {
              display: none;
            }
            @media screen and (max-width: 768px) {
              &.bg--full {
                display: none;
              }
              &.bg--small {
                display: block;
              }
            }
          }
          &.fg {
            z-index: 3;
            right: 0;
            background-color: var(--primary);
            opacity: 0.66;
            // transition: width linear 1s;
          }
        }
      }
    }
    .playback-time-marks {
      display: flex;
      flex-wrap: nowrap;
      padding-left: 8px;
      margin-right: 24px;
      width: 3.5em;
      text-align: right;
      @media screen and (max-width: 768px) {
        position: absolute;
        right: 0;
        bottom: 0;
        margin-bottom: -2em;
      }
      span {
        font-weight: 500;
        display: inline-block;
        vertical-align: middle;
        line-height: 2rem;
        font-size: 0.7rem;
        text-align: center;
        &.playback-time-separator::after {
          padding-left: 0.5ex;
          padding-right: 0.5ex;
          content: ':';
        }
      }
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
