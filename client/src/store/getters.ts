import { GetterTree } from "vuex";
import { GettersTypes, StateTypes } from "./interfaces";
import { stateFactory, QueueTrack, TrackState } from "./Track";

export const getters: GetterTree<StateTypes, StateTypes> & GettersTypes = {
  progress: state => (url: string): number =>
    state.tracks.find((t: QueueTrack) => t.url === url)?.state.progress || 0,
  volume: (state): number => state.volume || 0,
  trackState: state => (url: string): TrackState =>
    state.tracks.find((t: QueueTrack) => t.url === url)?.state || stateFactory.initialState(),
  mp3: (state): string | undefined =>
    state.tracks.find((t: QueueTrack) => state.nowPlaying === t.url)?.mp3,
  duration: (state): number | undefined =>
    state.tracks.find((t: QueueTrack) => state.nowPlaying === t.url)?.duration,
  title: (state): string | undefined =>
    state.tracks.find((t: QueueTrack) => state.nowPlaying === t.url)?.title,
  artist: (state): string | undefined =>
    state.tracks.find((t: QueueTrack) => state.nowPlaying === t.url)?.artist,
  album: (state): string | undefined =>
    state.tracks.find((t: QueueTrack) => state.nowPlaying === t.url)?.album,
  currentTrack: (state): QueueTrack | undefined =>
    state.tracks.find((t: QueueTrack) => t.url === state.nowPlaying),
  queueTracks: (state): (QueueTrack | undefined)[] =>
    state.queue.map((url: string) => state.tracks.find((t: QueueTrack) => t.url === url)),
  track: state => (url: string): QueueTrack | undefined =>
    state.tracks.find((t: QueueTrack) => t.url === url),
  loop: (state): boolean => state.loop,
  autoplay: (state): boolean => state.autoplay,
  shuffle: (state): boolean => state.shuffle,
  seeked: (state): boolean => state.seeked,
};
