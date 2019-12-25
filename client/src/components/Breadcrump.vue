<template>
  <div class="breadcrump">
    <router-link to="/">
      <i class="material-icons-sharp">
        arrow_back
      </i>
    </router-link>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
.breadcrump {
  padding: 1em 2em 1em 2em;
  a {
    color: #ffffff;
    .material-icons-sharp {
      vertical-align: middle;
      line-height: 32px;
      width: 32px;
      height: 32px;
      text-align: center;
      &:hover, &:active, .muted {
        background: #424242;
        border-radius: 32px;
      }
    }

  }
}
</style>
