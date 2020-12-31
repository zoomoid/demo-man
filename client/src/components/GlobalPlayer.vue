<template>
  <div>
    <audio ref="audio" autoplay="false"></audio>
    <transition name="slide">
      <div class="playerbar" v-if="this.track?.url">
        <div class="metadata">
          <span class="artist">{{ track?.artist }}</span>
          <router-link :to="`/${track?.url}`"
            ><span class="title">{{ track?.title }}</span></router-link
          >
        </div>
        <div class="action">
          <div class="play-state">
            <i
              @click="pause"
              v-if="trackState?.type === 'playing'"
              class="material-icons-sharp"
            >
              pause
            </i>
            <i
              @click="play"
              v-else-if="trackState?.type === 'paused'"
              class="material-icons-sharp paused"
            >
              play_arrow
            </i>
            <i
              @click="replay"
              v-else-if="trackState?.type === 'stopped' && trackState?.finished"
              class="material-icons-sharp"
            >
              replay
            </i>
          </div>
          <div class="volume-control">
            <i
              @click="volumeOverlay = !volumeOverlay"
              class="material-icons-sharp"
            >
              {{ this.volume > 0 ? "volume_up" : "volume_off" }}
            </i>
            <div class="overlay" v-if="volumeOverlay">
              <input
                type="range"
                class="volume__input"
                v-model="volume"
                min="0"
                max="100"
                steps="1"
                name="volume"
                @blur="volumeOverlay = !volumeOverlay"
              />
            </div>
          </div>
        </div>
        <div class="waveform-container">
          <div class="scrobble-bar" @click="setPosition"></div>
          <div
            class="overlay"
            :style="{ width: `${100 - visualProgress}%` }"
          ></div>
          <div
            draggable="true"
            class="playhead"
            :style="{ left: `${visualProgress}%` }"
          ></div>
          <div class="background"></div>
        </div>
        <div class="spacer"></div>
        <div class="timestamp">
          <span class="current">{{ currentTime }}</span>
          <span class="separator"> : </span>
          <span class="total">{{ totalDuration }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { ActionsTypes } from "@/store/actions";
import { MutationsTypes } from "@/store/mutations";
import { Track, TrackState } from "@/store/Track";
import { defineComponent, computed, ref, inject, reactive } from "vue";
import { toTime } from "../main";

export default defineComponent({
  setup() {
    const store = useStore();
    const volumeOverlay = ref(false);
    const volume = computed<number>(() => store.getters.volume);
    const totalDuration = computed<string>(() =>
      toTime(store.getters.currentTrack?.duration || 0)
    );
    const currentTime = computed<string>(() =>
      toTime(store.getters.currentTrack?.state.progress || 0)
    );

    const visualProgress = computed<number>(
      () =>
        ((store.getters.currentTrack?.state.progress || 0) /
          (store.getters.currentTrack?.duration || 1)) *
        100
    );
    const track = computed<Track | undefined>(() => store.getters.currentTrack);
    const trackState = computed<TrackState | undefined>(() => store.getters.currentTrack?.state);
    const audio = ref<HTMLAudioElement>();
    const seeked = computed<boolean>(() => store.state.seeked);

    return {
      store,
      volumeOverlay,
      volume,
      totalDuration,
      currentTime,
      visualProgress,
      track,
      trackState,
      audio,
      seeked,
    };
  },
  watch: {
    seeked(): void {
      const progress = this.handleAudioElement(this.track?.state.progress || 0);
      if (this.audio) {
        this.audio.currentTime = progress;
        this.store.commit(MutationsTypes.consumeSeeked);
      }
    },
    volume(v): void {
      if (this.audio) {
        this.audio.volume = v * 100;
      }
    },
    trackState(state: TrackState): void {
      if (this.audio) {
        switch (state.type) {
          case "playing":
            this.audio.play();
            break;
          case "paused":
            this.audio.pause();
            break;
          case "stopped":
          default:
            break;
        }
      }
    },
  },
  methods: {
    updateVolume(volume: number): void {
      this.store.commit(MutationsTypes.updateVolume, volume);
    },
    updateProgress(): void {
      if (this.trackState?.type === "playing" && this.audio) {
        const progress = this.audio.currentTime;
        this.store.commit(MutationsTypes.updateProgress, progress);
      }
    },
    handleAudioElement(progress: number): number {
      if (this.audio) {
        const { seekable } = this.audio;
        let seekTarget = progress;
        if (seekable.start(0) > progress) {
          seekTarget = seekable.start(0);
        } else if (seekable.end(0) < progress) {
          seekTarget = seekable.end(0);
        }
        return seekTarget;
      } else {
        return 0;
      }
    },
    handleFinished(): void {
      this.store.dispatch(ActionsTypes.next);
    },
    setPosition(e: MouseEvent): void {
      const t = e.target as Element;
      const pos = t.getBoundingClientRect();
      const seekPos = (e.clientX - pos.left) / pos.width;
      const seekTarget = (this.track?.duration || 0) * seekPos;
      this.store.commit(MutationsTypes.seek, { seek: seekTarget, url: this.track?.url });
    },
    play(): void {
      this.store.dispatch(ActionsTypes.resume);
    },
    pause(): void {
      this.store.dispatch(ActionsTypes.pause);
    },
    replay(): void {
      this.store.dispatch(ActionsTypes.replay);
    },
  },
  mounted() {
    this.audio?.addEventListener("timeupdate", this.updateProgress);
    this.audio?.addEventListener("ended", this.handleFinished);
  },
});
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
  animation: slide 0.2s;
}
.slide-leave-active {
  animation: slide 0.2s reverse;
}

.playerbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: #1a1a1a;
  // height: 4em;
  padding: 0.75em;
  font-size: 11pt;
  z-index: 5;
  flex-wrap: wrap;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.33);
  color: #ffffff;
  .action {
    display: flex;
    & > div {
      background: none;
      border: none;
      outline: none;
      // margin-right: 16px;
      line-height: 1;
      cursor: pointer;
      border-radius: 32px;
      width: 32px;
      height: 32px;
      padding: 4px;
      &:hover,
      &:active {
        background: rgba(0, 0, 0, 0.15);
        color: #f58b44;
      }
    }
    .volume-control {
      .overlay {
        position: absolute;
        background: #242424;
        z-index: 100;
        transform: rotate(270deg) translateY(0.5em);
        transform-origin: center left;
        padding: 16px;
        border-radius: 8px;
        margin-top: -90px;
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
        width: 200px;
        .volume__input {
          background: #242424;
          width: 100%;
          cursor: pointer;
        }
      }
      @media only screen and (max-width: 768px) {
        display: none;
      }
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
      &:hover,
      &:active {
        color: #f58b44;
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
    font-size: 0.7em;
  }
  .spacer {
    flex-grow: 1;
    display: none;
  }
  .waveform-container {
    position: relative;
    height: 5px;
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
      cursor: pointer;
    }
    .overlay {
      position: absolute;
      height: 100%;
      z-index: 3;
      right: 0;
      background-color: #1a1a1a;
      opacity: 0.8;
      cursor: pointer;
    }
    .playhead {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 16px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      background: #f58b44;
      z-index: 6;
      margin-top: -3.5px;
      margin-left: -3.5px;
      cursor: pointer;
    }
    .background {
      height: 100%;
      z-index: 2;
      opacity: 0.5;
      width: 100%;
      border-radius: 4px;
      background-size: 100% 100%;
      opacity: 1;
      background-color: #f58b44;
      cursor: pointer;
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
