<template>
  <div>
    <h1>
      /demo-man
    </h1>
    <ul>
      <li v-for="directory in directories" :key="directory">
        <router-link :to="'/' + directory">{{directory}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
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
div {
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
        color: #1a1a1a;
      }
      &::before {
        content: '/ '
      }
    }
  }
}
</style>
