import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    volume: 1,
    nowPlaying: {
      url: '',
      progress: 0,
      duration: 0,
    },
    playState: 'paused',
  },
  mutations: {
    updateVolume(state, volume) {
      state.volume = volume;
    },
    updateNowPlaying(state, { url, progress, duration }) {
      state.nowPlaying = { url, progress, duration };
    },
    updatePlayState(state, playState) {
      if (['playing', 'finished', 'paused'].includes(playState)) {
        state.playState = playState;
      }
    },
    updateProgress(state, progress) {
      state.nowPlaying.progres = progress;
    },
  },
  actions: {
  },
  modules: {
  },
});
