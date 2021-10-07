<template>
  <div
    :id="track.general.no"
    class="player-wrapper"
    ref="player"
    :class="{
      'is-highlighted': highlighted,
      'is-playing': playing,
    }"
  >
    <div class="title-wrapper">
      <div class="title-line">
        <div class="title">
          {{ track.general.title }}
        </div>
      </div>
      <div class="metadata">
        <div class="no" v-if="track.general.no">
          <span>
            {{ track.general.no }}
          </span>
        </div>
        <div class="comments" v-if="track.general.comment">
          <span
            class="comment"
            v-for="comment in track.general.comment"
            v-bind:key="comment"
          >
            {{ comment }}
          </span>
        </div>
        <div class="genre" v-if="track.general.genre">
          <span v-for="genre in track.general.genre" v-bind:key="genre">
            {{ genre }}
          </span>
        </div>
        <div class="bpm" v-if="track.general.bpm">
          <span>
            {{ track.general.bpm }}
          </span>
        </div>
        <div class="hfill"></div>
        <div class="actions">
          <div class="queue">
            <a v-on:click.stop.prevent="addToQueue" target="_blank">
              <i class="material-icons-outlined"> queue </i>
            </a>
          </div>
          <div class="share">
            <a v-on:click.stop.prevent="share" target="_blank">
              <i class="material-icons-outlined"> share </i>
            </a>
          </div>
          <div class="download">
            <a :href="`${file.mp3}?download`" target="_blank">
              <i class="material-icons-outlined"> get_app </i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="player">
      <div class="play-state">
        <i
          @click="pause"
          v-if="trackState.type === 'playing'"
          class="material-icons-outlined"
        >
          pause
        </i>
        <i
          @click="play"
          v-else-if="trackState.type === 'paused'"
          class="material-icons-outlined paused"
        >
          play_arrow
        </i>
        <i
          @click="replay"
          v-else-if="trackState.type === 'stopped' && trackState.finished"
          class="material-icons-outlined"
        >
          replay
        </i>
      </div>
      <div class="playback-time-wrapper">
        <div class="playback-time-bar">
          <div class="playback-time-scrobble-bar" @click="setPosition"></div>
          <div class="bg bg--full">
            <img :src="waveforms.full" />
          </div>
          <div
            class="fg fg--full"
            :style="{
              'clip-path': `polygon(0% 0%, 0% 100%, ${visualProgress}% 100%, ${visualProgress}% 0%`,
            }"
          >
            <img :src="track.waveforms.full" />
          </div>
          <div class="bg bg--small">
            <img :src="track.waveforms.small" />
          </div>
          <div
            class="fg fg--small"
            :style="{
              'clip-path': `polygon(0% 0%, 0% 100%, ${visualProgress}% 100%, ${visualProgress}% 0%`,
            }"
          >
            <img :src="track.waveforms.small" />
          </div>
        </div>
      </div>
      <div class="playback-time-marks">
        <span class="playback-time-current">{{ currentTime }}</span>
        <span class="playback-time-separator"></span>
        <span class="playback-time-total">{{ totalDuration }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "../store";
import {
  computed,
  defineComponent,
  inject,
  PropType,
  reactive,
  ref,
} from "vue";
import { Track, TrackAPIResource } from "../models/Track";
import { Theme, ThemeAPIResource, ThemeModel } from "../models/Theme";
import { QueueTrack, TrackState } from "../store/Track";
import { ActionsTypes } from "../store/actions";
import { MutationsTypes } from "../store/mutations";
import toHexString from "../helpers/toHexString";
import toTime from "../helpers/toTime";
import toCSSColorString from "../helpers/toCSSColorString";

export default defineComponent({
  name: "AudioPlayer",
  setup(props) {
    const store = useStore();

    const url = `${props.track.metadata.namespace}/#${props.index}`;

    // const track = reactive<Track>(new Track(props.track));
    // const theme = reactive<Theme>(new Theme(props.theme));

    // const playing = computed<boolean>(
    //   () => store.getters.trackState(url).type === "playing"
    // );
    // const progress = computed<number>(() => store.getters.progress(url));
    // const visualProgress = computed<number>(
    //   () =>
    //     (store.getters.progress(url) / props.track.data.general.duration) * 100
    // );
    // const totalDuration = computed<string>(() =>
    //   toTime(track.general?.duration || 0)
    // );
    // const currentTime = computed<string>(() =>
    //   toTime(store.getters.progress(url))
    // );
    // const waveforms = {
    //   full: `${props.track.links.waveform}/full?color=${toHexString(
    //     toCSSColorString(theme.get().accent)
    //   )}`,
    //   small: `${props.track.links.waveform}/small?color=${toHexString(
    //     toCSSColorString(theme.get().accent)
    //   )}`,
    // };
    return {
      store,
      track,
      url: ref<string>(url),
      // totalDuration,
      // currentTime,
      // visualProgress,
      // progress,
      // playing,
      // waveforms: reactive<Record<string, string>>(waveforms),
      // trackState: computed<TrackState>(() => store.getters.trackState(url)),
      // tracks: computed<QueueTrack[]>(() => store.state.tracks),
      // inAction: computed<boolean>(() => url === store.state.nowPlaying),
      apiUrl: inject<string>("apiUrl"),
    };
  },
  props: {
    track: {
      type: Object as PropType<TrackAPIResource>,
      required: true,
    },
    index: {
      type: Number,
      default: -1,
    },
    theme: {
      type: Object as PropType<ThemeAPIResource>,
      required: true,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.store.dispatch(ActionsTypes.addTrack, {
      url: this.url,
      mp3: this.track.file?.mp3,
      title: this.track.general?.title,
      artist: this.track.general?.artist,
      album: this.track.general?.album,
      duration: this.track.general?.duration,
    });
  },
  methods: {
    setPosition(e: MouseEvent): void {
      const t = e.target as Element;
      const pos = t?.getBoundingClientRect();
      const seekPos = (e.clientX - pos.left) / pos.width;
      const seekTarget = (this.track.general?.duration || 0) * seekPos;
      this.store.commit(MutationsTypes.seek, {
        seek: seekTarget,
        url: this.url,
      });
    },
    play(): void {
      // TODO: Implement me
      // if queue exists
      // present user with modal
      // else
      // dispatch("play", this);
    },
    replay(): void {
      this.store.dispatch(ActionsTypes.replay);
    },
    pause(): void {
      this.store.dispatch(ActionsTypes.pause);
    },
    addToQueue(): void {
      this.store.dispatch(ActionsTypes.append, { url: this.url });
    },
    share(): void {
      const prev = window.location.hash;
      window.location.hash = "";
      navigator.clipboard
        .writeText(
          `${this.apiUrl}/${this.track.metadata.namespace}/#${this.index}`
        )
        .then(
          () => {
            window.location.hash = `${this.index}`;
            this.$emit("select", this.index);
          },
          () => {
            window.location.hash = prev; // revert changes to hash
          }
        );
    },
  },
});
</script>

<style lang="sass">
@use "sass:color"

@keyframes slide-in
  0%
    transform: translateY(100%)

  100%
    transform: translateY(0%)

@keyframes slide-out
  0%
    transform: translateY(0%)

  100%
    transform: translateY(100%)

@keyframes loading
  0%
    background-position-x: 0%
  100%
    background-position-x: 200%

.slide-enter-active
  animation: slide-in ease 0.2s
  animation-fill-mode: forwards

.slide-leave-active
  animation: slide-out ease 0.2s
  animation-fill-mode: forwards

  $color1: #000000
  $color2: #161616
  $loading-fade: linear-gradient(135deg,$color1 0%,$color1 10%,$color2 30%,$color1 50%,$color2 70%,$color1 90%,$color1 100%)
  $share: desaturate(#00c853, 33%)

.player-wrapper
  @apply my-4 p-6
  // box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05)
  // margin-bottom: -16pt

  &.is-playing
    @apply bg-gray-200
    .player .playback-time-wrapper .playback-time-bar .fg
      @apply bg-gray-200
    a:hover,
    a:active,
    .play-state:active,
    .play-state:hover
      color: rgba(var(--color),1) !important

  &.is-highlighted
    // background: rgba(var(--color),1)
    backdrop-filter: blur(25px)
    border: solid 1px rgba(255, 255, 255, 0.18)
    @apply shadow-xl rounded-xl
    .player .playback-time-wrapper .playback-time-bar .fg
      // @apply bg-orange-300

    a:hover,
    a:active,
    .play-state:active,
    .play-state:hover
      color: var(--primary) !important

  .title-wrapper
    @apply pb-4
    .title-line
      @apply flex items-center flex-wrap
      .title
        @apply font-medium text-2xl

    .metadata
      @apply flex flex-wrap items-center
      & > div
        @apply block pr-4
        &:last-child
          @apply pr-4

      .no::before
        content: "Track \2116"
        @apply opacity-50

      .comments::before
        content: "Comment:"
        @apply hidden md:inline-block opacity-50

      .bpm::before
        content: "BPM:"
        @apply opacity-50

      .genre::before
        content: "Genre:"
        @apply opacity-50

      .hfill
        @apply flex-grow hidden md:block

      .actions
        @apply flex
        .download,
        .share
          @apply w-8 h-8 cursor-pointer
          .material-icons-sharp
            @apply w-8 h-8 text-center text-2xl leading-8
          &:hover,
          &:active
            color: rgba(var(--accent), 1)

  .player
    @apply flex flex-wrap items-center relative
    .play-state
      @apply md:inline-block md:cursor-pointer leading-none mr-2 py-4
      .material-icons-sharp
        @apply leading-none text-center
      &:hover,
      &:active
        color: rgba(var(--accent), 1)

    .playback-time-wrapper
      @apply flex-grow
      .playback-time-bar
        @apply flex-grow relative block h-28 md:h-32 rounded-md w-full cursor-pointer text-lg z-0

        .playback-time-scrobble-bar
          @apply absolute top-0 left-0 bottom-0 right-0 w-full h-full z-50

        div
          @apply absolute block w-full h-full
          &.bg
            @apply w-full opacity-30 z-10 bg-no-repeat bg-center h-full
            &.bg--full
              @apply hidden md:block
            &.bg--small
              @apply block md:hidden
          &.fg
            @apply z-20 right-0 opacity-100
            &.fg--full
              @apply hidden md:block
            &.fg--small
              @apply block md:hidden

    .playback-time-marks
      @apply flex flex-nowrap pl-2 mr-6 w-14 text-right md:static absolute right-0 md:right-auto bottom-0 md:bottom-auto
      span
        @apply font-medium inline-block align-middle leading-loose text-xs text-center
        &.playback-time-separator::after
          content: ":"
          @apply px-1
</style>
