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

      <div v-for="(track, index) in queue" :key="track.general.title">
        <AudioPlayer
          :track="track"
          :index="index + 1"
          :theme="theme"
          :highlighted="`${selected}` === `${index + 1}`"
          v-on:select="select"
        ></AudioPlayer>
      </div>
      <div class="footer">
        <Footer></Footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from "vue";
import { useStore } from "@/store";

import AudioPlayer from "./AudioPlayer.vue";
import Footer from "./Footer.vue";
import { ThemeProp } from "@/models/Theme";
import { ActionsTypes } from "@/store/actions";
import { Track } from "@/models/Track";

export default defineComponent({
  components: {
    AudioPlayer,
    Footer,
  },
  props: {
    queue: {
      type: Object as PropType<Track[]>,
      default: (): Track[] => [],
    },
    theme: {
      type: Object as PropType<ThemeProp>,
      default: (): ThemeProp => ({
        accent: "",
        color: "",
        textColor: "",
      }),
    },
    namespace: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const selected = ref(-1);

    const isPlaying = computed<boolean>(() => store.state.nowPlaying?.includes(props.namespace) || false);

    const nowPlaying = computed<string | undefined>(() => store.state.nowPlaying);

    return {
      selected,
      isPlaying,
      nowPlaying,
      store,
    }
  },
  methods: {
    select(no: number): void {
      this.selected = no;
    },
    playAll(): void {
      this.store.dispatch(ActionsTypes.setQueue, {
        queue: this.makeQueue(),
      });
      this.store.dispatch(ActionsTypes.start);
    },
    makeQueue(): string[] {
      // intentional off-by-one, to stay convergent with URL links to track
      return this.queue.map((track, i) => `${this.namespace}#${i + 1}`);
    },
  },
  mounted() {
    this.select(+window.location.hash.replace("#", ""));
  },
});
</script>

<style lang="sass" scoped>
.manager
  color: rgba(var(--textColor), 1)
  .play-all
    background: rgba(var(--accent), 1)

.footer
  @apply py-12

</style>
