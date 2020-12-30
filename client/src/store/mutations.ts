import { MutationTree } from "vuex";
import { MutationsTypes as MTypes, StateTypes } from "./interfaces";
import { PlaybackSettings, Track, TrackState } from "./Track";

export enum MutationsTypes {
  updateVolume = "updateVolume",
  updateProgress = "updateProgress",
  clearNowPlaying = "clearNowPlaying",
  clearQueue = "clearQueue",
  clearTracks = "clearTracks",
  seek = "seek",
  consumeSeeked = "consumeSeeked",
  setNowPlaying = "setNowPlaying",
  setTrack = "setTrack",
  setTrackState = "setTrackState",
  setPlaybackSettings = "setPlaybackSettings",
  setQueueTracks = "setQueueTracks",
  append = "append",
  prepend = "prepend",
  dequeue = "dequeue",
  consume = "consume"
}

export const mutations: MutationTree<StateTypes> & MTypes = {
  // mutates global volume
  [MutationsTypes.updateVolume](state: StateTypes, volume: number): void {
    state.volume = volume >= 0 && volume <= 1 ? volume : state.volume;
  },
  // mutates a track's progress in its state
  // periodically called from GlobalPlayer
  [MutationsTypes.updateProgress](state: StateTypes, payload: number): void {
    const i = state.tracks.findIndex((t: Track) => t.url === state.nowPlaying);
    if (i !== -1) {
      state.tracks.splice(i, 1, {
        ...state.tracks[i],
        state: {
          ...state.tracks[i].state,
          progress: payload
        }
      });
    }
  },
  // clears the nowPlaying object of all data
  [MutationsTypes.clearNowPlaying](state: StateTypes): void {
    state.nowPlaying = undefined;
  },
  // clears the queue object of all data
  [MutationsTypes.clearQueue](state: StateTypes): void {
    state.queue = [];
  },
  // clears map of all already touched tracks
  [MutationsTypes.clearTracks](state: StateTypes): void {
    state.tracks = [];
  },
  // Seeks on a given track
  [MutationsTypes.seek](state: StateTypes, payload: { url?: string; seek: number }): void {
    // update global "played" state with touched tracks
    const i = state.tracks.findIndex((t: Track) =>
    payload.url ? t.url === payload.url : t.url === state.nowPlaying
    );
    if (i !== -1) {
      // track has already been played
      state.tracks.splice(i, 1, {
        ...state.tracks[i],
        state: { ...state.tracks[i].state, progress: payload.seek }
      });
      state.seeked = true; // set seeked flag to consume in GlobalPlayer
    }
  },
  // consumes seeked state, i.e. GlobalPlayer only changes its local progress state if
  // seeked flag is set on the store. To reset, GlobalPlayer consumes the flag
  // after seeking
  [MutationsTypes.consumeSeeked](state: StateTypes): void {
    state.seeked = false;
  },
  // sets the nowPlaying state to the new track URL
  [MutationsTypes.setNowPlaying](state: StateTypes, payload: { url: string }): void {
    state.nowPlaying = payload.url;
  },
  // Mutates the track registry, in particular a certain track, with new metadata
  [MutationsTypes.setTrack](state: StateTypes, payload: Track): void {
    const i = state.tracks.findIndex((t: Track) => t.url === payload.url);
    if (i !== -1) {
      state.tracks.splice(i, 1, payload);
    }
  },
  // mutates the state of a track given by url
  [MutationsTypes.setTrackState](
    state: StateTypes,
    payload: { url?: string; trackState: TrackState }
  ): void {
    const i = state.tracks.findIndex((t: Track) =>
      payload.url ? t.url === payload.url : t.url === state.nowPlaying
    );
    if (i !== -1) {
      // track has already been played
      state.tracks.splice(i, 1, {
        ...state.tracks[i],
        state: payload.trackState
      });
    }
  },
  // mutates the autplay, shuffle or loop properties of the current queue
  [MutationsTypes.setPlaybackSettings](state: StateTypes, payload: PlaybackSettings): void {
    state.autoplay = payload.autoplay !== undefined ? payload.autoplay : state.autoplay;
    state.loop = payload.loop !== undefined ? payload.loop : state.loop;
    state.shuffle = payload.shuffle !== undefined ? payload.shuffle : state.shuffle;
  },
  // mutates the current queue
  [MutationsTypes.setQueueTracks](state: StateTypes, payload: { tracks: string[] }): void {
    state.queue = payload.tracks;
  },
  // append a new track to the queue
  [MutationsTypes.append](state: StateTypes, payload: { url: string }): void {
    state.queue = [...state.queue, payload.url];
  },
  // prepend a new track to the queue
  [MutationsTypes.prepend](state: StateTypes, payload: { url: string }): void {
    state.queue = [payload.url, ...state.queue];
  },
  // Consumes the head track from the current queue
  // NOT TO BE USED DIRECTLY, always use the corresponding action in components
  [MutationsTypes.dequeue](state: StateTypes): void {
    state.queue = state.queue.splice(0, 1);
  },
  // Similar to dequeue, but instead of dequeueing the first element in the queue,
  // dequeue a specific one given by url
  // NOT TO BE USED DIRECTLY, always use the corresponding action, which also provides
  // indexed consumption options
  [MutationsTypes.consume](state: StateTypes, payload: { url: string }): void {
    const i = state.queue.findIndex((u: string) => u === payload.url);
    if (i !== -1) {
      state.queue = state.queue.splice(i, 1);
    }
  }
};
