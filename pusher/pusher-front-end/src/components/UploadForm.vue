<template>
  <div class="wrapper">
    <h1>&gt; Pusher</h1>
    <v-form method="POST" enctype="multipart/form-data">
      <v-text-field
        :prepend-icon="'vpn_key'"
        :rules="[rules.required]"
        required
        :type="this.show ? 'text' : 'password'"
        name="token"
        label="Token"
        value=""
      ></v-text-field>
      <v-file-input
        show-size
        name="file"
        accept="audio/mp3"
        label="Audio file"
        prepend-icon="audiotrack"
      ></v-file-input>
      <v-btn type="submit" light large block outlined color="accent"
        >Upload</v-btn
      >
    </v-form>
  </div>
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
.wrapper {
  margin: 4em auto;
  max-width: 768px;
  width: 96%;
  background: #ffffff;
  padding: 2em;
  border-radius: 16pt;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
  h1 {
    font-size: 3em;
  }
}
</style>
