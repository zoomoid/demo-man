import { ActionTree } from "vuex";
import { ActionsTypes as ATypes, StateTypes } from "./interfaces";
import { MutationsTypes as MTypes } from "./mutations";
import { stateFactory, StatelessTrack, Track } from "./Track";

export enum ActionsTypes {
  setQueue = "setQueue",
  addTrack = "addTrack",
  replay = "replay",
  pause = "pause",
  stop = "stop",
  resume = "resume",
  play = "play",
  start = "start",
  append = "append",
  prepend = "prepend",
  dequeue = "dequeue",
  consume = "consume",
  next = "next"
}

export const actions: ActionTree<StateTypes, StateTypes> & ATypes = {
  // sets the entire queue to a list of tracks
  [ActionsTypes.setQueue]({ commit }, payload: { queue: string[] }): void {
    commit(MTypes.setQueueTracks, { tracks: payload.queue });
  },
  // add a fresh track to the store
  [ActionsTypes.addTrack]({commit}, payload: StatelessTrack): void {
    commit(MTypes.setTrack, {
      url: payload.url,
      title: payload.title,
      album: payload.album,
      artist: payload.artist,
      mp3: payload.mp3,
      duration: payload.duration,
      state: stateFactory.initialState(),
    })
  },
  // Replays the same track again as currently playing
  [ActionsTypes.replay]({ commit, getters }): void {
    const n = getters.currentTrack;
    commit(MTypes.seek, { seek: 0 });
    commit(MTypes.setTrackState, {
      trackState: stateFactory.playing(0),
      url: n,
    });
  },
  // mutates the trackState to a paused state
  [ActionsTypes.pause]({ commit, getters }): void {
    const n: Track = getters.currentTrack;
    commit(MTypes.setTrackState, {
      url: n.url,
      trackState: stateFactory.paused(n.state.progress)
    });
  },
  // mutates the trackState to a stopped state
  [ActionsTypes.stop]({ commit, getters }): void {
    const n: Track = getters.currentTrack;
    commit("setTrackState", {
      url: n.url,
      trackState: stateFactory.finished(n.state.progress)
    });
  },
}
const f = {
  // mutates the trackState to a playing state
  resume({ commit, getters }): void {
    const n: Track = getters.currentTrack;
    commit("setTrackState", {
      url: n.url,
      trackState: stateFactory.playing(n.state.progress)
    });
  },
  // immediately plays a track given by URL
  // i.e. skips addition to the queue
  // does not alter the current queue
  play({ commit, dispatch, getters }, { url }: { url: string }): void {
    dispatch("pause");
    commit("setNowPlaying", { url });
    const m: TrackState = getters.currentTrack.state;
    commit("seek", { seek: m.progress || 0 }); // either use already existing progress on a track or start from beginning
    dispatch("resume");
  },
  // if a queue is present, start playback from this queue
  start({ state, commit, getters }): void {
    if (state.queue) {
      const track = getters.track(state.queue[0]);
      commit("setTrack", track);
    }
  },
  // Action to append a track to the current queue
  append({ commit }, { url }: { url: string }): void {
    commit("append", { url });
  },
  // Action to prepend a track to the current queue
  prepend({ commit }, { url }: { url: string }): void {
    commit("prepend", { url });
  },
  // dequeue action with return to get the new track's URL
  dequeue({ state, commit }): Promise<string> {
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
  async next({ commit, state, dispatch }): Promise<void> {
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
};
