<template>
  <div>
    <h1>
      /
    </h1>
    <ul>
      <li>
        <router-link to="/schwerelos">Diode Eins - Schwerelos (Zoomoid Remix)</router-link>
      </li>
      <li>
        <router-link to="/301">Zoomoid - 301 Moved Permanently</router-link>
      </li>
      <li>
        <router-link to="/delay">Zoomoid - Delay (Long Version)</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
div {
  padding: 4em;
  h1 {
    font-size: 4em;
  }
  ul {
    padding-left: 2em;
    li {
      padding: 1em 0;
      list-style: square;
      font-size: 1.5em;
      a:link, a:visited {
        color: #ffffff;
      }
    }
  }
}
</style>
