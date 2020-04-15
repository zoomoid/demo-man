<template>
  <div>
      <div class="error" v-if="!this.directories">
          <h1>There's nothing here...
          </h1>
          <p>
            Either there are currently no demos or we are experiencing
            issues with our microservices.
          </p>
          <p class="err" v-if="this.error">{{ this.error }}</p>
      </div>
      <div class="success" v-else>
        <h1>
          /demo-man
        </h1>
        <ul>
          <li v-for="directory in directories" :key="directory">
            <router-link :to="'/' + directory">{{directory}}</router-link>
          </li>
        </ul>
      </div>

  </div>
</template>

<script>
export default {
  data: () => ({
    error: null,
    directories: [
      'shades-of-yellow',
      'delay',
      '301',
      'schwerelos',
    ],
  }),
};
</script>

<style lang="scss" scoped>
.success {
  padding: 4em;
  h1 {
    font-size: 4em;
    font-weight: 700;
  }
  ul {
    padding-left: 2em;

    li {
      padding: 1em 0;
      list-style: none outside none;
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
      &::before {
        vertical-align: baseline;
        content: '/ ';
        font-size: 1em;
      }
    }
  }
}

.error {
  font-size: 24pt;
  width: 66%;
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
</style>
