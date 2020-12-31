import { PlaybackSettings, StatelessTrack, Track, TrackState } from "./Track";
import { MutationsTypes as MTypes } from "./mutations";
import { ActionsTypes as ATypes } from "./actions";
import { CommitOptions, DispatchOptions, ActionContext, Store as VuexStore } from "vuex";

export interface StateTypes {
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

export interface GettersTypes {
  progress(state: StateTypes): (url: string) => number;
  volume(state: StateTypes): number;
  trackState(state: StateTypes): (url: string) => TrackState;
  mp3(state: StateTypes): string | undefined;
  duration(state: StateTypes): number | undefined;
  title(state: StateTypes): string | undefined;
  artist(state: StateTypes): string | undefined;
  album(state: StateTypes): string | undefined;
  currentTrack(state: StateTypes): Track | undefined;
  queueTracks(state: StateTypes): (Track | undefined)[];
  track(state: StateTypes): (url: string) => Track | undefined;
  loop(state: StateTypes): boolean;
  autoplay(state: StateTypes): boolean;
  shuffle(state: StateTypes): boolean;
}

export type MutationsTypes<S = StateTypes> = {
  [MTypes.updateVolume](state: S, payload: number): void;
  [MTypes.updateProgress](state: S, payload: number): void;
  [MTypes.clearNowPlaying](state: S): void;
  [MTypes.clearTracks](state: S): void;
  [MTypes.clearQueue](state: S): void;
  [MTypes.seek](state: S, payload: { url?: string; seek: number }): void;
  [MTypes.consumeSeeked](state: S): void;
  [MTypes.setNowPlaying](state: S, payload: { url: string }): void;
  [MTypes.setTrack](state: S, payload: Track): void;
  [MTypes.setTrackState](state: S, payload: { url: string; trackState: TrackState }): void;
  [MTypes.setPlaybackSettings](state: S, payload: PlaybackSettings): void;
  [MTypes.setQueueTracks](state: S, payload: { tracks: string[] }): void;
  [MTypes.append](state: S, payload: { url: string }): void;
  [MTypes.prepend](state: S, payload: { url: string }): void;
  [MTypes.dequeue](state: S): void;
  [MTypes.consume](state: S, payload: { url: string }): void;
};

export interface ActionsTypes {
  [ATypes.setQueue]({ commit }: AugmentedActionContext, payload: { queue: string[] }): void;
  [ATypes.addTrack]({ commit }: AugmentedActionContext, payload: StatelessTrack): void;
  [ATypes.replay]({ commit, getters }: AugmentedActionContext): void;
  [ATypes.pause]({ commit, getters }: AugmentedActionContext): void;
  [ATypes.stop]({ commit, getters }: AugmentedActionContext): void;
  [ATypes.resume]({ commit, getters }: AugmentedActionContext): void;
  [ATypes.play](
    { commit, dispatch, getters }: AugmentedActionContext,
    payload: { url: string }
  ): void;
  [ATypes.start]({ commit, getters, state }: AugmentedActionContext): void;
  [ATypes.append]({ commit }: AugmentedActionContext, payload: { url?: string }): void;
  [ATypes.prepend]({ commit }: AugmentedActionContext, payload: { url?: string }): void;
  [ATypes.dequeue]({ commit, state }: AugmentedActionContext): Promise<string>;
  [ATypes.consume](
    { commit, state }: AugmentedActionContext,
    payload: { url?: string; index?: number }
  ): Promise<string>;
  [ATypes.next]({ commit, state, dispatch }: AugmentedActionContext): Promise<void>;
}

export type AugmentedActionContext = Omit<
  ActionContext<StateTypes, StateTypes>,
  "commit" | "getters" | "dispatch"
> & {
  commit<K extends keyof MutationsTypes, P extends Parameters<MutationsTypes[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<MutationsTypes[K]>;
} & {
  getters: {
    [K in keyof GettersTypes]: ReturnType<GettersTypes[K]>;
  };
} & {
  dispatch<K extends keyof ActionsTypes>(
    key: K,
    payload?: Parameters<ActionsTypes[K]>[1],
    options?: DispatchOptions
  ): ReturnType<ActionsTypes[K]>;
};

export type Store<S = StateTypes> = Omit<
  VuexStore<S>,
  "commit" | "getters" | "dispatch"
> & {
  commit<
    K extends keyof MutationsTypes,
    P extends Parameters<MutationsTypes[K]>[1]
  >(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<MutationsTypes[K]>;
} & {
  getters: {
    [K in keyof GettersTypes]: ReturnType<GettersTypes[K]>;
  };
} & {
  dispatch<K extends keyof ActionsTypes>(
    key: K,
    payload?: Parameters<ActionsTypes[K]>[1],
    options?: DispatchOptions
  ): ReturnType<ActionsTypes[K]>;
};
