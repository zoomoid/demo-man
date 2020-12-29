<template>
  <div
    :style="{
      '--accent': theme.accent,
      '--color': theme.color,
      '--textColor': theme.textColor,
    }"
  >
    <div class="manager" v-if="!queue">
      <span>No tracks added yet...</span>
    </div>
    <div class="manager" v-else>
      <header class="settings">
        <div class="autoplay">
          <label
            for="autoplay"
            @click="autoplayControl"
            class="autoplay__label"
            :class="{
              'is-active': autoplay,
            }"
          >
            <span class="material-icons-sharp"> playlist_play </span>
            <span class="label"> Autoplay </span>
          </label>
        </div>
        <div class="loop">
          <label
            for="loop"
            @click="loopControl"
            class="loop__label"
            :class="{
              'is-active': loop,
            }"
          >
            <span class="material-icons-sharp"> repeat </span>
            <span class="label"> Loop </span>
          </label>
        </div>
        <div class="spacer"></div>
        <div
          class="play-all"
          :class="{
            'is-disabled': false,
          }"
          @click="playAll"
        >
          <span class="material-icons-sharp"> play_arrow </span>
          <span> Play all </span>
        </div>
      </header>
      <div v-for="(track, index) in queue" v-bind:key="track._id">
        <AudioPlayer
          :track="track"
          :index="index + 1"
          :theme="{
            color: theme.color,
            textColor: theme.textColor,
            accent: theme.accent,
          }"
          :highlighted="`${selected}` === `${index + 1}`"
          v-on:update:select="select"
          v-on:play="pushQueue"
        ></AudioPlayer>
      </div>
      <div class="footer">
        <Footer></Footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AudioPlayer from "./AudioPlayer.vue";
import Footer from "./Footer.vue";

function makeQueue(queue = [], namespace) {
  return queue.map((track, i) => ({
    url: `${namespace}#${i + 1}`, // intentional off-by-one, to stay convergent with URL links to track
  }));
}

export default {
  components: {
    AudioPlayer,
    Footer
  },
  props: {
    queue: {
      type: Array,
      default: () => []
    },
    theme: {
      type: Object,
      default: () => ({
        accent: null,
        color: null,
        textColor: null
      })
    },
    namespace: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      playIndex: -1,
      selected: -1,
      autoplay: true,
      loop: false
    };
  },
  computed: {
    isPlaying() {
      return `${this.nowPlaying}`.includes(this.namespace) === true;
    },
    ...mapGetters({
      nowPlaying: "nowPlaying",
      globalAutoplay: "autoplay",
      globalLoop: "loop",
    })
  },
  watch: {
    url(n) {
      this.playIndex = this.queue.findIndex(
        (t, i) => `${this.namespace}/#${i + 1}` === n
      );
    },
    autoplay(){
      this.$store.commit("updatePlaybackSettings", {
        autoplay: this.autoplay,
        loop: this.loop,
      })
    }
  },
  methods: {
    select(no) {
      this.selected = no;
    },
    loopControl() {
      this.loop = !this.loop;
    },
    autoplayControl() {
      this.autoplay = !this.autoplay;
    },
    pushQueue() {
      this.$store.dispatch("pushQueue", {
        queue: makeQueue(this.queue),
      });
    },
    playAll() {
      const { mp3, artist, title, duration } = this.queue[0];
      const url = `${this.namespace}/#1`;
      this.$store.dispatch("pushQueue", {
        queue: makeQueue(this.queue),
      });
      this.$store.dispatch("changeTrack", {
        mp3,
        url,
        artist,
        title,
        duration
      });
    }
  },
  mounted() {
    this.select(window.location.hash.replace("#", ""));
  },
};
</script>

<style lang="sass" scoped>
=settings-controls
  user-select: none
  cursor: pointer
  align-items: center
  color: rgba(var(--textColor), 0.33)
  @apply pt-4 px-4 text-center
  span:last-child
    opacity: 0
    text-align: center
    transform: translateY(6px)
    display: block
    transition: opacity 0.1s ease, transform 0.1s ease
  &:hover,
  &:active
    span:last-child
      opacity: 1
      width: auto
      transform: translateY(0)

.manager
  color: rgba(var(--textColor), 1)
  .settings
    @apply pt-4 flex items-center
    .autoplay,
    .loop
      label
        +settings-controls
        &.is-active
          color: rgba(var(--textColor), 1)
        span:first-child
          @apply mr-1 block text-center

    &.loop label
      @apply pl-3

    .spacer
      @apply flex-grow

    .play-all
      color: rgba(var(--accent), 1)
      transition: background-color 0.1s ease
      @apply text-center font-bold uppercase text-sm
      @apply outline-none border-none rounded-3xl
      +settings-controls
      &.is-disabled
        cursor: initial
        color: rgba(128, 128, 128, 0.5)

.footer
  @apply py-12
</style>
