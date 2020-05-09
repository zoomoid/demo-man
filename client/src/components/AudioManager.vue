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
        :accentColor="accentColor"
        :waveformUrl="player.waveformUrl"
        :no="player.no"
        :additionalData="player.additionalData"
      ></AudioPlayer>
    </div>
    <div v-if="!queue">
      <span>No tracks added yet...</span>
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
    accentColor: {
      type: String,
      default: '#FFD600',
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
