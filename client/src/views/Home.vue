<template>
  <div class="wrapper" :style="{ '--accent': accent, '--primary': primary }">
    <Header></Header>
    <div class="error" v-if="!namespaces.length">
      <h1>There's nothing here...</h1>
      <p>
        Either there are currently no demos or we are experiencing issues with
        our microservices.
      </p>
      <p class="err" v-if="error">{{ error }}</p>
    </div>
    <div class="success" v-else>
      <ul>
        <li v-for="(n, i) in namespaces" :key="n.name">
          <router-link class="title" :to="'/' + n.name">
            <div class="placeholder" :style="{display: placeholder[i] ? 'block' : 'none'}"></div>
            <img
              :style="{display: placeholder[i] ? 'none' : 'block'}"
              class="cover__preview"
              :src="`${apiEP}/namespace/${n.name}/cover`"
              @error="setPlaceholder(i)"
            />
            <span>{{ n.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <Footer v-if="$route.path === '/'"></Footer>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";

export default {
  data: () => ({
    error: null,
    namespaces: [],
    accent: "#F58B44",
    primary: "#1a1a1a",
    placeholder: [],
  }),
  computed: {
    apiEP() {
      if (this.$root) {
        return this.$root.apiEP;
      }
      return "";
    },
  },
  components: {
    Footer,
    Header,
  },
  methods: {
    setPlaceholder(i) {
      Vue.set(this.placeholder, i, true);
    },
  },
  mounted() {
    const vm = this;
    axios
      .get(`${vm.$root.apiEP}/namespace`)
      .then(({ data }) => {
        return data.namespaces.map((v) => v.name);
      })
      .then((namespaces) =>
        Promise.all(
          namespaces.map((n) => {
            return axios.get(`${vm.$root.apiEP}/namespace/${n}`);
          })
        )
      )
      .then((resp) => {
        return resp.map(({ data }) => {
          return {
            name: data.name,
            title: data.metadata ? data.metadata.title : "",
          };
        });
      })
      .then((n) => {
        vm.namespaces = n;
        vm.placeholder = Array(n.length).fill(false);
      })
      .catch((err) => {
        vm.error = err;
      });
  },
};
</script>

<style lang="scss" scoped>
@keyframes pulse {
  0% {
    opacity: .5;
  }
  50% {
    opacity: .2;
  }
  100% {
    opacity: .5;
  }
}
.success {
  // padding-top: 8em;
  width: 66%;
  margin: 0 auto;
  ul {
    padding-left: 2em;
    li {
      padding: 1em 0;
      list-style: none outside none;
      font-size: 1.5em;
      .title {
        display: flex;
        align-items: center;
        font-weight: 700;
        text-decoration: none;
        color: #1a1a1a;
        // padding: 8px;
        border-radius: 0.5em;
        vertical-align: baseline;
        .cover__preview {
          width: 96px;
          border-radius: 0.5em;
        }
        .placeholder {
          width: 96px;
          height: 96px;
          background: #0e0e0e;
          border-radius: 16px;
          animation: pulse 2s ease infinite;
        }
        span {
          margin: 0 16px;
        }
        &:hover,
        &:active {
          color: var(--accent);
          background: #1a1a1a;
        }
      }
    }
  }
}

.error {
  font-size: 24pt;
  width: 66%;
  margin: 0 auto;
  h1 {
    font-weight: 900;
    font-size: 2em;
    margin-bottom: 1rem;
  }
  p {
    opacity: 0.3;
    font-size: 0.8em;
    margin: 0;
    &.err {
      font-size: 0.6em;
    }
  }
  a {
    margin-top: 1em;
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    outline: none;
    i {
      vertical-align: middle;
      padding-right: 1ex;
      font-size: 1em;
    }
  }
}

.wrapper {
  min-height: 100vh;
  background-color: var(--accent);
}
</style>
