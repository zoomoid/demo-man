<template>
  <v-app light>
    <div class="wrapper" id="success">
      <h1>Success.</h1>
      <router-link to="/"
        ><v-icon>arrow_back</v-icon><span>Go back</span></router-link
      >
    </div>
  </v-app>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@600;800&display=swap");

@keyframes fade-to-success {
  0% {
    background-color: #f58b44;
  }
  100% {
    background-color: #4caf50;
  }
}
#app {
  animation: fade-to-success 1s ease 0.5s 1;
  animation-fill-mode: forwards;
  background-color: #f58b44;
  font-family: "Manrope", sans-serif;
}

.wrapper#success {
  margin: 4em auto;
  max-width: 768px;
  width: 96%;
  padding: 4em;
  border-radius: 16pt;
  h1 {
    color: white;
    font-size: 3em;
    font-weight: 800;
  }
  a {
    color: white;
    i,
    span {
      color: inherit;
      vertical-align: middle;
    }
    i {
      font-size: 1em;
      padding-right: 0.5em;
    }
    font-size: 2em;
    text-decoration: none;
  }
}
</style>
