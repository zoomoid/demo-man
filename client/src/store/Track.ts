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

export interface QueueTrack {
  url: string;
  title: string;
  artist: string;
  album: string;
  mp3: string;
  duration: number;
  state: TrackState;
}

export interface QueueStatelessTrack {
  url: string;
  title: string;
  artist: string;
  album: string;
  mp3: string;
  duration: number;
}

export type TrackStatePaused = {
  type: "paused";
  progress: number;
};

export type TrackStateStopped = {
  type: "stopped";
  finished: boolean;
  started: boolean;
  progress: number;
};

export type TrackStatePlaying = {
  type: "playing";
  progress: number;
};

export type TrackState = TrackStatePlaying | TrackStatePaused | TrackStateStopped;

export interface PlaybackSettings {
  loop: boolean;
  autoplay: boolean;
  shuffle: boolean;
}
