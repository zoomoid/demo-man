<template>
  <div>
    <div v-for="player in queue" v-bind:key="player.id">
      <AudioPlayer
        :id="player.id"
        :name="player.name"
        :file="player.url"
        :playStateOverrideBy="currentlyPlayingPlayer"
        v-on:playing="setPlayStateOverride"
        :tags="player.tags || []"
      ></AudioPlayer>
    </div>
    <div v-if="!queue">
      <span>No commits for release yet...</span>
    </div>
  </div>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer.vue';

export default {
  components: {
    AudioPlayer,
  },
  props: {
    queue: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {
      currentlyPlayingPlayer: -1,
    };
  },
  methods: {
    setPlayStateOverride(player) {
      this.currentlyPlayingPlayer = player;
    },
    resetPlayStateOverride() {
      this.currentlyPlayingPlayer = -1;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
