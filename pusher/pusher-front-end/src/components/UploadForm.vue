<template>
  <v-app light>
    <div class="wrapper">
      <h1>&gt; Pusher</h1>
      <v-form method="POST" action="/push" enctype="multipart/form-data">
        <v-text-field
          :prepend-icon="'vpn_key'"
          :rules="[rules.required]"
          required
          :type="this.show ? 'text' : 'password'"
          name="token"
          label="Token"
          dark
          value=""
          color="white"
        ></v-text-field>
        <v-file-input
          show-size
          dark
          name="file"
          accept="audio/mp3"
          label="Audio file"
          color="white"
          prepend-icon="audiotrack"
        ></v-file-input>
        <v-btn type="submit" large rounded block color="white">Upload</v-btn>
      </v-form>
    </div>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    file: null,
    token: null,
    show: false,
    rules: {
      required: value => !!value || "Required."
    }
  })
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@600;800&display=swap");

#app {
  background: #f58b44;
  font-family: "Manrope", sans-serif;
  letter-spacing: -0.03em;
  color: #ffffff;
}
.wrapper {
  margin: 4em auto;
  max-width: 768px;
  width: 96%;
  // background: #ffffff;
  padding: 4em;
  // border-radius: 16pt;
  // box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
  h1 {
    font-size: 3em;
  }
}
</style>
