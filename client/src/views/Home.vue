<template>
  <div class="wrapper">
    <img
      class="logo h-48 max-w-md mx-auto my-4"
      src="~@/assets/demo-man-primary.svg"
    />
    <div class="w-2/3 mx-auto" v-if="!namespaces.length">
      <h1 class="text-gray-700 text-5xl font-semibold mb-4">
        There's nothing here...
      </h1>
      <p class="text-gray-600 text-opacity-50" v-if="error">
        <span>We are currently experiencing service availability issues </span
        ><br />
        <span class="text-sm"
          >&mdash; which is just a fancy saying for &quot;someone screwed up and
          is probably on it already&quot;.</span
        ><br />
        <span>{{ error }}</span>
      </p>
      <p class="text-gray-700 text-opacity-75 mb-4" v-else>
        There are currently no demos, sadly...
      </p>
    </div>
    <div class="success" v-else>
      <ul>
        <li v-for="(n, i) in namespaces" :key="n.name">
          <router-link class="title" :to="'/' + n.name">
            <div
              class="placeholder"
              :style="{ display: placeholder[i] ? 'flex' : 'none' }"
            ></div>
            <img
              :style="{ display: placeholder[i] ? 'none' : 'block' }"
              class="cover__preview"
              :src="`${apiUrl}/namespaces/${n.name}/cover`"
              @error="placeholder[i] = true"
            />
            <span class="text-gray-900">{{ n.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <Footer v-if="$route.path === '/'"></Footer>
  </div>
</template>

<script lang="ts">
import axios, { AxiosResponse } from "axios";
import { defineComponent, inject, reactive, ref } from "vue";
import type { Namespace, NamespaceAPIResource } from "../models/Namespace";
import Footer from "../components/Footer.vue";

export default defineComponent({
  name: "Home",
  components: {
    Footer,
  },
  setup() {
    return {
      namespaces: reactive<Namespace[]>([]),
      apiUrl: inject<string>("apiUrl"),
      error: ref({}),
      placeholder: reactive<boolean[]>([]),
    };
  },
  mounted() {
    axios
      .get(`${this.apiUrl}/namespaces`)
      .then(
        ({
          data,
        }: {
          data: {
            namespaces: NamespaceAPIResource[];
            links: Record<string, string>;
          };
        }) => {
          return data.namespaces.map(
            (v: NamespaceAPIResource): string => v?.metadata?.name
          );
        }
      )
      .then((namespaces: string[]) =>
        Promise.all(
          namespaces.map((n: string) => {
            return axios.get(
              `${this.apiUrl}/namespaces/${n}`
            ) as Promise<AxiosResponse>;
          })
        )
      )
      .then((resp) => {
        return resp.map(({ data }: { data: Namespace }) => {
          return data; // unpack response
        });
      })
      .then((n) => {
        this.namespaces = n;
        this.placeholder = Array(n.length).fill(false);
      })
      .catch((err) => {
        this.error = err;
      });
  },
});
</script>

<style lang="sass" scoped>
@keyframes pulse
  0%
    opacity: .3

  50%
    opacity: .2

  100%
    opacity: .3

.success
  @apply mx-auto w-2/3
  ul
    @apply pl-8
    li
      @apply text-2xl my-4
      .title
        @apply flex items-center align-baseline no-underline font-medium
        @apply transition-transform duration-100 ease-in-out
        .cover__preview
          @apply w-32 rounded-xl
        .placeholder
          animation: pulse 4s ease infinite
          @apply w-32 h-32 rounded-xl flex items-center justify-center bg-gray-900
          &::before
            content: '🎵'
            @apply block

        span
          @apply ml-6

        &:hover,
        &:active
          transform: translateY(-0.1rem)
</style>
