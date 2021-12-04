<template>
  <article class="py-4 px-4 flex gap-8">
    <div>
      <img
        v-if="track.common && track.common.picture && track.common.picture[0]"
        :src="`data:${
          track.common.picture[0].format
        };base64,${track.common.picture[0].data.toString('base64')}`"
        :alt="'Cover of ' + track.common.album"
        class="max-h-48 rounded"
      />
    </div>
    <div>
      <div class="text-2xl font-semibold">
        <span class="text-black text-opacity-50">Title: </span>
        <span>{{ track.common.title }}</span>
      </div>
      <div class="text-lg font-medium">
        <span class="text-black text-opacity-50">Artist: </span>
        <span>{{ track.common.artist }}</span>
      </div>
      <div class="text-lg font-medium">
        <span class="text-black text-opacity-50">Album: </span>
        <span>{{ track.common.album }}</span>
      </div>
      <div class="text-sm text-black text-opacity-70">
        <span class="opacity-50">Genre: </span>
        <span>{{ track.common.genre?.join(", ") }}</span>
      </div>
      <div class="text-sm text-black text-opacity-70">
        <span class="opacity-50">Composer: </span>
        <span>{{ track.common.composer?.join(", ") }}</span>
      </div>
      <div class="text-sm text-black text-opacity-70">
        <span class="opacity-50">BPM: </span>
        <span>{{ track.common.bpm }}</span>
      </div>
      <div class="text-sm text-black text-opacity-70">
        <span class="opacity-50">Year: </span>
        <span>{{ track.common.year }}</span>
      </div>
      <div class="text-sm text-black text-opacity-70">
        <span class="opacity-50">Sample Rate: </span>
        <span>{{ track.format.sampleRate }} Hz</span>
      </div>
      <div class="text-sm text-black text-opacity-70">
        <span class="opacity-50">Bitrate: </span>
        <span>{{ (track.format.bitrate || 0) / 1000 }} KBit/s</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import * as musicMetadata from "music-metadata-browser";

defineProps<{
  track: musicMetadata.IAudioMetadata;
}>();
</script>

<style>
</style>