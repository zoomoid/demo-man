import { ActionTree } from "vuex";
import { ActionsTypes as ATypes, StateTypes } from "./interfaces";
import { MutationsTypes as MTypes } from "./mutations";
import { stateFactory, QueueStatelessTrack, TrackState } from "./Track";

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
  [ActionsTypes.addTrack]({ commit }, payload: QueueStatelessTrack): void {
    commit(MTypes.setTrack, {
      url: payload.url,
      title: payload.title,
      album: payload.album,
      artist: payload.artist,
      mp3: payload.mp3,
      duration: payload.duration,
      state: stateFactory.initialState()
    });
  },
  // Replays the same track again as currently playing
  [ActionsTypes.replay]({ commit, getters }): void {
    const n = getters.currentTrack;
    if (n) {
      commit(MTypes.seek, { seek: 0 });
      commit(MTypes.setTrackState, {
        trackState: stateFactory.playing(0),
        url: n.url
      });
    }
  },
  // mutates the trackState to a paused state
  [ActionsTypes.pause]({ commit, getters }): void {
    const n = getters.currentTrack;
    if (n) {
      commit(MTypes.setTrackState, {
        url: n.url,
        trackState: stateFactory.paused(n.state.progress)
      });
    }
  },
  // mutates the trackState to a stopped state
  [ActionsTypes.stop]({ commit, getters }): void {
    const n = getters.currentTrack;
    if (n) {
      commit(MTypes.setTrackState, {
        url: n.url,
        trackState: stateFactory.finished(n.state.progress)
      });
    }
  },
  // mutates the trackState to a playing state
  [ActionsTypes.resume]({ commit, getters }): void {
    const n = getters.currentTrack;
    if (n) {
      commit(MTypes.setTrackState, {
        url: n.url,
        trackState: stateFactory.playing(n.state.progress)
      });
    }
  },
  // immediately plays a track given by URL i.e. skips addition to the queue
  // NOTE: does not alter the current queue
  [ActionsTypes.play]({ commit, getters, dispatch }, payload: { url: string }): void {
    dispatch(ActionsTypes.pause);
    commit(MTypes.setNowPlaying, { url: payload.url });
    const m: TrackState | undefined = getters.currentTrack?.state;
    if (m) {
      // either use already existing progress on a track or start from beginning
      commit(MTypes.seek, { seek: m.progress || 0 });
      dispatch(ActionsTypes.play);
    }
  },
  // if a queue is present, start playback from this queue
  [ActionsTypes.start]({ commit, getters, state }): void {
    if (state.queue) {
      const track = getters.track(state.queue[0]);
      if (track) {
        commit(MTypes.setTrack, track);
      }
    }
  },
  // Action to append a track to the current queue
  [ActionsTypes.append]({ commit }, payload: { url?: string }): void {
    if (payload.url) {
      commit(MTypes.append, { url: payload.url });
    }
  },
  // Action to prepend a track to the current queue
  [ActionsTypes.prepend]({ commit }, payload: { url?: string }): void {
    if (payload.url) {
      commit(MTypes.prepend, { url: payload.url });
    }
  },
  // dequeue action with return to get the new track's URL
  [ActionsTypes.dequeue]({ commit, state }): Promise<string> {
    const next = state.queue[0];
    commit(MTypes.dequeue);
    return Promise.resolve(next);
  },
  // consume action to pick a certain track from the queue
  // can either consume a given url or an index from the queue
  [ActionsTypes.consume](
    { commit, state },
    payload: { url?: string; index?: number }
  ): Promise<string> {
    if (payload.url !== undefined) {
      // consume by url
      const next = payload.url;
      commit(MTypes.consume, { url: next });
      return Promise.resolve(next);
    } else {
      if (payload.index !== undefined) {
        const next = state.queue[payload.index % state.queue.length];
        commit(MTypes.consume, { url: next });
        return Promise.resolve(next);
      } else {
        // if both parameters are undefined, treat as dequeue request
        const next = state.queue[0];
        commit(MTypes.dequeue);
        return Promise.resolve(next);
      }
    }
  },
  // If playing from a queue, switches to next track
  // store consumers such as the GlobalPlayer component should call this function
  // when their audio source file emits a "finished" event
  async [ActionsTypes.next]({ commit, state, dispatch }): Promise<void> {
    dispatch(ActionsTypes.stop);
    if (state.queue.length > 0) {
      // queue is not empty
      if (state.loop) {
        // looping enabled, and there is music between current track and queue end -> append last played track to queue
        dispatch(ActionsTypes.append, { url: state.nowPlaying });
      } else {
        // looping is disabled, don't append track to queue
      }
      let next: string;
      if (state.shuffle) {
        // shuffle enabled, pick next track at random
        const i = Math.floor(Math.random() * state.queue.length);
        next = await dispatch(ActionsTypes.consume, { index: i });
      } else {
        // shuffle not enabled -> pick next track from dequeue
        next = await dispatch(ActionsTypes.dequeue);
      }
      if (state.autoplay) {
        // advance playback to "next" track and resume playback after switching
        commit(MTypes.setNowPlaying, { url: next });
        commit(MTypes.seek, { seek: 0 }); // reset playback progress of new track to start from beginning
        dispatch(ActionsTypes.resume);
      } else {
        // autoplay is not set -> advance playback but pause playback
        commit(MTypes.setNowPlaying, { url: next });
        commit(MTypes.seek, { seek: 0 }); // reset playback progress of new track to start from beginning
        dispatch(ActionsTypes.pause);
      }
    } else {
      // queue is empty
      if (state.loop) {
        // looping is enabled, but queue does not contain any other tracks -> replay current track
        dispatch(ActionsTypes.replay);
      } else {
        // looping is disabled -> we reached the end of the queue, just stop
        dispatch(ActionsTypes.stop);
      }
    }
  }
};
