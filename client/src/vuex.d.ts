// vuex.d.ts
import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";

declare module "@vue/runtime-core" {
  // declare your own store states
  interface State {
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

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
