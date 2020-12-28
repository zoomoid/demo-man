import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    volume: 1,
    url: "",
    title: "",
    artist: "",
    progress: {},
    duration: {},
    globalPlayState: "paused",
    playState: {},
    intersecting: false,
    mp3: "",
    seek: 0,
  },
  getters: {
    progress: (state) => state.progress,
    volume: (state) => state.volume,
    playState: (state) => state.playState,
    globalPlayState: (state) => state.globalPlayState,
    intersecting: (state) => state.intersecting,
    mp3: (state) => state.mp3,
    duration: (state) => state.duration,
    title: (state) => state.title,
    artist: (state) => state.artist,
    url: (state) => state.url,
    seek: (state) => state.seek,
  },
  mutations: {
    updateVolume(state, { volume }) {
      state.volume = volume >= 0 && volume <= 1 ? volume : state.volume;
    },
    updateMetadata(state, {
      url, mp3, title, artist, progress, duration,
    }) {
      state.url = url;
      state.mp3 = mp3;
      state.title = title;
      state.artist = artist;
      Vue.set(state.progress, url, progress);
      Vue.set(state.duration, url, duration);
    },
    seek(state, { url, seek }) {
      Vue.set(state.progress, url, seek);
      state.seek = seek;
    },
    updatePlayState(state, { playState, url }) {
      if (["playing", "finished", "paused"].includes(playState)) {
        state.globalPlayState = playState;
        Vue.set(state.playState, url, playState);
      }
    },
    updateProgress(state, { url, progress }) {
      Vue.set(state.progress, url, progress);
    },
    intersecting(state, { intersecting }) {
      state.intersecting = intersecting;
    },
  },
  actions: {
    changeTrack({ commit }, {
      url, mp3, title, artist, progress, duration,
    }) {
      commit({
        type: "updateMetadata",
        url,
        mp3,
        title,
        artist,
        duration,
        progress,
      });
    },
  },
  modules: {},
});
