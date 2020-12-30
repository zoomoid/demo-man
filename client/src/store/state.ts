import { StateTypes } from "./interfaces";

export const state: StateTypes = {
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
}
