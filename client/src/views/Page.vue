<template>
  <div
    class="wrapper"
    :style="`--accent: ${this.accent}; --primary: ${this.primary}`"
  >
    <template v-if="this.error">
      <div class="error">
        <h1>404<br />Not Found</h1>
        <p>The song you were looking for could not be found.</p>
        <!-- <p class="err">{{ this.error }}</p> -->
        <router-link to="/">
          <i class="material-icons-sharp">arrow_back</i>
          <span>Go back</span>
        </router-link>
      </div>
    </template>
    <template v-else>
      <Breadcrump></Breadcrump>
      <div class="spacer"></div>
      <div class="fill">
        <img
          :src="`${this.$root.apiEP}/namespace/${this.namespace}/cover`"
        />
      </div>
      <div class="release" v-if="metadata">
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
      <AudioManager
        class="players"
        :queue="queue"
        :namespace="namespace"
        :accent="this.accent"
        :primary="this.primary"
      ></AudioManager>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import marked from "marked";
import AudioManager from "../components/AudioManager.vue";
import Breadcrump from "../components/Breadcrump.vue";

export default {
  components: {
    AudioManager,
    Breadcrump,
  },
  data() {
    return {
      error: null,
      queue: [],
      metadata: null,
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
      if (this.metadata) {
        return this.metadata.colors.accent || "#242424";
      }
      return "#F58B44";
    },
    primary() {
      if (this.metadata) {
        return this.metadata.colors.primary || "#242424";
      }
      return "#242424";
    },
  },
  mounted() {
    const vm = this;
    Promise.all([
      axios
        .get(`${this.$root.apiEP}/namespace/${this.namespace}/tracks`)
        .then(({ data }) => {
          vm.queue = data.tracks.sort((a, b) => a.no - b.no);
        }),
      axios
        .get(`${this.$root.apiEP}/namespace/${this.namespace}/metadata`)
        .then(({ data }) => {
          vm.metadata = data;
        }),
    ]).catch((err) => {
      vm.error = err;
    });
  },
};
</script>

<style lang="scss" scoped>
.release,
.fill {
  padding: 2em 2em;
  width: 100%;
  // text-align: center;
  max-width: 1024px;
  margin: 0 auto;
}

.container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  .spacer {
    flex-grow: 1;
  }
}

.players {
  width: 100%;
  // text-align: center;
  // max-width: 1024px;
  margin: 0 auto;
}

.fill {
  padding-top: 0;
  img {
    display: block;
    margin: 2em auto;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    width: 100%;
    max-width: 450px;
  }
}

.release {
  .artist {
    letter-spacing: -0.02em;
    font-size: 2.5em;
    font-weight: 500;
    line-height: 1;
    margin: 0;
  }
  .title {
    letter-spacing: -0.04em;
    font-weight: 700;
    font-size: 3em;
    line-height: 1;
    margin: 0;
  }
  .description {
    font-size: 1.2em;
  }
  .links {
    a {
      padding: 4px 8px;
      color: #ffffff;
      text-decoration: none;
      &:hover,
      &:active {
        color: #ffffff;
        background: var(--accent);
      }
    }
  }
}

.error {
  font-size: 24pt;
  width: 50%;
  margin: 8em auto 0;
  h1 {
    font-weight: 900;
    font-size: 3em;
    margin-bottom: 16pt;
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
  background-color: var(--primary);
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  .spacer {
    flex-grow: 1;
  }
}
</style>
