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
        <Breadcrump :theme="{
          color,
          textColor,
          accent
        }"></Breadcrump>
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
              :src="`${$root.apiEP}/namespaces/${namespace}/cover`"
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

<script>
import axios from "axios";
import marked from "marked";
import AudioManager from "../components/AudioManager.vue";
import Breadcrump from "../components/Breadcrump.vue";

const color = a => {
  if (a) {
    return `${a[0]}, ${a[1]}, ${a[2]}`;
  } else {
    return "";
  }
};

export default {
  components: {
    AudioManager,
    Breadcrump
  },
  data() {
    return {
      error: null,
      queue: [],
      metadata: {
        title: null,
        description: null,
        links: []
      },
      theme: null,
      computedTheme: null,
      placeholder: false
    };
  },
  computed: {
    namespace() {
      return `${this.$route.params.id}`;
    },
    description() {
      return marked(this.metadata.description || "");
    },
    accent() {
      return (
        color(this.theme?.accent) ||
        color(this.computedTheme?.accent) ||
        "#242424"
      );
    },
    color() {
      return (
        color(this.theme?.color) ||
        color(this.computedTheme?.color) ||
        "#242424"
      );
    },
    textColor() {
      return (
        color(this.theme?.textColor) ||
        color(this.computedTheme?.textColor) ||
        "#242424"
      );
    }
  },
  mounted() {
    const vm = this;
    Promise.all([
      axios
        .get(`${this.$root.apiEP}/namespaces/${this.namespace}/tracks`)
        .then(({ data }) => {
          vm.queue = data.tracks.sort((a, b) => a.no - b.no);
        }),
      axios
        .get(`${this.$root.apiEP}/namespaces/${this.namespace}/metadata`)
        .then(({ data }) => {
          vm.metadata = data;
        }),
      axios
        .get(`${this.$root.apiEP}/namespaces/${this.namespace}/theme`)
        .then(({ data }) => {
          vm.theme = data.data.theme;
          vm.computedTheme = data.data.computedTheme;
        })
    ]).catch(err => {
      vm.error = err;
    });
  }
};
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
