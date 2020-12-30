import { GetterTree } from "vuex";
import { GettersTypes, StateTypes } from "./interfaces";
import { stateFactory, Track, TrackState } from "./Track";

export const getters: GetterTree<StateTypes, StateTypes> & GettersTypes = {
  progress: state => (url: string): number =>
    state.tracks.find((t: Track) => t.url === url)?.state.progress || 0,
  volume: (state): number => state.volume || 0,
  trackState: state => (url: string): TrackState =>
    state.tracks.find((t: Track) => t.url === url)?.state || stateFactory.initialState(),
  mp3: (state): string | undefined =>
    state.tracks.find((t: Track) => state.nowPlaying === t.url)?.mp3,
  duration: (state): number | undefined =>
    state.tracks.find((t: Track) => state.nowPlaying === t.url)?.duration,
  title: (state): string | undefined =>
    state.tracks.find((t: Track) => state.nowPlaying === t.url)?.title,
  artist: (state): string | undefined =>
    state.tracks.find((t: Track) => state.nowPlaying === t.url)?.artist,
  album: (state): string | undefined =>
    state.tracks.find((t: Track) => state.nowPlaying === t.url)?.album,
  currentTrack: (state): Track | undefined =>
    state.tracks.find((t: Track) => t.url === state.nowPlaying),
  queueTracks: (state): (Track | undefined)[] =>
    state.queue.map((url: string) => state.tracks.find((t: Track) => t.url === url)),
  track: state => (url: string): Track | undefined =>
    state.tracks.find((t: Track) => t.url === url),
  loop: (state): boolean => state.loop,
  autoplay: (state): boolean => state.autoplay,
  shuffle: (state): boolean => state.shuffle
};
