<template>
  <div class="player-wrapper">
    <div class="title-wrapper">
      <div class="title" v-html="name">

      </div>
      <div class="tags" v-if="tags.length > 0">
        <span class="tag" v-for="tag in tags" v-bind:key="tag">
          {{tag}}
        </span>
      </div>
    </div>
    <div class="player">
      <div class="skip">
        <i @click="skipToBeginning" class="material-icons-sharp">
          skip_previous
        </i>
        <i @click="skipToEnd" class="material-icons-sharp">
          skip_next
        </i>
      </div>
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
        <div @click="setPosition" class="playback-time-bar">
          <div v-bind:style="progressStyle" class="playback-time-indicator"></div>
        </div>
      </div>
      <div class="playback-time-marks">
        <span class="playback-time-current">{{currentTime}}</span>
        <span class="playback-time-separator"></span>
        <span class="playback-time-total">{{duration}}</span>
      </div>
      <div class="volume-control">
        <i v-if="!this.isMuted" @click="mute" class="material-icons-sharp">
          volume_up
        </i>
        <i v-if="this.isMuted" @click="mute" class="material-icons-sharp muted">
          volume_off
        </i>
      </div>
      <div class="download">
        <a :href="file" target="_blank">
          <i class="material-icons-sharp">
            get_app
          </i>
        </a>
      </div>
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
      const percentage = (currTime / this.totalDuration) * 100;
      this.progressStyle = `width:${percentage}%;`;
      this.currentTime = convertTimeHHMMSS(currTime);
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

<style lang="scss">
.player-wrapper {
  padding: 1em 0;
  .title-wrapper{
    display: flex;
    // align-items: center;
    .title {
      i {
        font-style: normal;
        font-weight: 200;
      }
      font-weight: 500;
      margin-bottom: 8px;
    }
    .tags {
      padding-left: 8px;
      .tag {
        background: #ff9e22;
        color: #242424;
        border-radius: 4px;
        padding: 4px 8px;
        line-height: 1;
        text-align: middle;
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
    .skip {
      .material-icons-sharp {
        vertical-align: middle;
        line-height: 32px;
        width: 32px;
        height: 32px;
        font-size: 18px;
        text-align: center;
        cursor: pointer;
        &:hover, &:active, .paused {
          background: #424242;
          border-radius: 32px;
        }
      }
    }
    .play-state {
      margin-right: 8px;
      cursor: pointer;
      display: inline-block;
      .material-icons-sharp {
        vertical-align: middle;
        line-height: 32px;
        width: 32px;
        height: 32px;
        text-align: center;
      }
      &:hover, &:active, .paused {
        background: #424242;
        border-radius: 32px;
      }
    }
    .playback-time-wrapper {
      flex-grow: 1;
      .playback-time-bar {
        background: transparent;
        position: relative;
        display: block;
        background: #424242;
        height: 8px;
        border-radius: 4px;
        width: 100%;
        cursor: pointer;
        font-size: 14px;
        .playback-time-indicator {
          background: #ff9e22;
          border-radius: 4px;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          transition: width .5s ease;
        }
      }
    }
    .playback-time-marks {
      padding-left: 8px;
      span {
        font-weight: 400;
        display: inline-block;
        font-size: 80%;
        text-align: center;
        &.playback-time-separator::after {
          padding-left: 0.5ex;
          padding-right: 0.5ex;
          content: ' : ';
        }
      }
    }
    .volume-control {
      margin-left: 8px;
      .material-icons-sharp {
        vertical-align: middle;
        line-height: 32px;
        width: 32px;
        height: 32px;
        text-align: center;
      }
      &:hover, &:active, .muted {
        background: #424242;
        border-radius: 32px;
      }
    }
    .download {
      .material-icons-sharp {
        vertical-align: middle;
        line-height: 32px;
        width: 32px;
        height: 32px;
        text-align: center;
      }
      a:link, a:visited {
        color: #ffffff;
      }
      &:hover, &:active, .muted {
        background: #424242;
        border-radius: 32px;
      }
    }
  }
}

</style>
