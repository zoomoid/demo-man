<template>
  <div class="player-wrapper" :class="[this.loaded ? 'loaded' : '']">
    <div class="title-wrapper">
      <div class="title-line">
        <div class="title" v-html="name">

        </div>

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
    autoPlay: {
      type: Boolean,
      default: false,
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
    accentColor: {
      type: String,
      default: '#FFD600',
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
        this.$emit('paused');
      }
    },
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
      this.$emit('paused');
      this.playing = false;
      this.paused = true;
      this.finished = true;
      this.audio.pause();
      this.audio.currentTime = 0;
    },
    play() {
      this.$emit('playing', this.no);
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
      this.loaded = true;
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
$color1: #000000;
$color2: #161616;
$loading-fade: linear-gradient(135deg,
  $color1 0%, $color1 10%, $color2 30%, $color1 50%,
  $color2 70%, $color1  90%, $color1 100%);

.player-wrapper {
  // Loading animation
  &:not(.loaded) {
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
  &.loaded {
    display: block;
    background: #ffffff;
    border-top-left-radius: 16pt;
    border-top-right-radius: 16pt;
    box-shadow: 0 2px 16px rgba(0,0,0,0.2);
    padding: 2em 2em 4em;
    margin-bottom: -16pt;
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
        a, i {
          color: inherit;
        }
        color: #1a1a1a;
        &:hover, &:active {
          color: #F58B44;

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
      color: #1a1a1a;
      &:hover, &:active {
        color: #F58B44;
      }
    }
    .playback-time-wrapper {
      flex-grow: 1;
      .playback-time-bar {
        flex-grow: 1;
        position: relative;
        display: block;
        // background: $base-color;
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
            background-color: #ffffff;
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
