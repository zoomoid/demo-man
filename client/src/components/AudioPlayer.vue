<template>
  <div :id="this.no" class="player-wrapper" :class="this.class">
    <div class="title-wrapper">
      <div class="title-line">
        <div class="title" v-html="name"></div>
      </div>
      <!-- <div class="tags" v-if="tags.length > 0">
        <span class="tag" v-for="tag in tags" v-bind:key="tag">
          {{tag}}
        </span>
      </div> -->
      <div class="metadata">
        <div class="no" v-if="no">
          <span>
            {{no}}
          </span>
        </div>
        <div class="comments" v-if="additionalData.comment">
          <span class="comment" v-for="comment in additionalData.comment" v-bind:key="comment">
            {{comment}}
          </span>
        </div>
        <div class="genre" v-if="additionalData.genre">
          <span v-for="genre in additionalData.genre" v-bind:key="genre">
            {{genre}}
          </span>
        </div>
        <div class="bpm" v-if="additionalData.bpm">
          <span>
            {{additionalData.bpm}}
          </span>
        </div>
        <div class="hfill"></div>
        <div class="share">
          <a @click="share" target="_blank">
            <i class="material-icons-sharp">
              share
            </i>
          </a>
        </div>
        <div class="download">
          <a :href="file" target="_blank">
            <i class="material-icons-sharp">
              get_app
            </i>
          </a>
        </div>
      </div>
    </div>
    <div class="player">
      <!-- <div class="skip">
        <i @click="skipToBeginning" class="material-icons-sharp">
          skip_previous
        </i>
        <i @click="skipToEnd" class="material-icons-sharp">
          skip_next
        </i>
      </div> -->
      <div class="play-state">
        <i @click="pause" v-if="playing && !finished" class="material-icons-sharp">
          pause
        </i>
        <i @click="play" v-else-if="!playing  && !finished"
           class="material-icons-sharp paused">
          play_arrow
        </i>
        <i @click="replay" v-else class="material-icons-sharp">
          replay
        </i>
      </div>
      <div class="playback-time-wrapper">
        <div class="playback-time-bar">
          <div class="playback-time-scrobble-bar" @click="setPosition"></div>
          <div class="bg bg--full" v-bind:style="{
            backgroundImage: `url('${waveformUrl.full}')`}"></div>
          <div class="bg bg--small" v-bind:style="{
            backgroundImage: `url('${waveformUrl.small}')`}"></div>
          <div class="fg" v-bind:style="{ width: `${100 - progress}%` }"></div>
        </div>
      </div>
      <div class="playback-time-marks">
        <span class="playback-time-current">{{currentTime}}</span>
        <span class="playback-time-separator"></span>
        <span class="playback-time-total">{{duration}}</span>
      </div>
    </div>
    <audio
      :src="file"
      ref="audiofile"
      preload="none">
    </audio>
  </div>
</template>

<script>
export const baseVolumeValue = 10;

export const convertTimeHHMMSS = (val) => {
  const hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
  return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss;
};

export default {
  name: 'AudioPlayer',
  props: {
    name: {
      type: String,
      default: null,
    },
    file: {
      type: String,
      default: null,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: -1,
    },
    no: {
      type: Number,
      default: -1,
    },
    playStateOverrideBy: {
      type: Number,
      default: -1,
    },
    tags: {
      type: Array,
      default: undefined,
    },
    additionalData: {
      type: Object,
      default: null,
    },
    namespace: {
      type: String,
      required: true,
    },
    accent: {
      type: String,
      default: '#FFD600',
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
    waveformUrl: {
      type: Object,
      default: () => ({
        full: '',
        small: '',
      }),
    },
  },
  watch: {
    playStateOverrideBy() {
      if (this.playStateOverrideBy !== this.no || this.playStateOverrideBy === -1) {
        this.pause();
        this.$emit('pause', this.playStateOverrideBy);
      }
    },
    // highlighted() {
    //   return this.$parent.selected === this.no;
    // },
  },
  methods: {
    setPosition: function name(e) {
      try {
        const tag = e.target;
        const pos = tag.getBoundingClientRect();
        const seekPos = (e.clientX - pos.left) / pos.width;
        const { seekable } = this.audio;
        let seekTarget = this.audio.duration * seekPos;
        if (seekable.start(0) > seekTarget) {
          seekTarget = seekable.start(0);
        } else if (seekable.end(0) < seekTarget) {
          seekTarget = seekable.end(0);
        }
        this.audio.currentTime = seekTarget;
      } catch (err) {
        this.play();
      }
    },
    stop() {
      this.playing = false;
      this.finished = true;
      this.audio.pause();
      this.audio.currentTime = 0;
      this.$emit('pause');
    },
    play() {
      this.finished = false;
      this.playing = true;
      this.audio.play();
      this.$emit('play', this.no);
    },
    pause() {
      this.playing = false;
      this.finished = false;
      this.audio.pause();
      this.$emit('pause');
    },
    replay() {
      if (!this.playing && !this.paused && this.finished) {
        this.audio.currentTime = 0;
        this.finished = false;
        this.play();
      }
    },
    handleLoaded() {
      if (this.audio.readyState >= 2) {
        this.totalDuration = parseInt(this.audio.duration, 10);
      } else {
        throw new Error('Failed to load sound file');
      }
    },
    handlePlayingUI() {
      const currTime = parseInt(this.audio.currentTime, 10);
      this.progress = (currTime / this.totalDuration) * 100;
      this.currentTime = convertTimeHHMMSS(parseInt(this.audio.currentTime, 10));

      this.$emit('progress', {
        progress: this.progress,
        currentTime: this.currentTime,
        totalDuration: this.duration,
      });
    },
    handlePlayPause(e) {
      if (e.type === 'pause' && this.playing === false) {
        this.paused = true;
      }
    },
    handleFinished() {
      this.$emit('finish');
      this.playing = false;
      this.finished = true;
    },
    init() {
      this.audio.addEventListener('timeupdate', this.handlePlayingUI);
      this.audio.addEventListener('loadeddata', this.handleLoaded);
      this.audio.addEventListener('pause', this.handlePlayPause);
      this.audio.addEventListener('play', this.handlePlayPause);
      this.audio.addEventListener('ended', this.handleFinished);
      this.loaded = true;
      // this.highlighted = window.location.hash.replace('#', '') === `${this.no}`;
    },
    getAudio() {
      return this.$el.querySelectorAll('audio')[0];
    },
    share() {
      window.location.hash = '';
      navigator.clipboard.writeText(`${this.$root.publicEP}/${this.namespace}/#${this.no}`).then(() => {
        window.location.hash = `${this.no}`;
        this.$emit('update:select', this.no);
        console.log('Copied to clipboard successfully!');
      }, () => {
        console.error('Unable to write to clipboard. :-(');
      });
    },
  },
  data() {
    return {
      playing: false,
      finished: false,
      isMuted: false,
      loaded: false,
      currentTime: '00:00',
      audio: undefined,
      totalDuration: 0,
      volumeValue: baseVolumeValue,
      progressStyle: '',
      progress: 0,
    };
  },
  computed: {
    duration() {
      return this.audio ? convertTimeHHMMSS(this.totalDuration) : '';
    },
    class() {
      return `${this.loaded ? 'is-loaded' : ''} ${this.highlighted ? 'is-highlighted' : ''}`;
    },
    // highlighted() {
    //   return this.$parent.selected === this.no;
    // },
  },
  mounted() {
    this.audio = this.getAudio();
    this.init();
  },
  beforeDestroy() {
    this.audio.removeEventListener('timeupdate', this.handlePlayingUI);
    this.audio.removeEventListener('loadeddata', this.handleLoaded);
    this.audio.removeEventListener('pause', this.handlePlayPause);
    this.audio.removeEventListener('play', this.handlePlayPause);
  },
};
</script>

<style lang="scss" scoped>
// @import '@/assets/app.sass';

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

.player-wrapper {
  &:not(.is-loaded) {
    position: relative;
    margin: 32pt 0 1em;
    height: 32pt;
    width: 100%;
    opacity: 0.5;
    & > .player, .title-wrapper {
      opacity: 0;
      display: none;
    }
    &::after {
      border-radius: 64px;
      z-index: 100;
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: $loading-fade repeat scroll 0% 0% / 200% 100%;
      animation: 1s ease-in-out 0s infinite none running loading;
    }
    &::before {
      border-radius: 64px;
      z-index: 99;
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: $color1;
    }
  }
  &.is-loaded {
    display: block;
    background: var(--primary);
    border-top-left-radius: 16pt;
    border-top-right-radius: 16pt;
    box-shadow: 0 2px 16px rgba(0,0,0,0.2);
    padding: 2em 2em 4em;
    margin-bottom: -16pt;
  }
  &.is-highlighted {
    background: var(--accent);
    div.fg {
      background: var(--accent) !important;
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
        content: "Track \2116"
      }
      .comments::before {
        opacity: 0.5;
        content: "Comment:"
      }
      .bpm::before {
        opacity: 0.5;
        content: "BPM:"
      }
      .genre::before {
        opacity: 0.5;
        content: "Genre:"
      }
      .hfill {
        flex-grow: 1;
      }
      @media screen and (max-width: 768px) {
        .hfill {
          display: none;
        }
      }
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

</style>
