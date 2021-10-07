<template>
  <div class="page">
    <template v-if="error">
      <div class="error">
        <h1>404<br />Not Found</h1>
        <p>The namespace you were looking for could not be found.</p>
        <router-link :to="{ name: 'home' }">
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
        <breadcrump
          :theme="{
            color,
            textColor,
            accent,
          }"
        ></breadcrump>
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
            <h1 v-if="metadata.title" class="title">{{ metadata.title }}</h1>
            <div
              v-if="metadata.description"
              class="description"
              v-html="description"
            ></div>
            <div v-if="metadata.links" class="links">
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
          <div class="queue" v-if="queue.length !== 0">
            <audio-manager
              class="players"
              :queue="queue"
              :namespace="namespace"
              :theme="{
                accent,
                color,
                textColor,
              }"
            ></audio-manager>
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
import { defineComponent, ref, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { MetadataAPIResource, Metadata } from "../models/Metadata";
import { TrackAPIResource, Track } from "../models/Track";
import { ThemeAPIResource, Theme } from "../models/Theme";
import toCSSColorString from "../helpers/toCSSColorString";

export default defineComponent({
  components: {
    AudioManager,
    Breadcrump,
  },
  setup() {
    const route = useRoute();

    const apiUrl = inject<string>("apiUrl");
    const namespace = ref<string>(route.params.id as string);

    const metadata = ref<Metadata | null>(null);
    const theme = ref<Theme | null>(null);

    const description = computed(
      (): string => metadata.value?.get().description || ""
    );

    const queue = ref<TrackAPIResource[]>([]);
    const error = ref(undefined);

    const accent = computed((): string =>
      toCSSColorString(theme.value?.get().accent)
    );
    const textColor = computed((): string =>
      toCSSColorString(theme.value?.get().textColor)
    );
    const color = computed((): string =>
      toCSSColorString(theme.value?.get().color)
    );

    Promise.all([
      axios.get(`${apiUrl}/namespaces/${namespace.value}/tracks`).then(
        ({
          data,
        }: {
          data: {
            links: Record<string, string>;
            tracks: Array<TrackAPIResource>,
          };
        }) => {
          queue.value = data.tracks
            .sort((a, b) => a.data.general.no - b.data.general.no)
        }
      ),
      axios
        .get(`${apiUrl}/namespaces/${namespace.value}/metadata`)
        .then(({ data }: { data: MetadataAPIResource }) => {
          metadata.value = new Metadata(data);
        }),
      axios
        .get(`${apiUrl}/namespaces/${namespace.value}/theme`)
        .then(({ data }: { data: ThemeAPIResource }) => {
          theme.value = new Theme(data);
        }),
    ]).catch((err) => {
      error.value = err;
    });

    return {
      metadata,
      theme,
      placeholder: ref(false),
      queue,
      error,
      namespace,
      description,
      accent,
      textColor,
      color,
      apiUrl,
    };
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
