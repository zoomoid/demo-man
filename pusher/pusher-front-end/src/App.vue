<template>
  <v-app light>
    <UploadForm />
  </v-app>
</template>

<script>
import UploadForm from "./components/UploadForm";

export default {
  name: "App",

  components: {
    UploadForm
  },

  data: () => ({
    //
  })
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@600;800&display=swap");

#app {
  background: #f58b44;
  font-family: "Manrope", sans-serif;
  letter-spacing: -0.03em;
  color: #1a1a1a;
}
body {
  margin: 0;
}
* {
  box-sizing: border-box;
}
</style>
