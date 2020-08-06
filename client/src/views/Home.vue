<template>
  <div class="wrapper" :style="'--accent: ' + this.accentColor">
    <div class="error" v-if="!this.directories.length">
        <h1>There's nothing here...
        </h1>
        <p>
          Either there are currently no demos or we are experiencing
          issues with our microservices.
        </p>
        <p class="err" v-if="this.error">{{ this.error }}</p>
    </div>
    <div class="success" v-else>
      <img class="logo" src="~@/assets/demo-man.png"/>
      <ul>
        <li v-for="directory in directories" :key="directory">
          <router-link :to="'/' + directory">{{directory}}</router-link>
        </li>
      </ul>
    </div>
    <Footer v-if="this.$route.path === '/'"></Footer>
  </div>
</template>

<script>
import axios from 'axios';
import Footer from '../components/Footer.vue';

export default {
  data: () => ({
    error: null,
    directories: [],
    accentColor: '#F58B44',
  }),
  components: {
    Footer,
  },
  mounted() {
    const apiEP = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://demo.zoomoid.de';
    axios.get(`${apiEP}/api/v1/demo`).then((response) => {
      // at this point, v is an array of tracks. We assume they share the same
      // metadata, hence we just pick the first one and roll with it
      this.directories = response.data.data.map((v) => v.name);
    }).catch((err) => {
      this.error = err;
    });
  },
};
</script>

<style lang="scss" scoped>
.success {
  padding-top: 8em;
  width: 66%;
  margin: 0 auto;
  .logo {
    width: 100%;
    max-width: 350px;
  }
  ul {
    padding-left: 2em;
    li {
      padding: 1em 0;
      list-style: square;
      font-size: 1.5em;
      a:link, a:visited {
        font-weight: 700;
        text-decoration: none;
        color: #1a1a1a;
        padding: 4px 8px;
        vertical-align: baseline;
        &:hover, &:active {
          color: #F58B44;
          background: #1a1a1a;
        }
      }
    }
  }
}

.error {
  font-size: 24pt;
  width: 66%;
  padding-top: 8em;
  margin: 0 auto;
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
  min-height: 100vh;
  background-color: var(--accent);
}
</style>
