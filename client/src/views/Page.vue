<template>
  <div class="page">
    <template v-if="this.error">
      <div class="error">
        <h1>404<br />Not Found</h1>
        <p>The namespace you were looking for could not be found.</p>
        <router-link to="/">
          <i class="material-icons-sharp">arrow_back</i>
          <span>Go back</span>
        </router-link>
      </div>
    </template>
    <template v-else>
      <div class="backface">
        <div
          v-if="!placeholder"
          class="backface__cover"
          :style="{
            'background-image': `linear-gradient(to bottom, rgba(${color},0.8), rgba(${color},0.1))`,
            'background-color': `rgba(42,42,42,1)`,
          }"
        ></div>
      </div>
      <div class="frontface">
        <Breadcrump
          :theme="{
            color,
            textColor,
            accent,
          }"
        ></Breadcrump>
        <section
          class="top mx-auto py-4"
          :style="{
            '--color': color,
            '--textColor': textColor,
            '--accent': accent,
          }"
        >
          <div class="cover-container">
            <div class="placeholder" v-if="placeholder"></div>
            <img
              class="cover"
              :class="[placeholder ? 'hidden' : 'flex']"
              :src="`${apiUrl}/namespaces/${namespace}/cover`"
              @error="placeholder = true"
            />
          </div>
          <div class="release-container" v-if="metadata">
            <h1 class="title">{{ metadata.title }}</h1>
            <div
              v-if="metadata.description"
              class="description"
              v-html="description"
            ></div>
            <div class="links" v-if="metadata.links">
              <a
                v-for="l in metadata.links"
                :key="l.link"
                :href="l.link"
                rel="noreferrer"
                >{{ l.label }}</a
              >
            </div>
          </div>
        </section>
        <section class="queue-container">
          <div class="queue container" v-if="queue.length !== 0">
            <AudioManager
              class="players"
              :queue="queue"
              :namespace="namespace"
              :theme="{
                accent,
                color,
                textColor,
              }"
            ></AudioManager>
          </div>
          <div class="queue" v-else>
            <p class="queue--empty">It's currently really empty here...</p>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import AudioManager from "../components/AudioManager.vue";
import Breadcrump from "../components/Breadcrump.vue";
import { defineComponent, ref, reactive, computed, inject } from "vue";
import { useRoute } from "vue-router";
import {
  MetadataAPIResource,
  Metadata,
  fromAPIResource as toMetadata,
} from "@/models/Metadata";
import {
  TrackAPIResource,
  Track,
  fromAPIResource as toTrack,
} from "@/models/Track";
import {
  ThemeAPIResource,
  Theme,
  ComputedTheme,
  fromAPIResource as toTheme,
} from "@/models/Theme";

const toCSSColorString = (theme?: number[], computed?: number[], defaultValue?: string): string => {
  if (theme) {
    return `${theme[0]}, ${theme[1]}, ${theme[2]}`;
  } else {
    if(computed) {
      return `${computed[0]}, ${computed[1]}, ${computed[2]}`;
    } else {
      if (defaultValue) {
        return defaultValue;
      } else {
        return "";
      }
    }
  }
};

export default defineComponent({
  components: {
    AudioManager,
    Breadcrump,
  },
  setup() {
    const route = useRoute();

    const metadata = reactive<Metadata>({
      title: "",
      description: "",
      links: [],
    });
    const theme = reactive<Theme>({ textColor: [], accent: [], color: [] });
    const computedTheme = reactive<ComputedTheme>({
      textColor: [],
      accent: [],
      color: [],
    });

    const accent = computed((): string => {
      return toCSSColorString(theme.accent, computedTheme.accent, "255, 180, 0");
    });
    const textColor = computed((): string => {
      return toCSSColorString(theme.textColor, computedTheme.textColor, "0, 0, 0");
    });
    const color = computed((): string => {
      return toCSSColorString(theme.color, computedTheme.color, "255, 255, 255");
    });

    return {
      metadata,
      theme,
      computedTheme,
      placeholder: ref(false),
      queue: ref<Track[]>([]),
      error: ref({}),
      namespace: computed((): string => route.params.id as string),
      description: computed((): string => metadata.description || ""),
      accent,
      textColor,
      color,
      apiUrl: inject("apiUrl"),
    };
  },
  mounted() {
    Promise.all([
      axios
        .get(`${this.apiUrl}/namespaces/${this.namespace}/tracks`)
        .then(
          ({
            data,
          }: {
            data: { links: Record<string, string>; tracks: TrackAPIResource[] };
          }) => {
            this.queue = data.tracks
              .sort((a, b) => a.data.general.no - b.data.general.no)
              .map((t) => toTrack(t));
          }
        ),
      axios
        .get(`${this.apiUrl}/namespaces/${this.namespace}/metadata`)
        .then(({ data }: { data: MetadataAPIResource }) => {
          this.metadata = toMetadata(data);
        }),
      axios
        .get(`${this.apiUrl}/namespaces/${this.namespace}/theme`)
        .then(({ data }: { data: ThemeAPIResource }) => {
          this.theme = toTheme(data, "theme");
          this.computedTheme = toTheme(data, "computed");
        }),
    ]).catch((err) => {
      this.error = err;
    });
  },
});
</script>

<style lang="sass" scoped>
.page
  @apply relative min-h-screen h-full
  .frontface
    @apply relative
  .backface
    @apply absolute top-0 left-0 right-0 bottom-0 h-full w-full
  .backface
    overflow: hidden
    @apply z-0
    &__cover
      @apply absolute h-full w-full bg-center bg-cover
  .frontface
    @apply z-10
    section
      color: rgba(var(--textColor), 1)

.release-container,
.cover-container
  @apply mx-auto

.players
  @apply w-full mx-auto my-0 max-w-screen-lg

.cover-container
  @apply pt-0
  .cover
    width: 20rem
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2)
    @apply my-8 h-80 rounded-2xl mx-auto

  .placeholder
    width: 20rem
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2)
    @apply h-80 rounded-2xl my-8 bg-gray-900 mx-auto
    @apply flex items-center justify-center
    &::before
      content: '🎵'
      @apply block

.release-container
  .title
    @apply text-6xl font-bold leading-none mb-4 text-center uppercase

  .description
    @apply text-xl font-light max-w-screen-sm mx-auto

  .links
    @apply max-w-screen-sm mx-auto flex py-2 items-center
    a
      @apply px-2 py-2 text-white no-underline
      &:hover,
      &:active
        background: rgba(var(--accent), 1)

.container
  @apply text-gray-900 mx-auto

.error
  font-size: 24pt
  width: 50%
  margin: 8em auto 0
  h1
    font-weight: 900
    font-size: 3em
    margin-bottom: 16pt

  p
    opacity: 0.3
    font-size: 0.8em
    margin: 0
    &.err
      font-size: 0.6em

  a
    margin-top: 1em
    color: inherit
    text-decoration: none
    display: flex
    align-items: center
    outline: none
    i
      vertical-align: middle
      padding-right: 1ex
      font-size: 1em

.queue
  &--empty
    @apply text-xl opacity-30 mb-16 text-center

.wrapper
  @apply bg-gray-100 w-full flex flex-col text-white min-h-screen relative
  .spacer
    @apply flex-grow
</style>
