<script setup lang="ts">
import * as musicMetadata from "music-metadata-browser";

import HeadBanner from "./components/HeadBanner.vue";
import AudioFile from "./components/AudioFile.vue";

import { ref, onMounted, reactive, computed, watch } from "vue";
import axios from "axios";

const file = ref<HTMLFormElement>();

const files: File[] = reactive([]);
const metadata: musicMetadata.IAudioMetadata[] = reactive([]);

let error = null;
let invalidFormat = ref(false);

const isAnalysing = computed(() => {
  return metadata.length < files.length;
});

const totalFileSize = computed(() => {
  return (files.reduce((p, f) => p + f.size, 0) / 1000000).toFixed(1);
});

onMounted(() => {
  [
    "drag",
    "dragstart",
    "dragend",
    "dragover",
    "dragenter",
    "dragleave",
    "drop",
  ].forEach(function (evt: string) {
    file?.value?.addEventListener(
      evt,
      (e: any) => {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
  });
  file?.value?.addEventListener("drop", async (e) => {
    // console.log(e.dataTransfer?.files);
    invalidFormat.value = false;
    const fs = e?.dataTransfer?.files;
    if (!fs) {
      return;
    }
    for (let i = 0; i < fs.length; i++) {
      const f = fs.item(i);
      if (f) {
        if (f.type == "audio/mpeg") {
          files.push(f);
          musicMetadata.parseBlob(f).then((m) => {
            console.log(m);
            metadata.push(m);
          });
        } else {
          invalidFormat.value = true;
        }
      }
    }
  });
});

let progress = 0;

const submit = () => {
  let formData = new FormData();

  files.forEach((f, i) => {
    formData.append(`files[${i}]`, f);
  });

  axios.post("/watchdog/api/v2", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (uploadEvent: ProgressEvent) => {
      progress = Math.round((uploadEvent.loaded * 100) / uploadEvent.total);
    },
  });
};

const clearFiles = () => {
  for (let i = files.length; i > 0; i--) {
    files.pop();
    metadata.pop();
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="shadow-inner">
      <head-banner></head-banner>
    </header>
    <main class="shadow flex-grow">
      <div class="">
        <div class="">
          <form
            action=""
            ref="file"
            method="post"
            @submit="null"
            id="upload"
            enctype="multipart/form-data"
          >
            <div class="max-w-screen-lg mx-auto" v-if="files.length == 0">
              <p class="text-center opacity-50 mt-4">
                Upload audio files to get them into demo-man
              </p>
              <div
                class="
                  bg-gray-50
                  rounded-xl
                  border-solid border-gray-400 border border-opacity-20
                  px-8
                  py-16
                  my-4
                  mx-8
                "
              >
                <i
                  class="
                    material-icons-round
                    text-4xl
                    block
                    text-center text-black text-opacity-50
                  "
                  >note_add</i
                >
                <span class="font-medium block text-center text-sm"
                  >Add an audio file</span
                >
                <span
                  class="text-black text-opacity-50 block text-center text-xs"
                  >Drag a file or click the button</span
                >
                <span class="text-center block mt-4">
                  <button
                    type="button"
                    class="
                      inline-flex
                      items-center
                      px-4
                      py-2
                      border border-transparent
                      rounded-md
                      shadow-sm
                      text-sm
                      font-medium
                      text-white
                      bg-blue-600
                      hover:bg-blue-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-offset-2
                      focus:ring-blue-500
                      gap-2
                    "
                    @click="null"
                  >
                    <i class="material-icons-round -ml-2 mr-1">add</i>
                    Upload
                  </button>
                </span>
              </div>
            </div>

            <div v-else class="max-w-screen-lg mx-auto px-8 lg:px-0">
              <div class="mt-4 px-4 py-4 shadow rounded flex items-center">
                <button
                  class="
                    inline-flex
                    items-center
                    px-4
                    py-2
                    border border-transparent
                    rounded-md
                    shadow-sm
                    text-sm
                    font-medium
                    text-white
                    bg-red-600
                    hover:bg-red-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-red-500
                  "
                  type="button"
                  @click="clearFiles()"
                >
                  <i class="-ml-2 mr-1 material-icons-round"> delete </i>
                  Cancel
                </button>
                <div
                  class="
                    flex-grow
                    text-black text-opacity-50 text-sm
                    px-4
                    text-center
                  "
                >
                  Uploading {{ files.length }} files, in total
                  {{ totalFileSize }} MB, to demo-man
                </div>
                <button
                  class="
                    inline-flex
                    items-center
                    px-4
                    py-2
                    border border-transparent
                    rounded-md
                    shadow-sm
                    text-sm
                    font-medium
                    text-white
                    bg-blue-600
                    hover:bg-blue-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-blue-500
                  "
                  type="button"
                  @click="submit()"
                >
                  <i class="-ml-2 mr-1 material-icons-round">
                    drive_folder_upload
                  </i>
                  Upload Files
                </button>
              </div>
              <span v-if="isAnalysing" class="text-sm block my-4"
                >Metadata is being analysed...</span
              >
              <span class="mt-4 block font-medium"
                >Staged files for upload:</span
              >
              <div class="divide-y">
                <audio-file
                  v-for="m in metadata"
                  :key="m.common.title"
                  :track="m"
                ></audio-file>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
    <footer></footer>
  </div>
</template>

<style lang="postcss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
