import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const track = {
  initialState: () => ({
    type: "stopped",
    started: false,
    finished: false,
    progress: 0,
  }),
  finished: (progress) => ({
    type: "stopped",
    finished: true,
    started: true,
    progress
  }),
  paused: (progress) => ({
    type: "paused",
    progress
  }),
  playing: (progress) => ({
    type: "playing",
    progress
  })
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    volume: 1,
    nowPlaying: null,
    tracks: {},
    autoplay: true,
    loop: false,
    queue: {
      tracks: [],
      index: 0,
    }
  },
  getters: {
    progress: state => url => state.tracks[url]?.state.progress || 0,
    volume: state => state.volume || 0,
    trackState: state => url => state.tracks[url]?.state || track.initialState(),
    queueIndex: state => state.queue.index || -1,
    mp3: state => url => state.tracks[url]?.mp3 || state.tracks[state.nowPlaying]?.mp3 || null,
    duration: state => url => state.tracks[url]?.duration || state.tracks[state.nowPlaying]?.duration || null,
    title: state => url => state.tracks[url]?.title || state.tracks[state.nowPlaying]?.title || null,
    artist: state => url => state.tracks[url]?.artist || state.tracks[state.nowPlaying]?.artist || null,
    album: state => url => state.tracks[url]?.title || state.tracks[state.nowPlaying]?.title || null,
    currentTrack: state => state.tracks[state.nowPlaying] || null,
    queueTracks: state => state.queue.tracks,
    track: state => url => state.played[url],
    loop: state => state.loop,
    autoplay: state => state.autoplay,
  },
  mutations: {
    // mutates global volume
    updateVolume(state, { volume }) {
      state.volume = volume >= 0 && volume <= 1 ? volume : state.volume;
    },
    /**
     * mutates the currently playing track
     * NOTE: does not alter the state of "played" for the same track!
     * This is done using actions instead of mutations such that we can
     * compose atomic mutations into actions
     */
    updateNowPlaying(state, { url }) {
      state.nowPlaying = url;
    },
    // Mutates the track registry, in particular a certain track, with new metadata
    updateTrack(state, { url, mp3, title, artist, duration, trackState }) {
      state.tracks = {
        ...state.tracks,
        [url]: {
          url,
          mp3,
          title,
          artist,
          duration,
          state: trackState
        }
      };
    },
    // clears the nowPlaying object of all data
    clearNowPlaying(state) {
      state.nowPlaying = {};
    },
    // clears the queue object of all data
    clearQueue(state) {
      state.queue = {
        ...state.queue,
        tracks: []
      };
    },
    // clears map of all already touched tracks
    clearPlayed(state) {
      state.played = {};
    },
    // Seeks on a given track
    seek(state, { url, seek }) {
      // update global "played" state with touched tracks
      if (state.played[url]) {
        // track has already been played
        const played = state.played[url];
        state.played = {
          ...state.played,
          [url]: {
            ...played,
            state: {
              ...played.state,
              progress: seek
            }
          }
        };
      }
    },
    /**
     * Mutates the TrackState of both the currently playing track and the copy in "played"
     */
    updateTrackState(state, { url, trackState }) {
      let playedTrack = state.played[url];
      state.played = {
        ...state.played, // spread existing played states
        [url]: {
          // override track in question
          ...playedTrack,
          state: trackState
        }
      };
    },
    // mutates only the autplay or loop properties of the current queue
    updatePlaybackSettings(state, { autoplay, loop }) {
      state.autoplay = autoplay;
      state.loop = loop;
    },
    // mutates the current queue
    updateQueue(state, { title, queue, index, autoplay, loop }) {
      state.queue = {
        title,
        queue,
        autoplay,
        loop,
        index
      };
    }
  },
  actions: {
    // TODO: implement me
    pushQueue({ commit }, { title, queue, autoplay, index, loop }) {
      commit("updateQueue", { title, queue, index, autoplay, loop });
    },
    // add a fresh track to the store
    addTrack({ commit }, { url, title, artist, album, mp3, duration }) {
      commit("updateTrack", {
        url,
        title,
        artist,
        album,
        mp3,
        duration,
        state: initialState()
      })
    },
    // Replays the same track again as currently playing
    replay({ state, dispatch }) {
      const n = state.nowPlaying;
      dispatch("changeTrack", {
        url: n.url,
        mp3: n.mp3,
        title: n.title,
        artist: n.artist,
        progress: 0, // reset to start
        duration: n.duration
      });
    },
    // mutates the trackState to a paused state
    pause({ state, commit }) {
      const n = state.nowPlaying;
      commit("updateTrackState", {
        url: n.url,
        trackState: { type: "paused", progress: n.progress }
      });
    },
    // mutates the trackState to a stopped state
    stop({ state, commit }) {
      const n = state.nowPlaying;
      commit("updateTrackState", {
        url: n.url,
        trackState: { type: "stopped", started: true, finished: true }
      });
    },
    // mutates the trackState to a playing state
    resume({ state, commit }) {
      const n = state.nowPlaying;
      commit("updateTrackState", {
        url: n.url,
        trackState: { type: "playing", progress: n.progress }
      });
    },
    // mutates the currently playing track
    // TODO: implement me
    changeTrack(
      { commit, state, dispatch },
      { url, mp3, title, artist, progress, duration }
    ) {
      const n = state.nowPlaying;
      dispatch("pause");
      commit("updateTrack", {

      });

    },
    // if a queue is present, start playback from this queue
    start({ state, commit }) {

    },
    // Dispatches changeTrack mutations to play a given (not necessarily) already played track
    play({ dispatch, state }, { url, mp3, title, artist, duration }) {
      if (state.played[url]) {
        // track has already been played before
        dispatch("changeTrack", {
          url,
          mp3,
          title,
          artist,
          progress: state.played[url].progress,
          duration
        });
      } else {
        // track not yet played, start with duration: 0
        dispatch("changeTrack", {
          url,
          mp3,
          title,
          artist,
          progress: 0,
          duration
        });
      }
    },
    // If playing from a queue, determines what song to play next
    // store consumers such as the GlobalPlayer component should call this function
    // when their audio source file emits a "finished" event
    next({ commit, state }) {
      if (
        state.queue &&
        state.queue.index >= 0 &&
        state.queue.index <= state.queue.tracks.length
      ) {
        if (state.queue.index == state.queue.tracks.length) {
          if (state.queue.loop) {
            // we're at the last track in the queue and looping is enabled, loop back to first one
            let track = state.queue.tracks[0];
            let progress = state.played[track.url]
              ? state.played[track.url].progress
              : track.progress;
            track = {
              title: track.title,
              artist: track.artist,
              url: track.url,
              mp3: track.mp3,
              duration: track.duration,
              progress: progress // resume progress from already existing state
            };

            commit("updateTrack", {
              ...track
            });
            // commit({
            //   type: "updateNowPlaying",
            //   ...track
            // });
            commit("updateTrackState", {
              url: track.url,
              trackState: {
                state: "playing",
                progress: progress
              }
            });
          } else {
            // looping is disabled, hence mutate play state to { state: "stopped", finished: true, started: true }
            commit("updateTrackState", {
              url: state.nowPlaying,
              trackState: {
                state: "stopped",
                finished: true,
                started: true
              }
            });
            // clear nowPlaying
            commit("clearNowPlaying");
          }
        } else {
          // not yet at last track in queue, just advance to the next track in line
          let index = state.queue.index + 1;
          let track = state.queue.tracks[index];
          let progress = state.played[track.url]
            ? state.played[track.url].progress
            : track.progress;
          track = {
            title: track.title,
            artist: track.artist,
            url: track.url,
            mp3: track.mp3,
            duration: track.duration,
            progress: progress
          };
          commit("updateTrack", {
            ...track
          });
          commit("updateNowPlaying", {
            ...track
          });
        }
      } else {
        // queue not set or bounds check failed!
        // this is an explicit error state we want to handle - fast recover be resetting the nowPlaying and queue entirely
        commit("clearNowPlaying");
      }
    }
  },
  modules: {}
});
