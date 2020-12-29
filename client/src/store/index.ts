import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const stateFactory = {
  initialState: (): TrackStateStopped => ({
    type: "stopped",
    started: false,
    finished: false,
    progress: 0
  }),
  finished: (progress: number): TrackStateStopped => ({
    type: "stopped",
    finished: true,
    started: true,
    progress
  }),
  paused: (progress: number): TrackStatePaused => ({
    type: "paused",
    progress
  }),
  playing: (progress: number): TrackStatePlaying => ({
    type: "playing",
    progress
  })
};

export interface Track {
  url: string,
  title: string,
  artist: string,
  album: string,
  mp3: string,
  duration: number,
  state: TrackState,
}

export interface StatelessTrack {
  url: string,
  title: string,
  artist: string,
  album: string,
  mp3: string,
  duration: number,
}

type TrackStatePaused = {
  type: "paused",
  progress: number,
}

type TrackStateStopped = {
  type: "stopped",
  finished: boolean,
  started: boolean,
  progress: number,
}

type TrackStatePlaying = {
  type: "playing",
  progress: number,
}

type TrackState = TrackStatePlaying | TrackStatePaused | TrackStateStopped;


export interface State {
  seeked: boolean;
  volume: number;
  nowPlaying?: string;
  tracks: Track[];
  autoplay: boolean;
  loop: boolean;
  shuffle: boolean;
  globalState: {
    type: "playing" | "paused" | "stopped";
    finished: boolean;
    started: false;
  };
  queue: string[];
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    seeked: false,
    volume: 1,
    nowPlaying: undefined,
    tracks: [],
    autoplay: true,
    loop: false,
    shuffle: false,
    globalState: {
      type: "stopped",
      started: false,
      finished: false
    },
    queue: []
  } as State,
  getters: {
    progress: state => (url: string) =>
      state.tracks.find((t: Track) => t.url === url)?.state.progress || 0,
    volume: state => state.volume || 0,
    trackState: state => (url: string) =>
      state.tracks.find((t: Track) => t.url === url)?.state || stateFactory.initialState(),
    mp3: state => state.tracks.find((t: Track) => state.nowPlaying === t.url)?.mp3,
    duration: state => state.tracks.find((t: Track) => state.nowPlaying === t.url)?.duration,
    title: state => state.tracks.find((t: Track) => state.nowPlaying === t.url)?.title,
    artist: state => state.tracks.find((t: Track) => state.nowPlaying === t.url)?.artist,
    album: state => state.tracks.find((t: Track) => state.nowPlaying === t.url)?.album,
    currentTrack: state => state.tracks.find((t: Track) => t.url === state.nowPlaying),
    queueTracks: state =>
      state.queue.map((url: string) => state.tracks.find((t: Track) => t.url === url)),
    track: state => (url: string): Track | undefined =>
      state.tracks.find((t: Track) => t.url === url),
    loop: state => state.loop,
    autoplay: state => state.autoplay
  },
  mutations: {
    // mutates global volume
    updateVolume(state, { volume }) {
      state.volume = volume >= 0 && volume <= 1 ? volume : state.volume;
    },
    // clears the nowPlaying object of all data
    clearNowPlaying(state) {
      state.nowPlaying = undefined;
    },
    // clears the queue object of all data
    clearQueue(state) {
      state.queue = [];
    },
    // clears map of all already touched tracks
    clearPlayed(state) {
      state.tracks = [];
    },
    // Seeks on a given track
    seek(state, { url, seek }: { url?: string; seek: number }) {
      // update global "played" state with touched tracks
      const i = state.tracks.findIndex((t: Track) =>
        url ? t.url === url : t.url === state.nowPlaying
      );
      if (i !== -1) {
        // track has already been played
        state.tracks.splice(i, 1, {
          ...state.tracks[i],
          state: { ...state.tracks[i].state, progress: seek }
        });
        state.seeked = true; // set seeked flag to consume in GlobalPlayer
      }
    },
    // consumes seeked state, i.e. GlobalPlayer only changes its local progress state if
    // seeked flag is set on the store. To reset, GlobalPlayer consumes the flag
    // after seeking
    consumeSeeked(state) {
      state.seeked = false;
    },
    // sets the nowPlaying state to the new track URL
    setNowPlaying(state, { url }) {
      state.nowPlaying = url;
    },
    // Mutates the track registry, in particular a certain track, with new metadata
    setTrack(state, track: Track) {
      const i = state.tracks.findIndex((t: Track) => t.url === track.url);
      if (i !== -1) {
        state.tracks.splice(i, 1, track);
      }
    },
    // mutates the state of a track given by url
    setTrackState(state, { url, trackState }: { url?: string; trackState: TrackState }) {
      const i = state.tracks.findIndex((t: Track) =>
        url ? t.url === url : t.url === state.nowPlaying
      );
      if (i !== -1) {
        // track has already been played
        state.tracks.splice(i, 1, {
          ...state.tracks[i],
          state: trackState
        });
      }
    },
    // mutates the autplay, shuffle or loop properties of the current queue
    setPlaybackSettings(
      state,
      { autoplay, loop, shuffle }: { autoplay?: boolean; loop?: boolean; shuffle?: boolean }
    ) {
      state.autoplay = autoplay !== undefined ? autoplay : state.autoplay;
      state.loop = loop !== undefined ? loop : state.loop;
      state.shuffle = shuffle !== undefined ? shuffle : state.shuffle;
    },
    // mutates the current queue
    setQueueTracks(state, { tracks }: { tracks: string[] }) {
      state.queue = tracks;
    },
    // append a new track to the queue
    append(state, { url }: { url: string }) {
      state.queue = [...state.queue, url];
    },
    // prepend a new track to the queue
    prepend(state, { url }: { url: string }) {
      state.queue = [url, ...state.queue];
    },
    // Consumes the head track from the current queue
    // NOT TO BE USED DIRECTLY, always use the corresponding action in components
    dequeue(state) {
      state.queue = state.queue.splice(0, 1);
    },
    // Similar to dequeue, but instead of dequeueing the first element in the queue, dequeue a specific one given by url
    // NOT TO BE USED DIRECTLY, always use the corresponding action, which also provides indexed consumption options
    consume(state, { url }: { url: string }) {
      const i = state.queue.findIndex((u: string) => u === url);
      if (i !== -1) {
        state.queue = state.queue.splice(i, 1);
      }
    },
    // mutates a track's progress in its state
    // periodically called from GlobalPlayer
    updateProgress(state, { progress }: { progress: number }) {
      const i = state.tracks.findIndex((t: Track) => t.url === state.nowPlaying);
      if (i !== -1) {
        state.tracks.splice(i, 1, {
          ...state.tracks[i],
          state: {
            ...state.tracks[i].state,
            progress: progress
          }
        });
      }
    }
  },
  actions: {
    // sets the entire queue and the current play index
    setQueue({ commit }, { queue }: { queue: string[] }) {
      commit("setQueueTracks", { queue });
    },
    // add a fresh track to the store
    addTrack({ commit }, { url, title, artist, album, mp3, duration }: StatelessTrack) {
      commit("setTrack", {
        url,
        title,
        artist,
        album,
        mp3,
        duration,
        state: stateFactory.initialState()
      } as Track);
    },
    // Replays the same track again as currently playing
    replay({ commit }) {
      commit("seek", { seek: 0 });
    },
    // mutates the trackState to a paused state
    pause({ commit, getters }) {
      const n: Track = getters.currentTrack;
      commit("setTrackState", {
        url: n.url,
        trackState: stateFactory.paused(n.state.progress)
      });
    },
    // mutates the trackState to a stopped state
    stop({ commit, getters }) {
      const n: Track = getters.currentTrack;
      commit("setTrackState", {
        url: n.url,
        trackState: stateFactory.finished(n.state.progress)
      });
    },
    // mutates the trackState to a playing state
    resume({ commit, getters }) {
      const n: Track = getters.currentTrack;
      commit("setTrackState", {
        url: n.url,
        trackState: stateFactory.playing(n.state.progress)
      });
    },
    // immediately plays a track given by URL
    // i.e. skips addition to the queue
    // does not alter the current queue
    play({ commit, dispatch, getters }, { url }: { url: string }) {
      dispatch("pause");
      commit("setNowPlaying", { url });
      const m: TrackState = getters.currentTrack.state;
      commit("seek", { seek: m.progress || 0 }); // either use already existing progress on a track or start from beginning
      dispatch("resume");
    },
    // if a queue is present, start playback from this queue
    start({ state, commit, getters }) {
      if (state.queue) {
        const track = getters.track(state.queue[0]);
        commit("setTrack", track);
      }
    },
    // Action to append a track to the current queue
    append({ commit }, { url }: { url: string }) {
      commit("append", { url });
    },
    // Action to prepend a track to the current queue
    prepend({ commit }, { url }: { url: string }) {
      commit("prepend", { url });
    },
    // dequeue action with return to get the new track's URL
    dequeue({ state, commit }) {
      const next = state.queue[0];
      commit("dequeue");
      return Promise.resolve(next);
    },
    // consume action to pick a certain track from the queue
    // can either consume a given url or an index from the queue
    consume({ commit, state }, { url, index }: { url?: string; index?: number }): Promise<string> {
      if (url !== undefined) {
        // consume by url
        const next = url;
        commit("consume", { next });
        return Promise.resolve(next);
      } else {
        if (index !== undefined) {
          const next = state.queue[index % state.queue.length];
          commit("consume", { next });
          return Promise.resolve(next);
        } else {
          // if both parameters are undefined, treat as dequeue request
          const next = state.queue[0];
          commit("dequeue");
          return Promise.resolve(next);
        }
      }
    },
    // If playing from a queue, switches to next track
    // store consumers such as the GlobalPlayer component should call this function
    // when their audio source file emits a "finished" event
    async next({ commit, state, dispatch }) {
      dispatch("stop");
      if (state.queue.length > 0) {
        // queue is not empty
        if (state.loop) {
          // looping enabled, and there is music between current track and queue end -> append last played track to queue
          dispatch("append", { url: state.nowPlaying });
        } else {
          // looping is disabled, don't append track to queue
        }
        let next: string;
        if (state.shuffle) {
          // shuffle enabled, pick next track at random
          const i = Math.floor(Math.random() * state.queue.length);
          next = await dispatch("consume", { index: i });
        } else {
          // shuffle not enabled -> pick next track from dequeue
          next = await dispatch("dequeue");
        }
        if (state.autoplay) {
          // advance playback to "next" track and resume playback after switching
          commit("setNowPlaying", { url: next });
          commit("seek", { seek: 0 }); // reset playback progress of new track to start from beginning
          dispatch("resume");
        } else {
          // autoplay is not set -> advance playback but pause playback
          dispatch("play", { url: next });
          commit("setNowPlaying", { url: next });
          commit("seek", { seek: 0 }); // reset playback progress of new track to start from beginning
          dispatch("pause");
        }
      } else {
        // queue is empty
        if (state.loop) {
          // looping is enabled, but queue does not contain any other tracks -> replay current track
          dispatch("replay");
        } else {
          // looping is disabled -> we reached the end of the queue, just stop
          dispatch("stop");
        }
      }
    }
  },
  modules: {}
});
