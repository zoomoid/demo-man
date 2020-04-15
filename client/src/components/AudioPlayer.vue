<template>
  <div class="player-wrapper" :class="[this.loaded ? 'loaded' : '']">
    <div class="title-wrapper">
      <div class="title" v-html="name">

      </div>
      <div class="download">
        <a :href="file" target="_blank">
          <i class="material-icons-sharp">
            get_app
          </i>
        </a>
      </div>
      <div class="tags" v-if="tags.length > 0">
        <span class="tag" v-for="tag in tags" v-bind:key="tag">
          {{tag}}
        </span>
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
        <i @click="pause" v-if="playing && !paused && !finished" class="material-icons-sharp">
          pause
        </i>
        <i @click="play" v-else-if="!playing && paused && !finished"
           class="material-icons-sharp paused">
          play_arrow
        </i>
        <i @click="replay" v-else-if="!playing && !paused && finished" class="material-icons-sharp">
          replay
        </i>
        <i @click="stop" v-else class="material-icons-sharp">
          stop
        </i>
      </div>
      <div class="playback-time-wrapper">
        <div class="playback-time-bar">
          <!-- <div
          v-bind:style="{ width: progress + '%', background: accentColor }"
            class="playback-time-indicator"></div> -->
          <div class="playback-time-scrobble-bar" @click="setPosition"></div>
          <div class="bg"></div>
          <div class="fg" v-bind:style="{ width: `${100 - progress}%` }"></div>
        </div>
      </div>
      <div class="playback-time-marks">
        <span class="playback-time-current">{{currentTime}}</span>
        <span class="playback-time-separator"></span>
        <span class="playback-time-total">{{duration}}</span>
      </div>
      <!-- <div class="volume-control">
        <i v-if="!this.isMuted" @click="mute" class="material-icons-sharp">
          volume_up
        </i>
        <i v-if="this.isMuted" @click="mute" class="material-icons-sharp muted">
          volume_off
        </i>
      </div> -->

    </div>
    <audio
      :src="file"
      ref="audiofile"
      preload="auto">
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
    autoPlay: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    id: {
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
    accentColor: {
      type: String,
      default: '#FFD600',
    },
  },
  watch: {
    playStateOverrideBy() {
      if (this.playStateOverrideBy !== this.id || this.playStateOverrideBy === -1) {
        this.pause();
        this.$emit('paused');
      }
    },
  },
  methods: {
    setPosition: function name(e) {
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
    },
    stop() {
      this.$emit('paused');
      this.playing = false;
      this.paused = true;
      this.finished = true;
      this.audio.pause();
      this.audio.currentTime = 0;
    },
    play() {
      this.$emit('playing', this.id);
      this.finished = false;
      this.playing = true;
      this.paused = false;
      this.audio.play();
    },
    pause() {
      this.$emit('paused');
      this.playing = false;
      this.paused = true;
      this.finished = false;
      this.audio.pause();
    },
    skipToBeginning() {
      this.audio.currentTime = 0;
    },
    skipToEnd() {
      this.audio.currentTime = this.audio.duration;
    },
    replay() {
      if (!this.playing && !this.paused && this.finished) {
        this.audio.currentTime = 0;
        this.finished = false;
        this.play();
      }
    },
    mute() {
      this.isMuted = !this.isMuted;
      this.audio.muted = this.isMuted;
      this.volumeValue = this.isMuted ? 0 : 75;
    },
    handleLoaded() {
      if (this.audio.readyState >= 2) {
        if (this.autoPlay) this.play();
        this.loaded = true;
        this.totalDuration = parseInt(this.audio.duration, 10);
      } else {
        throw new Error('Failed to load sound file');
      }
    },
    handlePlayingUI() {
      const currTime = parseInt(this.audio.currentTime, 10);
      this.progress = (currTime / this.totalDuration) * 100;
      this.currentTime = convertTimeHHMMSS(parseInt(this.audio.currentTime, 10));
    },
    handlePlayPause(e) {
      if (e.type === 'pause' && this.playing === false) {
        // this.progressStyle = 'width:0%;';
        // this.currentTime = '00:00';
        this.paused = true;
      }
    },
    handleFinished() {
      this.$emit('finished');
      this.playing = false;
      this.paused = false;
      this.finished = true;
    },
    init() {
      this.audio.addEventListener('timeupdate', this.handlePlayingUI);
      this.audio.addEventListener('loadeddata', this.handleLoaded);
      this.audio.addEventListener('pause', this.handlePlayPause);
      this.audio.addEventListener('play', this.handlePlayPause);
      this.audio.addEventListener('ended', this.handleFinished);
    },
    getAudio() {
      return this.$el.querySelectorAll('audio')[0];
    },
  },
  data() {
    return {
      playing: false,
      paused: true,
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

$base-color: rgba(255,255,255,0.2);
$color1: #121212;
$color2: #242424;
$loading-fade: linear-gradient(135deg,
  $color1 0%, $color1 10%, $color2 30%, $color1 50%,
  $color2 70%, $color1  90%, $color1 100%);

.player-wrapper {
  // Loading animation
  &:not(.loaded) {
    position: relative;
    height: 16pt;
    width: 50%;
    opacity: 0.9;
    & > .player, .title-wrapper {
      opacity: 0;
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
      animation: 4s linear 0s infinite none running loading;
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
  display: block;
  background: #ffffff;
  border-radius: 20pt;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  padding: 2em;
  margin-bottom: 1em;
  .title-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    padding-bottom: 8px;
    .title {
      i {
        font-style: normal;
        font-weight: 200;
      }
      font-weight: 500;
      // padding-bottom: 8px;
    }
    .download {
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
      a:link, a:visited {
        color: #1a1a1a;
      }
      &:hover, &:active, .muted {
        background: $base-color;
        border-radius: 32px;
      }
    }
    .tags {
      padding-left: 8px;
      display: block;
      .tag {
        display: block;
        background: white;
        color: black;
        border-radius: 4px;
        padding: 4px 8px;
        line-height: 1;
        font-weight: 700;
        font-size: 10pt;
        &::before {
          content: '#'
        }
      }
    }
  }
  .player {
    display: flex;
    align-items: center;
    .play-state {
      margin-right: 8px;
      width: 64px;
      height: 64px;
      cursor: pointer;
      display: inline-block;
      .material-icons-sharp {
        line-height: 64px;
        width: 64px;
        height: 64px;
        text-align: center;
        font-size: 32pt;
      }
      &:hover, &:active {
        &.paused {
          background: $base-color;
        }
        background: rgba(255,255,255,0.2);
        text-shadow: 0 2px 2px rgba(0,0,0,0.2);
        border-radius: 32px;
      }
    }
    .playback-time-wrapper {
      flex-grow: 1;
      .playback-time-bar {
        flex-grow: 1;
        position: relative;
        display: block;
        // background: $base-color;
        height: 96pt;
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
            z-index: 5;
            background-size: 100% 100%;
            background-image: url('../assets/shades-of-yellow-waveform.png');
          }
          &.fg {
            z-index: 6;
            right: 0;
            background-color: #ffffff;
            opacity: 0.66;
            transition: width linear 4s;
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
    .volume-control {
      margin-left: 8px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      .material-icons-sharp {
        line-height: 32px;
        width: 32px;
        height: 32px;
        text-align: center;
      }
      &:hover, &:active, .muted {
        background: $base-color;
        border-radius: 32px;
      }
    }

  }
}

</style>
